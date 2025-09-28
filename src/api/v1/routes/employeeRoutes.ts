import express, { Router } from "express";
import * as employeeController from "../controllers/employeeController";

import { employees } from "../../../data/employee";

const router: Router = express.Router();

// Base path will be prefixed with "/api/v1/employees" from app.ts
router.post("/", employeeController.createEmployee);

router.get("/", (_req, res) => {
  res.json(employees);
});

router.put("/:id", (_req, res) => {
  res.send("Update an employee");
});

router.delete("/:id", (_req, res) => {
  res.send("Delete an employee");
});

export default router;