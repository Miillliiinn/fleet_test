import { Router } from "express";
import { createOrder, getAllOrders } from "../controllers/orders.js";

const router = Router();

router.get("/", getAllOrders);
router.post("/", createOrder);

export default router;