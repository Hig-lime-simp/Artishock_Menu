import express from 'express';
import db from '../db.js';

const router = express.Router();

// POST /api/orders - сохранить заказ
router.post('/', (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    if (!items || !totalAmount) {
      return res.status(400).json({ error: 'Items and totalAmount are required' });
    }
    
    const result = db.prepare(
      'INSERT INTO orders (items, totalAmount) VALUES (?, ?)'
    ).run(JSON.stringify(items), totalAmount);
    
    res.json({ 
      id: result.lastInsertRowid, 
      items, 
      totalAmount,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders - получить все заказы (для админки)
router.get('/', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
    res.json(orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
