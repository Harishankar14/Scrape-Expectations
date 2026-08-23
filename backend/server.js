require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const CACHE_TTL_MS       = 10 * 60 * 1000; // results stay fresh for 10 min
const REQUEST_TIMEOUT_MS = 20000;
const DEBUG              = true;   // prints the first raw item so you can see field names — set false when happy

const ALLOWED = ['amazon', 'flipkart', 'meesho', 'myntra'];

const http = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 10 }),
});

/* ------------------------------------------------------------------ *
 * Cache (with expiry)
 * ------------------------------------------------------------------ */
const searchCache = new Map();
function cacheGet(key) {
  const hit = searchCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) { searchCache.delete(key); return null; }
  return hit.data;
}
function cacheSet(key, data) { searchCache.set(key, { at: Date.now(), data }); }

function extractPrice(raw) {
  if (typeof raw === 'number') return raw;
  if (raw && typeof raw.value === 'number') return raw.value;
  if (typeof raw === 'string') {
    const m = raw.replace(/,/g, '').match(/\d+(\.\d+)?/); // first number; ignores ₹ and price ranges
    return m ? parseFloat(m[0]) : 0;
  }
  return 0;
}

function detectRetailer(item) {
  const hay = [
    item.source, item.seller, item.merchant, item.store, item.shop,
    item.link, item.url, item.product_link,
  ].filter(Boolean).join(' ').toLowerCase();
  return ALLOWED.find(name => hay.includes(name)) || null;
}

// Bright Data put the products under "shopping" (confirmed via debug.js)
function pickItems(body) {
  if (Array.isArray(body.shopping))         return body.shopping;
  if (Array.isArray(body.shopping_results)) return body.shopping_results;
  if (Array.isArray(body.organic))          return body.organic;
  return [];
}

function mapItem(item, index) {
  const source = item.source || item.seller || item.merchant || item.store || item.shop || '';
  return {
    id:          `serp_${index}_${Math.random().toString(36).slice(2, 8)}`,
    productName: item.title || item.name || 'Unknown Product',
    price:       extractPrice(item.price ?? item.extracted_price ?? item.offer_price),
    currency:    '₹',
    source:      source || 'Unknown',
    retailer:    detectRetailer(item),
    delivery:    item.delivery || item.shipping || null,
    tags:        item.extensions || item.badges || item.tags || [],
    imageUrl:    item.image || item.thumbnail || item.image_url || 'https://via.placeholder.com/150',
    productUrl:  item.link || item.url || item.product_link || '#',
  };
}

async function scrapeShopping(query, token) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=shop&gl=in&hl=en`;

  const { data } = await http.post(
    'https://api.brightdata.com/request',
    { zone: 'serp_api1', url, format: 'json', data_format: 'parsed' },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  let body = data;
  if (data && data.body && typeof data.body === 'string') {
    try { body = JSON.parse(data.body); } catch { /* keep raw */ }
  }
  //console.log(data)
  return pickItems(body);
}
async function scrapeAmazonPrebuilt(query, token) {
  const apiUrl = 'https://api.brightdata.com/datasets/v3/scrape?dataset_id=gd_l7q7dkf244hwjntr0&notify=false&include_errors=true&type=discover_new&discover_by=keyword';

  try {
    const { data } = await http.post(
      apiUrl,
      {
        input: [{
          keyword: query,
          zipcode: "",
          domain: "amazon.in" // Target Amazon India
        }],
        limit_per_input: null
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rawItems = Array.isArray(data) ? data : (data?.results || []);

    return rawItems.map((item, index) => ({
      id:          `amz_${index}_${Math.random().toString(36).slice(2, 8)}`,
      productName: item.title || item.name || 'Unknown Product',
      price:       extractPrice(item.price || item.final_price || item.initial_price),
      currency:    '₹',
      source:      'Amazon',
      retailer:    'amazon',
      delivery:    item.delivery_message || item.shipping || null,
      tags:        item.is_best_seller ? ['Best Seller'] : [],
      imageUrl:    item.image || item.image_url || 'https://via.placeholder.com/150',
      productUrl:  item.url || item.product_url || '#'
    })).filter(p => p.price > 0 && p.productName !== 'Unknown Product');

  } catch (e) {
    console.error(`[Scrape-Expectations] Amazon Dataset API Error: ${e?.response?.data || e.message}`);
    return [];
  }
}

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Search query is required' });

  const cacheKey = query.toLowerCase().trim();

  const cached = cacheGet(cacheKey);
  if (cached) {
    console.log(`[Scrape-Expectations] Returning Cached Results for: "${query}"`);
    return res.json({ success: true, cached: true, query, count: cached.length, results: cached });
  }

  const apiToken = process.env.BRIGHT_DATA_API_TOKEN;

  if (!apiToken || apiToken === 'your_api_token_here') {
    console.log('[Scrape-Expectations] Bright Data API token not set.');
    return res.json({
      success: false,
      query,
      error: 'API Token Not Configured',
      results: []
    });
  }

  const started = Date.now();

  try {
    const [rawSerpItems, amazonItems] = await Promise.all([
      scrapeShopping(query, apiToken),
      scrapeAmazonPrebuilt(query, apiToken)
    ]);
    const serpFormatted = rawSerpItems
      .map((it, i) => mapItem(it, i))
      .filter(p => p.retailer && p.price > 0 && p.productName !== 'Unknown Product');

    const finalResults = [...serpFormatted, ...amazonItems].sort((a, b) => a.price - b.price);

    const perStore = finalResults.reduce((acc, p) => {
      acc[p.retailer] = (acc[p.retailer] || 0) + 1;
      return acc;
    }, {});

    console.log(`[Scrape-Expectations] Fetched ${finalResults.length} items in ${Date.now() - started}ms. Distribution:`, perStore);

    if (finalResults.length > 0) cacheSet(cacheKey, finalResults);

    res.json({
      success: true,
      query,
      count: finalResults.length,
      perStore,
      results: finalResults,
    });

  } catch (e) {
    console.error(`[Scrape-Expectations] General processing error: ${e.message}`);
    res.json({ success: false, query, error: 'Scrape process failed', results: [] });
  }
});
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[Scrape-Expectations] Backend running on http://localhost:${PORT}`);
  });
}
module.exports = app;