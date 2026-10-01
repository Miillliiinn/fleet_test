export async function fetchProducts( setProducts, setLoadingProducts, setErrors )
{
    setLoadingProducts(true);
    try
    {
        const res = await fetch(`/api/products`)
        const json = await res.json();
        if (!res.ok)
        {
            throw new Error(json.message || "Could not load products");
        }
    }
    catch (error)
    {
        setErrors((prev) => [...prev, `Products fetch failed: ${error.message}`]);
    }
    finally
    {
        setLoadingProducts(false);
    }
}