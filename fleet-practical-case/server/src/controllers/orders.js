import { db } from "../config/database.js";

export function getAllOrders(req, res) // get /api/orders
{
  db.all("SELECT id, total, created_at FROM orders ORDER BY id DESC", [], (err, orders) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch orders", detail: err.message });
    }

    const itemsSql = "SELECT order_id, product_name, price, quantity FROM order_items";

    db.all(itemsSql, [], (err, items) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to fetch order items", detail: err.message });
      }

      // On ajoute à chaque commande sa liste de lignes
      orders.forEach((order) => {
        order.items = items.filter((item) => item.order_id === order.id);
      });

      res.json(orders);
    });
  });
}

export function createOrder(req, res) // post /api/orders
{
  const cartSql = `
    SELECT ci.quantity, p.name, p.price
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
  `;

  db.all(cartSql, [], (err, items) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to read cart", detail: err.message });
    }

    if (items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    db.run("INSERT INTO orders (total) VALUES (?)", [total], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to create order", detail: err.message });
      }
      const orderId = this.lastID;
      let done = 0;
      let failed = false;
      items.forEach((item) => {
        const sql = `
          INSERT INTO order_items (order_id, product_name, price, quantity)
          VALUES (?, ?, ?, ?)
        `;
        db.run(sql, [orderId, item.name, item.price, item.quantity], (err) => {
          if (failed) return;

          if (err) {
            failed = true;
            return res
              .status(500)
              .json({ message: "Failed to save order items", detail: err.message });
          }

          done++;

          if (done === items.length) {
            db.run("DELETE FROM cart_items", [], (err) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Failed to clear cart", detail: err.message });
              }
              res.status(201).json({ id: orderId, total });
            });
          }
        });
      });
    });
  });
}