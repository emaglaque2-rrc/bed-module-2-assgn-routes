import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as branchController from "../src/api/v1/controllers/branchController";
import * as branchService from "../src/api/v1/services/branchService";
import { Branch } from "../src/data/branches";

jest.mock("../src/api/v1/services/branchService");

describe("Branch Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let mockBranch: Branch;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();

        mockBranch = {
            id: 1,
            name: "RRC Notre Dame Campus",
            address: "2055 Notre Dame Ave, Winnipeg, MB R3H 0J9",
            phone: "991"
        }
    });

    // Test for getAllBranches
    describe("getAllBranches", () => {
        it("should return all branches with status 200", async () => {
            // Arrange
            (branchService.getAllBranches as jest.Mock).mockResolvedValue([mockBranch]);

            // Act
            await branchController.getAllBranches(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branches retrieved successfully",
                data: [mockBranch],
            });
        });

        it("should return 200 and empty list if no branches found", async () => {
            // Arrange
            (branchService.getAllBranches as jest.Mock).mockResolvedValue([]);

            // Act
            await branchController.getAllBranches(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branches retrieved successfully",
                data: [],
            });
        });
    });
})