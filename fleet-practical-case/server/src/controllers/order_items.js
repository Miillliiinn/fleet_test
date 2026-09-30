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