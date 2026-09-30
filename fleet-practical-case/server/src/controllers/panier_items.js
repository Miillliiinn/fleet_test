import { db } from "../config/database.js";

export function getAllCartItems(req, res) // get /api/cart
{
  const sql = `
    SELECT
      ci.id,
      ci.product_id,
      ci.quantity,
      p.name,
      p.price
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    ORDER BY ci.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch cart items", detail: err.message });
    }

    const total = rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: rows, total });
  });
}

export function addCartItem(req, res)
{
    const { productId } = req.body;

    if (!productId)
    {
        return res.status(400).json({message: "productId failed"});
    }
    const sql = `
        INSERT INTO cart_items (product_id, quantity)
        VALUES (?, 1)
        ON CONFLICT(product_id) DO UPDATE SET quantity = quantity + 1
    `;

    db.run(sql, [productId], (err) => {
        if (err)
        {
            return res.status(500)
            .json({ message: "Failed to add item in cart", detail: err.message });
        }
        res.status(201).json({ message: "Item add" });
    });
}

export function updateCartItem(req, res) // patch /api/cart/:productId
{
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res
      .status(400)
      .json({ message: "quantity must be an integer >= 1" });
  }

  const sql = "UPDATE cart_items SET quantity = ? WHERE product_id = ?";

  db.run(sql, [quantity, productId], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to update cart item", detail: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Cart item updated" });
  });
}

export function removeCartItem(req, res) // delete /api/cart/:productId
{
  const { productId } = req.params;

  db.run("DELETE FROM cart_items WHERE product_id = ?", [productId], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to remove cart item", detail: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Cart item removed" });
  });
}