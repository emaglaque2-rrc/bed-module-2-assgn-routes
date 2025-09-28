import express, { Router } from "express";

import { employees, Employee } from "../../../data/employee";

const router: Router = express.Router();

router.get("/", (_req, res) => {
  res.json(employees);
});

router.post("/", (_req, res) => {
  res.send("Create a new employee");
});

router.put("/:id", (_req, res) => {
  res.send("Update an employee");
});

router.delete("/:id", (_req, res) => {
  res.send("Delete an employee");
});

export default router;