require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data removed

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  //const apiUrl = process.env.BRIGHT_DATA_API_URL;
  const apiToken = process.env.BRIGHT_DATA_API_TOKEN;

  // Fallback to empty data if Bright Data isn't configured yet
  if (!apiToken || apiToken === 'your_api_token_here') {
    console.log('[Scrape-Expectations] Bright Data API not configured. Returning empty results.');
    setTimeout(() => {
      res.json({
        success: false,
        query,
        error: 'API Not Configured',
        results: []
      });
    }, 1200);
    return;
  }

  try {
    console.log(`[Scrape-Expectations] Starting to scrape data for: "${query}" from Bright Data...`);

    // Example POST request to a Bright Data synchronous Web Scraper API endpoint
    // You may need to adjust the payload depending on the exact template used.
    /* const response = await axios.post(
      apiUrl,
      { search: query, country: 'us' }, // Payload depends on the specific template/API
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );*/
    const data = JSON.stringify([
      { "url": "https://www.amazon.in", "search_keyword": query, "max_pages": 1 },
    ]);

    const triggerResponse = await axios.post("https://api.brightdata.com/dca/trigger?collector=c_mt0y5d292ebqmtr8xd&queue_next=1",
      data,
      {
        headers: {
          "Authorization": "Bearer " + apiToken,
          "Content-Type": "application/json",
        },
      }
    );

    const collection_id = triggerResponse.data.collection_id;
    console.log("[Scrape-Expectations] Collection ID: " + collection_id);

    let rawData = null;
    let isFinished = false;

    // Polling loop
    while (!isFinished) {
      console.log(`[Scrape-Expectations] Checking job status for ${collection_id}...`);
      const datasetResponse = await axios.get("https://api.brightdata.com/dca/dataset?id=" + collection_id,
        {
          headers: {
            "Authorization": "Bearer " + apiToken,
          },
        }
      );

      const responseData = datasetResponse.data;

      // If it returns an object with status 'collecting', we keep waiting.
      // Or, we can check if responseData is an array (which means data is ready).
      if (responseData && (responseData.status === 'collecting' || responseData.status === 'building')) {
        console.log("[Scrape-Expectations] Job still collecting, waiting 5 seconds...");
        // Wait 5 seconds before trying again
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.log("[Scrape-Expectations] Scraping complete!");
        rawData = responseData;
        isFinished = true;
      }
    }

    console.log("[Scrape-Expectations] Raw Data:");
    console.log(typeof rawData === 'string' ? rawData.substring(0, 200) + '...' : rawData);

    // Bright Data often returns Newline Delimited JSON (NDJSON) as a string.
    let items = [];
    if (typeof rawData === 'string') {
      // Split by newline and parse each line
      items = rawData.trim().split('\n').map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      }).filter(Boolean); // Remove any nulls from parsing errors
    } else if (Array.isArray(rawData)) {
      items = rawData;
    } else if (rawData && rawData.results) {
      items = rawData.results;
    } else {
      items = [rawData];
    }

    const mappedResults = items.map((item, index) => ({
      id: `scraped_${index}`,
      productName: item.productName || 'Unknown Product',
      // Safely access price.value with optional chaining in case it's missing (e.g. out of stock)
      price: item.price?.value || 0,
      currency: item.price?.symbol || item.currency || '₹',
      source: 'Amazon',
      rating: item.rating || 0,
      reviews: item.reviews_count || 0,
      trustLevel: Math.floor(Math.random() * (100 - 80 + 1) + 80), // Mocked for now if not provided
      imageUrl: item.imageUrl || 'https://via.placeholder.com/150',
      productUrl: item.productUrl || item.product_page_url || '#'
    }));

    res.json({
      success: true,
      query,
      results: mappedResults
    });

  } catch (error) {
    console.error('[Scrape-Expectations] Error fetching from Bright Data:', error.message);
    // On error, return empty array
    res.json({
      success: false,
      query,
      error: 'Failed to fetch from Bright Data. The target site might be blocking requests or the API failed.',
      results: []
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Scrape-Expectations] Backend running smoothly on http://localhost:${PORT}`);
});
