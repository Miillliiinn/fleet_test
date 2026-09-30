import { Router } from "express";
import { getAllCartItems, addCartItem, updateCartItem, removeCartItem} from "../controllers/panier_items.js";

const router = Router();

router.get("/", getAllCartItems);
router.post("/", addCartItem);
router.patch("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);

export default router;