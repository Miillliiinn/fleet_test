import express from "express";
import cors from "cors";

import { initDB } from "./config/database.js";

import deviceRouter from "./routes/devices.js";
import employeesRouter from "./routes/employees.js";
import healthRouter from "./routes/health.js";
import cartRouter from "./routes/panier_items.js";
import productRouter from "./routes/products.js";
import orderRouter from "./routes/orders.js"

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

initDB();

app.use("/api/devices", deviceRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/health", healthRouter);
app.use("/api/cart", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);