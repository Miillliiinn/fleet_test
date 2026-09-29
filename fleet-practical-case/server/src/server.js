import express from "express";
import cors from "cors";

import deviceRouter from "./routes/devices.js";
import employeesRouter from "./routes/employees.js";
import healthRouter from "./routes/health.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

app.use("/api/devices", deviceRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/health", healthRouter);