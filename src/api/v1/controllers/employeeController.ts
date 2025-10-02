import { Request, Response, NextFunction } from "express";
import { Employee } from "../../../data/employee";
import * as employeeService from "../services/employeeService";
import { HTTP_STATUS } from "../../../constants/httpConstants";

// Defines the type for incoming request body (excluding ID)
type EmployeeBody = Omit<Employee, "id">;

/**
 * Manages requests, responses, and validations to create a new employee
 * @param req - The express Request, with body of type EmployeeBody
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const createEmployee = async (
    req: Request<object, object, EmployeeBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Basic validation - check for required fields
        const requiredFields: (keyof EmployeeBody)[] = [
            "name",
            "position",
            "department",
            "email",
            "phone",
            "branchId"
        ];

        // Check for missing fields
        const missingFields: string[] = requiredFields.filter((field) => {
            const value: unknown = req.body[field];
            return (value === undefined || 
                value === null ||
                value === "" ||
                (typeof value === "string" && value.trim() === "")
            );
        });

        // If any required fields are missing, respond with 400.
        if (missingFields.length > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
            return;
        }

        // Extract only the fields we want (destructuring)
        const { name, position, department, email, phone, branchId }: EmployeeBody = req.body;

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
};

/**
 * Retrieves an employee by their ID.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getEmployeeById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const employee: Employee | undefined = await employeeService.getEmployeeById(Number(id));

        if (employee) {
            res.status(HTTP_STATUS.OK).json({
                message: `Employee ${id} found successfully`,
                data: employee,
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Employee with ID ${id} not found`,
            });
        }
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update an existing employee by ID.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const updateEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Just converting id to number for use in service layer
        const id: number = Number(req.params.id);

        if (isNaN(id)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid employee ID. ID must be a number."});
                return;
        }

        // An array of required fields for validation
        // CITATION FOR keyof usage: https://www.w3schools.com/typescript/typescript_keyof.php
        const requiredFields: (keyof Omit<Employee, "id">)[] = [
            "name",
            "position",
            "department",
            "email",
            "phone",
            "branchId"
        ];

        // Validations
        const updates: Partial<Omit<Employee, "id">> = {};
        for (const key of requiredFields) { 
            const value: unknown = req.body[key];
            
            // Handle string fields
            if (key !== "branchId" && typeof value === "string" && value.trim() !== "") {
                const typedKey: keyof Omit<Employee, "id" | "branchId"> = key as keyof Omit<Employee, "id" | "branchId">;
                updates[typedKey] = value;
            }
            
            // Handle branchId (number field)
            if (key === "branchId" && (typeof value === "number" || typeof value === "string")) {
                const numValue: number = Number(value);
                if (!isNaN(numValue)) {
                    updates[key] = numValue;
                }
            }
        }

        if (Object.keys(updates).length === 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "At least one valid field must be provided to update."
            });
            return;
        }

        // All fields valid, call service.
        const updatedEmployee: Employee = await employeeService.updateEmployee(id, updates);

        res.status(HTTP_STATUS.OK).json({
            message: "Employee updated successfully.",
            data: updatedEmployee,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to delete an employee by ID.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const idParam: string | undefined = req.params.id;
        const id: number = Number(idParam);;

        // Checks if ID is provided at all
        if (!idParam) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing employee ID in request parameters."
            });
            return;
        }

        if (isNaN(id)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid employee ID. ID must be a number."
            });
            return;
        }

        const deleted: boolean = await employeeService.deleteEmployee(id);

        if (!deleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Employee with ID ${id} not found.`
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: `Employee with ID ${id} deleted successfully.`
        });

        } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve employees by branch ID.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getEmployeesByBranchId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { branchId } = req.params;
        const id: number = Number(branchId);

        if (isNaN(id)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid branch ID. ID must be a number."
            });
            return;
        }

        const employeesByBranch: Employee[] = await employeeService.getEmployeesByBranchId(id);

        if (employeesByBranch.length > 0) {
            res.status(HTTP_STATUS.OK).json({
                message: `Employees for branch ID ${id} retrieved successfully.`,
                data: employeesByBranch,
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `No employees found for branch ID ${id}.`
            });
        }

    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve employees by department.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getEmployeesByDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { department } = req.params;

        // Basic validation
        if (!department || department.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Department is required and cannot be empty."
            });
            return;
        }

        const employeesByDepartment: Employee[] = await employeeService.getEmployeesByDepartment(department);

        if (employeesByDepartment.length > 0) {
            res.status(HTTP_STATUS.OK).json({
                message: `Employees in department ${department} retrieved successfully.`,
                data: employeesByDepartment,
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `No employees found for department: ${department}.`
            });
        }
        
    } catch (error: unknown) {
        next(error);
    }
};