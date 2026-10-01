export function OrdersTab({orders, loadingOrders})
{
  return (
    <section className="panel">
      <h2>Orders {loadingOrders ? "(loading...)" : ""}</h2>
      {orders.length === 0 ? <p>No orders yet</p> : null}

      {orders.map((order) => (
        <div key={order.id}>
          <h3>Order #{order.id} - {order.created_at}</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.price} €</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <strong>Total: {order.total} €</strong>
        </div>
      ))}
    </section>
  );
}