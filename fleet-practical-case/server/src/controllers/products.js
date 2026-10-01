import { db } from "../config/database.js";

export function getAllProducts(req, res) // get /api/products
{
    db.all("SELECT id, name, category, price FROM products ORDER BY id", [], (err, rows) => {
        if (err) {
        return res
            .status(500)
            .json({ message: "Failed to fetch products", detail: err.message });
        }
        res.json(rows);
    })
}