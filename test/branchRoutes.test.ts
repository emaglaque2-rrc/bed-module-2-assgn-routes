import request from "supertest";
import app from "../src/app";
import * as branchController from "../src/api/v1/controllers/branchController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/branchController", () => ({
    createBranch: jest.fn((_req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getAllBranches: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getBranchById: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    updateBranch: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteBranch: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Branch Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("GET /api/v1/branches/", () => {
        it("should call getAllBranches controller", async () => {
            await request(app).get("/api/v1/branches");
            expect(branchController.getAllBranches).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/branches/", () => {
        it("should call createBranch controller with valid data", async () => {
            // Arrange
            const mockBranch = {
                name: "RRC Main Campus",
                address: "2055 Notre Dame Ave, Winnipeg, MB R3H 0J9",
                phone: "991"
            };

            // Act
            await request(app).post("/api/v1/branches/").send(mockBranch);

            // Assert
            expect(branchController.createBranch).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/branches/:id", () => {
        it("should call getBranchById controller", async () => {
            // Arrange
            const branchId = 1;

            // Act
            await request(app).get(`/api/v1/branches/${branchId}`);

            // Assert
            expect(branchController.getBranchById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/branches/:id", () => {
        it("should call updateBranch controller with valid data", async () => {
            // Arrange
            const branchId = 1;
            const updates = {
                name: "RRC Notre Dame Campus"
            };

            // Act
            await request(app).put(`/api/v1/branches/${branchId}`).send(updates);

            // Assert
            expect(branchController.updateBranch).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/branches/:id", () => {
        it("should call deleteBranch controller with valid data", async () => {
            // Arrange
            const branchId = 1;

            // Act
            await request(app).delete(`/api/v1/branches/${branchId}`);

            // Assert
            expect(branchController.deleteBranch).toHaveBeenCalled();
        });
    });
});