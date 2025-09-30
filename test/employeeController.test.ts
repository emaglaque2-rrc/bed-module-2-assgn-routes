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
                data: [mockEmployee],
            });
        });


    });
});