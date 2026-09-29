import express from "express"
import { getAllDevices, createDevice, updateSingleDeviceById, deleteDeviceById } from "../controllers/devices.js";

const router = express.Router();
router.get("/", getAllDevices);
router.post("/", createDevice);
router.put("/:id", updateSingleDeviceById);
router.delete("/:id", deleteDeviceById);

export default router;