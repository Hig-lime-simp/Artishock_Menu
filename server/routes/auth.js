import express from 'express';
import jwt from 'jsonwebtoken';
// Environment variables are loaded in server/index.js
// Default credentials fallback if .env missing
// Use credentials from .env; fallback to defaults for safety
console.log('ENV vars in auth:', process.env.ADMIN_LOGIN, process.env.ADMIN_PASSWORD);
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || '123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123';

const router = express.Router();

// POST /api/auth/login - вход в админку
router.post('/login', (req, res) => {
  const { login, password } = req.body;
  console.log('Login attempt:', { login, password, ADMIN_LOGIN, ADMIN_PASSWORD });
  
  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware для проверки авторизации
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default router;
