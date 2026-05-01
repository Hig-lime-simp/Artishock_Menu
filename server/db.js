import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');

// Создаем базу данных асинхронно
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключено к базе данных SQLite');
  }
});

// Создание таблиц
// Initialise required tables. sqlite3's `run` does not support multiple statements in a single call,
// so we execute each CREATE statement separately to ensure tables are created on server start.
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image TEXT,
    categoryId INTEGER NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT NOT NULL,
    totalAmount REAL NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // Проверка наличия категорий, если нет - создадим тестовые
  db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
    if (err) {
      console.error('Ошибка проверки категорий:', err.message);
      return;
    }
    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
      stmt.run('Завтраки', (err) => {});
      stmt.run('Блинчики и сырники', (err) => {});
      stmt.run('Салаты', (err) => {});
      stmt.run('Первые блюда', (err) => {});
      stmt.run('Вторые блюда', (err) => {});
      stmt.run('Пасты', (err) => {});
      stmt.run('Европейский перекус', (err) => {});
      stmt.run('Пиццы', (err) => {});
      stmt.run('Стрит фуд', (err) => {});
      stmt.run('Горячий кофе', (err) => {});
      stmt.run('Холодный кофе', (err) => {});
      stmt.run('Альтернатива', (err) => {});
      stmt.run('Чайная карта', (err) => {});
      stmt.run('Авторский чай', (err) => {});
      stmt.run('Лимонады', (err) => {});
      stmt.run('Смузи', (err) => {});
      stmt.finalize();
    }
  });
});

export default db;
