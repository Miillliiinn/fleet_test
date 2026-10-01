// Faux : le nom ne correspond pas à celui de App.js
export async function fetchProducts({ setProducts, setLoadingProducts, setErrors })
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
        setProducts(json);
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