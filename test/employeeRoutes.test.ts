import request from "supertest";
import app from "../src/app";
import * as employeeController from "../src/api/v1/controllers/employeeController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { Employee } from "../src/data/employee";

jest.mock("../src/api/v1/controllers/employeeController", () => ({
    createEmployee: jest.fn((_req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getAllEmployees: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeeById: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    updateEmployee: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteEmployee: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeesByBranchId: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeesByDepartment: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Employee Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("GET /api/v1/employees/", () => {
        it("should call getAllEmployees controller", async () => {
            await request(app).get("/api/v1/employees");
            expect(employeeController.getAllEmployees).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/employees/", () => {
        it("should call createEmployee controller with valid data", async () => {
            // Arrange
            const mockEmployee: Employee = {
                id: 1,
                name: "Derek Sabourin",
                position: "Instructor",
                department: "ACE Department",
                email: "derek.sabourin@rrc.com",
                phone: "204-991-991",
                branchId: 4
            };

            // Act
            await request(app).post("/api/v1/employees/").send(mockEmployee);

            // Assert
            expect(employeeController.createEmployee).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/employees/:id", () => {
        it("should call getEmployeeById controller", async () => {
            // Arrange
            const employeeId: number = 1;

            // Act
            await request(app).get(`/api/v1/employees/${employeeId}`);

            // Assert
            expect(employeeController.getEmployeeById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/employees/:id", () => {
        it("should call updateEmployee controller with valid data", async () => {
            // Arrange
            const employeeId: number = 1;
            const updates: Partial<Employee> = {
                phone: "204-991-0044"
            };

            // Act
            await request(app).put(`/api/v1/employees/${employeeId}`).send(updates);

            // Assert
            expect(employeeController.updateEmployee).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/employees/:id", () => {
        it("should call deleteEmployee controller with valid data", async () => {
            // Arrange 
            const employeeId: number = 1; 

            // Act
            await request(app).delete(`/api/v1/employees/${employeeId}`);


            // Assert
            expect(employeeController.deleteEmployee).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/employees/branch/:branchId", () => {
        it("should call getEmployeesByBranchId controller with valid branchId", async () => {
            // Arrange
            const branchId: number = 4;

            // Act
            await request(app).get(`/api/v1/employees/branch/${branchId}`);

            // Assert
            expect(employeeController.getEmployeesByBranchId).toHaveBeenCalled();
        });

        it("should handle missing branchId parameter", async () => {
            // Act
            const branchId: string = "";

            // Act
            await request(app).get(`/api/v1/employees/branch/${branchId}`);

            // Assert
            // no call should be made to the controller thats why I 
            // included ".not" because there's missing branch ID parameter.
            expect(employeeController.getEmployeesByBranchId).not.toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/employees/department/:department", () => {
        it("should call getEmployeesByDepartment controller with valid department", async () => {
            // Arrange
            const department = "ACE Department";

            // Act
            await request(app).get(`/api/v1/employees/department/${department}`);

            // Assert
            expect(employeeController.getEmployeesByDepartment).toHaveBeenCalled();
        });

        it("should handle missing department parameter", async () => {
            // Arrange
            const department = "";

            // Act
            await request(app).get(`/api/v1/employees/department/${department}`);

            // Assert
            // no call should be made to the controller thats why I 
            // included ".not" because there's missing department parameter.
            expect(employeeController.getEmployeesByDepartment).not.toHaveBeenCalled();
        });
    });
});