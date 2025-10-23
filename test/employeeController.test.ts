import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as employeeController from "../src/api/v1/controllers/employeeController";
import * as employeeService from "../src/api/v1/services/employeeService";
import { Employee } from "../src/api/v1/models/employeeModel";

jest.mock("../src/api/v1/services/employeeService");

describe("Employee Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    // Test for getAllEmployees
    describe("getAllEmployees", () => {
        it("should return all employees with status 200", async () => {
            // Arrange
            const mockEmployees: Employee[] = [
                {
                    id: "1",
                    name: "Derek Sabourin",
                    position: "Developer",
                    department: "ACE",
                    email: "derek.sabourin@example.com",
                    phone: "204-123-4567",
                    branchId: "1"
                },
            ];
            (employeeService.getAllEmployees as jest.Mock).mockResolvedValue(mockEmployees);

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
                status: "success",
                data: mockEmployees,
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
                status: "success",
            });
        });
    });

    // Test for createEmployee
    describe("createEmployee", () => {
        it("should return 201 and success message", async () => {
            // Arrange
            const mockBody = {
                name: "Derek Sabourin",
                position: "Developer",
                department: "ACE",
                email: "derek.sabourin@example.com",
                phone: "204-123-4567",
                branchId: "1"
            };

            const mockEmployee: Employee = {
                id: "1",
                ...mockBody,
            };

            mockReq.body = mockBody;
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
                        id: "1",
                        name: "Derek Sabourin",
                        position: "Developer",
                        department: "ACE",
                        email: "derek.sabourin@example.com",
                        phone: "204-123-4567",
                        branchId: "1"
                    },
                status: "success",
            });
        });
    });

    // Test for getEmployeeById
    describe("getEmployeeById", () => {
        it("should return 200 and employee data", async () => {
            // Arrange 
            const mockEmployee: Employee = {
                id: "1",
                name: "Derek Sabourin",
                position: "Developer",
                department: "ACE",
                email: "derek.sabourin@example.com",
                phone: "204-123-4567",
                branchId: "1"
            };

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
                message: "Employee retrieved successfully",
                data: {
                        id: "1",
                        name: "Derek Sabourin",
                        position: "Developer",
                        department: "ACE",
                        email: "derek.sabourin@example.com",
                        phone: "204-123-4567",
                        branchId: "1"
                    },
                    status: "success",
            });
        });
    });

    // Test for updateEmployee
    describe("updateEmployee", () => {
        it("should return 200 and updated employee data", async () => {
            // Arrange
            const mockExistingEmployee: Employee = {
                id: "1",
                name: "Derek Sabourin",
                position: "Developer",
                department: "ACE",
                email: "derek.sabourin@example.com",
                phone: "204-123-4567",
                branchId: "1"
            };
            const updateData = { position: "Back-end Instructor" };

            const mockUpdatedEmployee: Employee = {
                ...mockExistingEmployee,
                ...updateData
            };
            mockReq.params = { id: mockExistingEmployee.id };
            mockReq.body = updateData;
            (employeeService.updateEmployee as jest.Mock).mockResolvedValue(mockUpdatedEmployee);

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
                    id: "1",
                    name: "Derek Sabourin",
                    position: "Back-end Instructor",
                    department: "ACE",
                    email: "derek.sabourin@example.com",
                    phone: "204-123-4567",
                    branchId: "1"
                },
                status: "success",
            });
        });
    });

    // Test for deleteEmployee
    describe("deleteEmployee", () => {
        it("should return 200 and success message", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            (employeeService.deleteEmployee as jest.Mock).mockResolvedValue(undefined);

            // Act
            await employeeController.deleteEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee with ID 1 deleted successfully.",
                data: null,
                status: "success",
            });
        });
    });
});