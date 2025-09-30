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

    describe("GET /api/v1/employees", () => {
        it("should call getAllEmployees controller", async () => {
            await request(app).get("/api/v1/employees");
            expect(employeeController.getAllEmployees).toHaveBeenCalled();
        });
    });


});