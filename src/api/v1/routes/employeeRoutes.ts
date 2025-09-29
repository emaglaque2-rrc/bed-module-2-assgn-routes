import express, { Router } from "express";
import * as employeeController from "../controllers/employeeController";

const router: Router = express.Router();

// Base path will be prefixed with "/api/v1/employees" from app.ts
router.post("/", employeeController.createEmployee);

router.get("/", employeeController.getAllEmployees);

router.get("/:id", employeeController.getEmployeeById);

router.put("/:id", employeeController.updateEmployee);

router.delete("/:id", (_req, res) => {
  res.send("Delete an employee");
});

export default router;