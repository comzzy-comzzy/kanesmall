const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample product data with real Unsplash images
const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    description: "A comfortable and versatile cotton t-shirt for everyday wear. Made from 100% premium cotton for maximum comfort.",
    price: 19.99,
    imageUrl: "/images/tshirt.jpg"
  },
  {
    id: 2,
    name: "Premium Denim Jeans",
    description: "Stylish and durable denim jeans with a perfect fit. Classic blue wash with modern styling.",
    price: 49.99,
    imageUrl: "/images/jeans.jpg"
  },
  {
    id: 3,
    name: "Running Shoes",
    description: "Lightweight running shoes with excellent cushioning. Perfect for both casual wear and athletic activities.",
    price: 89.99,
    imageUrl: "/images/shoes.jpg"
  },
  {
    id: 4,
    name: "Winter Jacket",
    description: "Warm and waterproof jacket for cold weather. Features insulation and water-resistant coating.",
    price: 129.99,
    imageUrl: "/images/jacket.jpg"
  }
];

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Serve the main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/product.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/product.html'));
});

app.get('/bag.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/bag.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
