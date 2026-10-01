export async function fetchCart({setCart, setLoadingCart, setErrors})
{
    setLoadingCart(true);

    try
    {
        const res = await fetch("/api/cart");
        const json = await res.json();
        if (!res.ok)
        {
            throw new Error(json.message || "Could not load cart");
        }
        setCart({ items: json.items || [], total: json.total || 0 });
    }
    catch (error)
    {
        setErrors((prev) => [...prev, `Cart fetch failed: ${error.message}`]);
    }
    finally
    {
        setLoadingCart(false);
    }
}