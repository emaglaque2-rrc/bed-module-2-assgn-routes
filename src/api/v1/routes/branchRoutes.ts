import express, { Router } from "express";
import * as branchController from "../controllers/branchController";
import { validateRequest } from "../middleware/validate";
import { branchSchemas } from "../validation/branchSchema";

const router: Router = express.Router();

// Base path will be prefixed with "/api/v1/branches" from app.ts
router.get("/", branchController.getAllBranches);

router.post(
    "/",
    validateRequest(branchSchemas.create),
    branchController.createBranch
);

router.get(
    "/:id",
    validateRequest(branchSchemas.getBranchById),
    branchController.getBranchById
);

router.put(
    "/:id",
    validateRequest(branchSchemas.update),
    branchController.updateBranch
);

router.delete("/:id", branchController.deleteBranch);

export default router;