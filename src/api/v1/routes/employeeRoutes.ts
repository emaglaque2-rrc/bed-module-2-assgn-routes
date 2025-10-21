import express, { Router } from "express";
import * as employeeController from "../controllers/employeeController";
import { validateRequest } from "../middleware/validate";
import { employeeSchemas } from "../validation/employeeSchema";

const router: Router = express.Router();

// Base path will be prefixed with "/api/v1/employees" from app.ts
router.get("/", employeeController.getAllEmployees);

router.post(
    "/", 
    validateRequest(employeeSchemas.create),
    employeeController.createEmployee
);

router.get(
    "/:id",
    validateRequest(employeeSchemas.getById),
    employeeController.getEmployeeById
);

router.put(
    "/:id",
    validateRequest(employeeSchemas.update),
    employeeController.updateEmployee
);

router.delete(
    "/:id",
    validateRequest(employeeSchemas.delete),
    employeeController.deleteEmployee
);

router.get(
    "/branch/:branchId",
    validateRequest(employeeSchemas.getEmployeesByBranchId),
    employeeController.getEmployeesByBranchId
);

router.get(
    "/department/:department",
    validateRequest(employeeSchemas.getEmployeesByDepartment),
    employeeController.getEmployeesByDepartment
);

export default router;