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
  try {
    const { categoryId } = req.query;
    let dishes;
    if (categoryId) {
      dishes = db.prepare('SELECT * FROM dishes WHERE categoryId = ?').all(categoryId);
    } else {
      dishes = db.prepare('SELECT * FROM dishes').all();
    }
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dishes/:id - получение одного блюда
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const dish = db.prepare('SELECT * FROM dishes WHERE id = ?').get(id);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/dishes - создать блюдо
router.post('/', upload.single('image'), (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Name, price and categoryId are required' });
    }
    
    const result = db.prepare(
      'INSERT INTO dishes (name, price, description, image, categoryId) VALUES (?, ?, ?, ?, ?)'
    ).run(name, parseFloat(price), description || '', image, parseInt(categoryId));
    
    res.json({ 
      id: result.lastInsertRowid, 
      name, 
      price: parseFloat(price), 
      description: description || '', 
      image, 
      categoryId: parseInt(categoryId) 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/dishes/:id - обновить блюдо
router.put('/:id', upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, categoryId } = req.body;
    
    const existingDish = db.prepare('SELECT * FROM dishes WHERE id = ?').get(id);
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
    
    const result = db.prepare(
      'UPDATE dishes SET name = ?, price = ?, description = ?, image = ?, categoryId = ? WHERE id = ?'
    ).run(updatedName, updatedPrice, updatedDescription, image, updatedCategoryId, id);
    
    res.json({ 
      id: parseInt(id), 
      name: updatedName, 
      price: updatedPrice, 
      description: updatedDescription, 
      image, 
      categoryId: updatedCategoryId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/dishes/:id - удалить блюдо
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM dishes WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json({ message: 'Dish deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
