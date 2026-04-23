import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import categoriesRouter from './routes/categories.js';
import dishesRouter from './routes/dishes.js';
import ordersRouter from './routes/orders.js';
import authRouter, { authMiddleware } from './routes/auth.js';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware для парсинга JSON
app.use(express.json());

// Статика для загруженных изображений
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API маршруты
app.use('/api/categories', categoriesRouter);
app.use('/api/dishes', dishesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

// Защищённый маршрут для получения заказов (админка)
app.get('/api/admin/orders', authMiddleware, (req, res) => {
  db.all('SELECT * FROM orders ORDER BY createdAt DESC', [], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    })));
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
