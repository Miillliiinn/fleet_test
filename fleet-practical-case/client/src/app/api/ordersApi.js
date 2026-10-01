export async function fetchOrders({setOrders, setLoadingOrders, setErrors})
{
    setLoadingOrders(true);

    try
    {
        const res = await fetch("/api/orders");
        const json = await res.json();
        if (!res.ok)
        {
            throw new Error(json.message || "Could not load orders");
        }
        setOrders(json || [] );
    }
    catch (error)
    {
        setErrors((prev) => [...prev, `Cart fetch failed: ${error.message}`]);
    }
    finally
    {
        setLoadingOrders(false);
    }
}