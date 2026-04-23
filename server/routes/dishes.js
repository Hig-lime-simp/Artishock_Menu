import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET /api/dishes - получить блюда категории
router.get('/', (req, res) => {
  const { categoryId } = req.query;
  let query;
  let params;
  if (categoryId) {
    query = 'SELECT * FROM dishes WHERE categoryId = ?';
    params = [categoryId];
  } else {
    query = 'SELECT * FROM dishes';
    params = [];
  }
  db.all(query, params, (err, dishes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(dishes);
  });
});

// GET /api/dishes/:id - получение одного блюда
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM dishes WHERE id = ?', [id], (err, dish) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json(dish);
  });
});

// POST /api/dishes - создать блюдо
router.post('/', upload.single('image'), (req, res) => {
  const { name, price, description, categoryId } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  
  if (!name || !price || !categoryId) {
    return res.status(400).json({ error: 'Name, price and categoryId are required' });
  }
  
  db.run(
    'INSERT INTO dishes (name, price, description, image, categoryId) VALUES (?, ?, ?, ?, ?)',
    [name, parseFloat(price), description || '', image, parseInt(categoryId)],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        id: this.lastID, 
        name, 
        price: parseFloat(price), 
        description: description || '', 
        image, 
        categoryId: parseInt(categoryId) 
      });
    }
  );
});

// PUT /api/dishes/:id - обновить блюдо
router.put('/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, price, description, categoryId } = req.body;
  
  // Сначала получаем существующее блюдо
  db.get('SELECT * FROM dishes WHERE id = ?', [id], (err, existingDish) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!existingDish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    
    // Если загружено новое фото, удаляем старое (опционально)
    let image = existingDish.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    
    const updatedName = name || existingDish.name;
    const updatedPrice = price ? parseFloat(price) : existingDish.price;
    const updatedDescription = description !== undefined ? description : existingDish.description;
    const updatedCategoryId = categoryId ? parseInt(categoryId) : existingDish.categoryId;
    
    db.run(
      'UPDATE dishes SET name = ?, price = ?, description = ?, image = ?, categoryId = ? WHERE id = ?',
      [updatedName, updatedPrice, updatedDescription, image, updatedCategoryId, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ 
          id: parseInt(id), 
          name: updatedName, 
          price: updatedPrice, 
          description: updatedDescription, 
          image, 
          categoryId: updatedCategoryId 
        });
      }
    );
  });
});

// DELETE /api/dishes/:id - удалить блюдо
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM dishes WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json({ message: 'Dish deleted' });
  });
});

export default router;
