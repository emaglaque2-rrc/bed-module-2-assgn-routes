import { Request, Response, NextFunction } from "express";
import { Employee } from "../../../data/employee";
import * as employeeService from "../services/employeeService";
import { HTTP_STATUS } from "../../../constants/httpConstants";

// Defines the type for incoming request body (excluding ID)
type CreateEmployeeBody = Omit<Employee, "id">;

/**
 * Manages requests, responses, and validations to create a new employee
 * @param req - The express Request, with body of type CreateEmployeeBody
 * @param res - The express Response
 * @param next - The express middleware chaining function
 * @returns 
 */
export const createEmployee = async (
    req: Request<{}, {}, CreateEmployeeBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Basic validation - check for required fields
        const requiredFields: (keyof CreateEmployeeBody)[] = [
            "name",
            "position",
            "department",
            "email",
            "phone",
            "branchId"
        ];

        // Check for missing fields
        const missingFields: string[] = requiredFields.filter((field) => {
            return req.body[field] === undefined || 
            req.body[field] === null ||
            req.body[field] === "" ||
            (typeof req.body[field] === "string" && req.body[field].trim() === "");
        });

        // If any required fields are missing, respond with 400.
        if (missingFields.length > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
            return;
        }

        // Extract only the fields we want (destructuring)
        const { name, position, department, email, phone, branchId }: CreateEmployeeBody = req.body;

        // Call the service layer
        const newEmployee: Employee = await employeeService.createEmployee({
            name, 
            position, 
            department, 
            email, 
            phone, 
            branchId: Number(branchId)
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: "Employee created successfully",
            data: newEmployee
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve all employees.
 * @param _req - The express Request (unintentionally not used, "_*"
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllEmployees = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const employees: Employee[] = await employeeService.getAllEmployees();

        res.status(HTTP_STATUS.OK).json({
            message: "Employees retrieved successfully",
            data: employees,
        });
    } catch (error: unknown) {
        next(error);
    }
}