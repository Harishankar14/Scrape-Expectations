require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data representing Bright Data scraper results
const mockResults = [
  {
    id: 'amazon_1',
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    price: 348.00,
    currency: '$',
    source: 'Amazon',
    rating: 4.6,
    reviews: 14200,
    trustLevel: 95, // out of 100
    imageUrl: 'https://m.media-amazon.com/images/I/61vJtKraasL._AC_SX679_.jpg',
    productUrl: 'https://amazon.com'
  },
  {
    id: 'flipkart_1',
    productName: 'Sony WH-1000XM5 Bluetooth Headset',
    price: 355.00,
    currency: '$',
    source: 'Flipkart',
    rating: 4.4,
    reviews: 9320,
    trustLevel: 88,
    imageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/m/p/a/-original-imaghxbhzhfzhyqq.jpeg?q=70',
    productUrl: 'https://flipkart.com'
  },
  {
    id: 'bestbuy_1',
    productName: 'Sony - WH1000XM5 Wireless Noise-Canceling Headphones',
    price: 349.99,
    currency: '$',
    source: 'BestBuy',
    rating: 4.8,
    reviews: 6500,
    trustLevel: 92,
    imageUrl: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6505/6505727_sd.jpg',
    productUrl: 'https://bestbuy.com'
  }
];

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const apiUrl = process.env.BRIGHT_DATA_API_URL;
  const apiToken = process.env.BRIGHT_DATA_API_TOKEN;

  // Fallback to mock data if Bright Data isn't configured yet
  if (!apiUrl || !apiToken || apiToken === 'your_api_token_here') {
    console.log('[Scrape-Expectations] Bright Data API not configured. Using mock data.');
    setTimeout(() => {
      res.json({
        success: true,
        query,
        results: mockResults
      });
    }, 1200);
    return;
  }

  try {
    console.log(`[Scrape-Expectations] Fetching data for: "${query}" from Bright Data...`);

    // Example POST request to a Bright Data synchronous Web Scraper API endpoint
    // You may need to adjust the payload depending on the exact template used.
    const response = await axios.post(
      apiUrl,
      { search: query, country: 'us' }, // Payload depends on the specific template/API
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Depending on Bright Data's response structure, you might need to map it.
    // For now, we assume the API returns an array of products we can map over.
    // If it returns something else, adjust this mapping logic!
    const rawData = response.data;
    const items = Array.isArray(rawData) ? rawData : (rawData.results || []);

    const mappedResults = items.map((item, index) => ({
      id: item.id || `scraped_${index}`,
      productName: item.title || item.name || 'Unknown Product',
      price: item.price || 0,
      currency: item.currency || '$',
      source: item.source || item.domain || 'BrightData',
      rating: item.rating || 0,
      reviews: item.reviews || 0,
      trustLevel: Math.floor(Math.random() * (100 - 80 + 1) + 80), // Mocked for now if not provided
      imageUrl: item.image || item.thumbnail || 'https://via.placeholder.com/150',
      productUrl: item.url || item.link || '#'
    }));

    res.json({
      success: true,
      query,
      results: mappedResults.length > 0 ? mappedResults : mockResults // Fallback if no results
    });

  } catch (error) {
    console.error('[Scrape-Expectations] Error fetching from Bright Data:', error.message);
    // On error, fallback to mock data to keep the UI working
    res.json({
      success: false,
      query,
      error: 'Failed to fetch from Bright Data. Using mock data instead.',
      results: mockResults
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Scrape-Expectations] Backend running smoothly on http://localhost:${PORT}`);
});
