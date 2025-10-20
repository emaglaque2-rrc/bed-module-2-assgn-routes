import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as employeeController from "../src/api/v1/controllers/employeeController";
import * as employeeService from "../src/api/v1/services/employeeService";
import { Employee } from "../src/data/employee";

jest.mock("../src/api/v1/services/employeeService");

describe("Employee Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let mockEmployee: Employee;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();

        mockEmployee = {
            id: 1,
            name: "Alice Johnson",
            position: "Branch Manager",
            department: "Management",
            email: "alice.johnson@pixell-river.com",
            phone: "604-555-0148",
            branchId: 1,
        }
    });

    // Test for getAllEmployees
    describe("getAllEmployees", () => {
        it("should return all employees with status 200", async () => {
            // Arrange
            (employeeService.getAllEmployees as jest.Mock).mockResolvedValue([mockEmployee]);

            // Act
            await employeeController.getAllEmployees(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employees retrieved successfully",
                data: [
                    {
                        id: 1,
                        name: "Alice Johnson",
                        position: "Branch Manager",
                        department: "Management",
                        email: "alice.johnson@pixell-river.com",
                        phone: "604-555-0148",
                        branchId: 1,
                    }
                ],
            });
        });

        it("should return 200 and empty list if no employees found", async () => {
            // Arrange
            (employeeService.getAllEmployees as jest.Mock).mockResolvedValue([]);

            // Act
            await employeeController.getAllEmployees(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employees retrieved successfully",
                data: [],
            });
        });
    });

    // Test for createEmployee
    describe("createEmployee", () => {
        it("should return 201 and success message", async () => {
            // Arrange
            mockReq.body = mockEmployee;
            (employeeService.createEmployee as jest.Mock).mockResolvedValue(mockEmployee);

            // Act
            await employeeController.createEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee created successfully",
                data: {
                        id: 1,
                        name: "Alice Johnson",
                        position: "Branch Manager",
                        department: "Management",
                        email: "alice.johnson@pixell-river.com",
                        phone: "604-555-0148",
                        branchId: 1,
                    },
            });
        });

        it("should return 400 if required fields are missing", async () => {
            // Arrange
            mockReq.body = {};

            // Act
            await employeeController.createEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Missing required fields: name, position, department, email, phone, branchId", 
            });
        });

    });

    // Test for getEmployeeById
    describe("getEmployeeById", () => {
        it("should return 200 and employee data", async () => {
            // Arrange 
            mockReq.params = { id: "1" };
            (employeeService.getEmployeeById as jest.Mock).mockResolvedValue(mockEmployee);

            // Act
            await employeeController.getEmployeeById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `Employee ${mockEmployee.id} found successfully`,
                data: {
                        id: 1,
                        name: "Alice Johnson",
                        position: "Branch Manager",
                        department: "Management",
                        email: "alice.johnson@pixell-river.com",
                        phone: "604-555-0148",
                        branchId: 1,
                    },
            });
        });

        it("should return 404 if employee not found", async () => {
            // Arrange
            mockReq.params = { id: "999" };
            (employeeService.getEmployeeById as jest.Mock).mockResolvedValue(undefined);

            // Act
            await employeeController.getEmployeeById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `Employee with ID ${mockReq.params.id} not found`,
            });
        });
    });

    // Test for updateEmployee
    describe("updateEmployee", () => {
        it("should return 200 and updated employee data", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            mockReq.body = { position: "Back-end Instructor" };
            const updatedEmployee: Employee = { ...mockEmployee, ...mockReq.body };
            (employeeService.updateEmployee as jest.Mock).mockResolvedValue(updatedEmployee);

            // Act
            await employeeController.updateEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee updated successfully.",
                data: {
                    id: 1,
                    name: "Alice Johnson",
                    position: "Back-end Instructor",
                    department: "Management",
                    email: "alice.johnson@pixell-river.com",
                    phone: "604-555-0148",
                    branchId: 1,
                },
            });
        });

        it("should return 400 if update body is missing", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            mockReq.body = {};

            // Act
            await employeeController.updateEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "At least one valid field must be provided to update.",
            });
        });
    });

    // Test for deleteEmployee
    describe("deleteEmployee", () => {
        it("should return 200 and success message", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            (employeeService.deleteEmployee as jest.Mock).mockResolvedValue(true);

            // Act
            await employeeController.deleteEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `Employee with ID ${mockReq.params.id} deleted successfully.`
            });
        });

        it("should return 404 and error if employee isn't found", async () => {
            // Arrange
            mockReq.params = { id: "444" };
            (employeeService.deleteEmployee as jest.Mock).mockResolvedValue(false);

            // Act
            await employeeController.deleteEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `Employee with ID 444 not found.`
            });
        });
    });
});