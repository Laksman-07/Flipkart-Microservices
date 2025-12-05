import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3002;
const CARTS_FILE = join(__dirname, 'carts.json');

app.use(cors());
app.use(express.json());

const loadCarts = () => {
  try {
    return JSON.parse(readFileSync(CARTS_FILE, 'utf-8'));
  } catch {
    return {};
  }
};

const saveCarts = (carts) => {
  writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));
};

app.get('/health', (req, res) => {
  res.json({ status: 'Cart Service is running', port: PORT });
});

app.get('/cart/:userId', (req, res) => {
  const carts = loadCarts();
  const cart = carts[req.params.userId] || [];
  res.json(cart);
});

app.post('/cart/:userId/add', (req, res) => {
  const { product, quantity = 1 } = req.body;
  const { userId } = req.params;

  if (!product || !product.id) {
    return res.status(400).json({ error: 'Invalid product' });
  }

  const carts = loadCarts();
  if (!carts[userId]) {
    carts[userId] = [];
  }

  const existingItem = carts[userId].find((item) => item.product.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].push({ product, quantity });
  }

  saveCarts(carts);
  res.json(carts[userId]);
});

app.post('/cart/:userId/update', (req, res) => {
  const { productId, quantity } = req.body;
  const { userId } = req.params;

  const carts = loadCarts();
  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  if (quantity <= 0) {
    carts[userId] = carts[userId].filter((item) => item.product.id !== productId);
  } else {
    const item = carts[userId].find((item) => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  saveCarts(carts);
  res.json(carts[userId]);
});

app.post('/cart/:userId/remove', (req, res) => {
  const { productId } = req.body;
  const { userId } = req.params;

  const carts = loadCarts();
  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  carts[userId] = carts[userId].filter((item) => item.product.id !== productId);
  saveCarts(carts);
  res.json(carts[userId]);
});

app.post('/cart/:userId/clear', (req, res) => {
  const { userId } = req.params;
  const carts = loadCarts();
  delete carts[userId];
  saveCarts(carts);
  res.json({ message: 'Cart cleared' });
});

app.get('/cart/:userId/total', (req, res) => {
  const carts = loadCarts();
  const cart = carts[req.params.userId] || [];
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  res.json({ total, itemCount: cart.length });
});

app.listen(PORT, () => {
  console.log(`Cart Service running on http://localhost:${PORT}`);
});
