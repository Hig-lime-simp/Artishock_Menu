import express from 'express';
import db from '../db.js';

const router = express.Router();

// POST /api/orders - сохранить заказ
router.post('/', (req, res) => {
  const { items, totalAmount } = req.body;
  
  if (!items || !totalAmount) {
    return res.status(400).json({ error: 'Items and totalAmount are required' });
  }
  
  db.run(
    'INSERT INTO orders (items, totalAmount) VALUES (?, ?)',
    [JSON.stringify(items), totalAmount],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        id: this.lastID, 
        items, 
        totalAmount,
        createdAt: new Date().toISOString()
      });
    }
  );
});

// GET /api/orders - получить все заказы (для админки)
router.get('/', (req, res) => {
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

export default router;
