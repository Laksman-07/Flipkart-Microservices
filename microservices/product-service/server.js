import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let db = JSON.parse(readFileSync(join(__dirname, 'data.json'), 'utf-8'));

app.get('/health', (req, res) => {
  res.json({ status: 'Product Service is running', port: PORT });
});

app.get('/products', (req, res) => {
  res.json(db.products);
});

app.get('/products/:id', (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get('/categories', (req, res) => {
  res.json(db.categories);
});

app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json(db.products);
  }

  const query = q.toString().toLowerCase();
  const results = db.products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );

  res.json(results);
});

app.post('/filter', (req, res) => {
  const { category, minPrice, maxPrice, minRating, searchQuery } = req.body;

  let filtered = [...db.products];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  if (minRating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= minRating);
  }

  res.json(filtered);
});

app.get('/brands', (req, res) => {
  const brands = [...new Set(db.products.map((p) => p.brand))].sort();
  res.json(brands);
});

app.listen(PORT, () => {
  console.log(`Product Service running on http://localhost:${PORT}`);
});
