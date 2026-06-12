import dotenv from 'dotenv';
// Load environment variables from the project root .env file (relative to server folder)
dotenv.config({ path: '../.env' });
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import categoriesRouter from './routes/categories.js';
import dishesRouter from './routes/dishes.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables already loaded above
const app = express();
// Changed port to avoid conflict with other processes
// Changed port to avoid conflict with any previously running instance
const PORT = 3001;

// Middleware для парсинга JSON
app.use(express.json());

// Статика для загруженных изображений
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API маршруты
app.use('/api/categories', categoriesRouter);
app.use('/api/dishes', dishesRouter);
app.use('/api/auth', authRouter);


app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
