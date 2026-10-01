export async function addToCart(event, productId, {setErrors, loadCart})
{
    event.preventDefault();

    try
    {
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
        });
        const json = await res.json();
        if (!res.ok)
        {
            throw new Error(json.message || "Could not add to cart");
        }
        await loadCart();
    }
    catch (error)
    {
        setErrors((prev) => [...prev, `Cart save failed: ${error.message}`]);
    }
}

export async function updateCartQuantity(event, productId, {setErrors, loadCart})
{
    event.preventDefault();
    const quantity = Number(event.target.elements.quantity.value);

    try
    {
        const res = await fetch (`/api/cart/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quantity),
        });
        const json = await res.json();
        if (!res.ok)
        {
             throw new Error(json.message || "Could not save quantity");
        }
        await (loadCart());
    }
    catch (error)
    {
        setErrors((prev) => [...prev, `Cart quantity save failed: ${error.message}`]);
    }
}

export async function remoceFromCart(event, productId, {setErrors, loadCart})
{
    event.preventDefault();

    try
    {
        const res = await fetch(`/api/cart/${productId}`, {
            method: "DELETE",
        });
        const json = res.json();
        if (!res.ok)
        {
            throw new Error(json.message || "Coukld not remove from cart"); 
        }
        await loadCart();
    }
    catch (error)
    {
        setErrors((prev) => [...prev, `Cart delete failed: ${error.message}`]);
    }

}