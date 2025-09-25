import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", (_req, res) => {
  res.send("Get all items");
});

router.post("/", (_req, res) => {
  res.send("Create a new item");
});

router.put("/:id", (_req, res) => {
  res.send("Update an item");
});

router.delete("/:id", (_req, res) => {
  res.send("Delete an item");
});

export default router;