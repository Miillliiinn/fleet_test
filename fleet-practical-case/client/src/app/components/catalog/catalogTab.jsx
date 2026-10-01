export function CatalogTab({products, loadingProducts, cart, loadingCart, callAddToCart, callUpdateCartQuantity, callRemoveFromCart, callCreateOrder})
{
  return (
    <section className="panel catalog-layout">
      <div>
        <h2>Catalog {loadingProducts ? "(loading...)" : ""}</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price} €</td>
                <td>
                  <form onSubmit={(event) => callAddToCart(event, product.id)}>
                    <button type="submit">Add to cart</button>
                  </form>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td colSpan="4">No products found</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <aside>
        <h2>Cart {loadingCart && cart.items.length === 0 ? "(loading...)" : ""}</h2>
        {cart.items.length === 0 ? <p>Your cart is empty</p> : null}

        {cart.items.map((item) => (
          <div key={item.id}>
            <strong>{item.name}</strong> - {item.price} €
            <form
              className="app-form"
              onSubmit={(event) => callUpdateCartQuantity(event, item.product_id)}
            >
              <input
                key={item.quantity}
                name="quantity"
                type="number"
                min="1"
                defaultValue={item.quantity}
              />
              <button type="submit">Update</button>
            </form>
            <form onSubmit={(event) => callRemoveFromCart(event, item.product_id)}>
              <button type="submit">Remove</button>
            </form>
          </div>
        ))}

        <h3>Total: {cart.total} €</h3>
        <form onSubmit={callCreateOrder}>
          <button type="submit" disabled={cart.items.length === 0}>
            Order
          </button>
        </form>
      </aside>
    </section>
  );
}