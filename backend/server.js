const express = require('express');
const cors = require('cors');

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

app.get('/api/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  // Simulate network latency for animations
  setTimeout(() => {
    res.json({
      success: true,
      query,
      results: mockResults
    });
  }, 1200); 
});

app.listen(PORT, () => {
  console.log(`[Scrape-Expectations] Backend running smoothly on http://localhost:${PORT}`);
});
