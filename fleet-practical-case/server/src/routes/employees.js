import express from "express"
import { getAllEmployees, getSingleEmployeesById, createNewEmployee, updateEmployeeById, deleteEmployee } from "../controllers/employees.js"

const router = express.Router();
router.get("/", getAllEmployees);
router.get("/:id", getSingleEmployeesById);
router.post("/", createNewEmployee);
router.put("/:id", updateEmployeeById);
router.delete("/:id", deleteEmployee);

export default router;
