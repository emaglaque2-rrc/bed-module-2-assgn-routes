import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { employeeSchemas } from "../src/api/v1/validation/employeeSchema";
import { MiddlewareFunction } from "../src/api/v1/types/express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Employee Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should pass validation for valid employee data", () => {
        // Arrange
        mockReq.body = {
            name: "Derek RRC",
            position: "Instructor",
            department: "ACE",
            email: "derek.rrc@example.com",
            phone: "204-123-4567",
            branchId: "1",
        };
        const middleware: MiddlewareFunction = validateRequest(
            employeeSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation when name is empty string", () => {
        // Arrange
        mockReq.body = {
            name: "",
            position: "Instructor",
            department: "ACE",
            email: "derek.rrc@example.com",
            phone: "204-123-4567",
            branchId: "1",
        };
        const middleware: MiddlewareFunction = validateRequest(
            employeeSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Employee name cannot be empty",
        });
    });
});