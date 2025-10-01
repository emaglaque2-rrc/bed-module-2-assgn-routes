import express, { Router } from "express";
import * as branchController from "../controllers/branchController";

const router: Router = express.Router();

// Base path will be prefixed with "/api/v1/branches" from app.ts
router.post("/", branchController.createBranch);

router.get("/", branchController.getAllBranches);

router.get("/:id", branchController.getBranchById);

router.put("/:id", branchController.updateBranch);

export default router;