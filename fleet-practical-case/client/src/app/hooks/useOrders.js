export async function createOrder(event, {setStatusMessage, setErrors, loadCart, loadOrders})
{
    event.preventDefault();

    try
    {
        const res = await fetch(`/api/orders`, {
            method: "POST",
        });
        const json = await res.json();
        if (!res.ok)
        {
            throw new Error(json.message || "Could not load order");
        }
        setStatusMessage("Order created");
        await loadCart();
        await loadOrders()
    }
    catch (error)
    {
        setErrors((prev) => [...prev, `Order failed: ${error.message}`]);
    }
}