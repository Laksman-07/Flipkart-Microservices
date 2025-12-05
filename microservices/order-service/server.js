import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3003;
const ORDERS_FILE = join(__dirname, 'orders.json');

app.use(cors());
app.use(express.json());

const loadOrders = () => {
  try {
    return JSON.parse(readFileSync(ORDERS_FILE, 'utf-8'));
  } catch {
    return {};
  }
};

const saveOrders = (orders) => {
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
};

app.get('/health', (req, res) => {
  res.json({ status: 'Order Service is running', port: PORT });
});

app.get('/orders/:userId', (req, res) => {
  const orders = loadOrders();
  const userOrders = orders[req.params.userId] || [];
  res.json(userOrders);
});

app.post('/orders/:userId', (req, res) => {
  const { items, total, deliveryAddress, paymentMethod } = req.body;
  const { userId } = req.params;

  if (!items || !deliveryAddress || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const order = {
    id: Date.now().toString(),
    items,
    total,
    date: new Date().toISOString(),
    status: 'pending',
    deliveryAddress,
    paymentMethod,
  };

  const orders = loadOrders();
  if (!orders[userId]) {
    orders[userId] = [];
  }

  orders[userId].unshift(order);
  saveOrders(orders);

  res.status(201).json(order);
});

app.get('/orders/:userId/:orderId', (req, res) => {
  const { userId, orderId } = req.params;
  const orders = loadOrders();
  const userOrders = orders[userId] || [];
  const order = userOrders.find((o) => o.id === orderId);

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.patch('/orders/:userId/:orderId/status', (req, res) => {
  const { status } = req.body;
  const { userId, orderId } = req.params;

  if (!['pending', 'confirmed', 'shipped', 'delivered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const orders = loadOrders();
  const userOrders = orders[userId] || [];
  const order = userOrders.find((o) => o.id === orderId);

  if (order) {
    order.status = status;
    saveOrders(orders);
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});
