import request from "supertest";
import app from "../src/app";
import * as employeeController from "../src/api/v1/controllers/employeeController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/employeeController", () => ({
    createEmployee: jest.fn((_req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getAllEmployees: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeeById: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    updateEmployee: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteEmployee: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
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
            const mockEmployee = {
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
            const employeeId = 1;

            // Act
            await request(app).get(`/api/v1/employees/${employeeId}`);

            // Assert
            expect(employeeController.getEmployeeById).toHaveBeenCalled();
        });
    });

});