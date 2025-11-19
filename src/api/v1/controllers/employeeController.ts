import { Request, Response, NextFunction } from "express";
import { Employee } from "../models/employeeModel";
import * as employeeService from "../services/employeeService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";

/**
 * Manages requests, responses, and validations to create a new employee
 * @param req - The express Request, with body of type EmployeeBody
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract only the fields we want (destructuring)
        const { name, position, department, email, phone, branchId } = req.body;

        // Call the service layer
        const newEmployee: Employee = await employeeService.createEmployee({
            name,
            position,
            department,
            email,
            phone,
            branchId
        });

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newEmployee, "Employee created successfully")
        );
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

        res.status(HTTP_STATUS.OK).json(
            successResponse(employees, "Employees retrieved successfully")
        );
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

        const employee: Employee = await employeeService.getEmployeeById(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(employee, "Employee retrieved successfully")
        );
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
        const { id } = req.params;
        // Extract update fields
        const { name, position, department, email, phone, branchId } = req.body;

        // Create the update employee object with the fields to be updated
        const updatedEmployee: Employee = await employeeService.updateEmployee(id, {
            name,
            position,
            department,
            email,
            phone,
            branchId
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedEmployee, "Employee updated successfully.")
        );
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
        const { id } = req.params;
        await employeeService.deleteEmployee(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(null, `Employee with ID ${id} deleted successfully.`)
        );

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

        const employeesByBranch: Employee[] = await employeeService.getEmployeesByBranchId(branchId);

        res.status(HTTP_STATUS.OK).json(
            successResponse(employeesByBranch, `Employees for branch ID ${branchId} retrieved successfully.`)
        );
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

        const employeesByDepartment: Employee[] = await employeeService.getEmployeesByDepartment(department);

        res.status(HTTP_STATUS.OK).json(
            successResponse(employeesByDepartment, `Employees in department ${department} retrieved successfully.`)
        );
        
    } catch (error: unknown) {
        next(error);
    }
};