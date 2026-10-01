import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../../fleet.sqlite");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur de connexion :", err.message);
  } else {
    console.log("Connecté à la base SQLite.");
  }
});

export const initDB = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        owner_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES employees(id) ON DELETE SET NULL
      )
    `);

// --

    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL UNIQUE,
        quantity INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);

  // --
  
    // Seed : produits de test (uniquement si la table est vide)
    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
      if (err || row.count > 0) return;

      db.run(`
        INSERT INTO products (name, category, price) VALUES
          ('MacBook Pro 14"', 'Laptop', 1999),
          ('Dell XPS 13', 'Laptop', 1299),
          ('Lenovo ThinkPad X1', 'Laptop', 1599),
          ('iPhone 15', 'Mobile', 969),
          ('Samsung Galaxy S24', 'Mobile', 899),
          ('Dell UltraSharp 27"', 'Display', 449),
          ('LG UltraFine 32"', 'Display', 699),
          ('Logitech MX Keys', 'Peripheral', 119),
          ('Logitech MX Master 3S', 'Peripheral', 99),
          ('Apple Magic Trackpad', 'Peripheral', 149)
      `);
    });

  });
};