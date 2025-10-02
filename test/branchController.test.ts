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
                data: [
                    {
                    id: 1,
                    name: "RRC Notre Dame Campus",
                    address: "2055 Notre Dame Ave, Winnipeg, MB R3H 0J9",
                    phone: "991"
                }
                ],
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

    // Test for createBranch
    describe("createBranch", () => {
        it("should return 201 and success message", async () => {
            // Arrange
            mockReq.body = mockBranch;
            (branchService.createBranch as jest.Mock).mockResolvedValue(mockBranch);

            // Act
            await branchController.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch created successfully",
                data: {
                    id: 1,
                    name: "RRC Notre Dame Campus",
                    address: "2055 Notre Dame Ave, Winnipeg, MB R3H 0J9",
                    phone: "991"
                },
            });
        });

        it("should return 400 if required fields are missing", async () => {
            // Arrange
            mockReq.body = {};

            // Act
            await branchController.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Missing required fields: name, address, phone",
            });
        });
    });

    // Test for getBranchById
    describe("getBranchById", () => {
        it("should return 200 and branch data", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            (branchService.getBranchById as jest.Mock).mockResolvedValue(mockBranch);

            // Act
            await branchController.getBranchById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `Branch with ID 1 found successfully`,
                data: {
                    id: 1,
                    name: "RRC Notre Dame Campus",
                    address: "2055 Notre Dame Ave, Winnipeg, MB R3H 0J9",
                    phone: "991"
                },
            });
        });

        it("should return 404 if branch not found", async () => {
            // Arrange
            mockReq.params = { id: "999" };
            (branchService.getBranchById as jest.Mock).mockResolvedValue(undefined);

            // Act
            await branchController.getBranchById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `Branch with ID 999 not found`,
            });
        });
    });

    // Test for updateBranch
    describe("updateBranch", () => {
        it("should return 200 and updated branch data", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            mockReq.body = { name: "RRC Notre Dame Campus is much better than EDC" };
            const updatedBranch = { ...mockBranch, ...mockReq.body };
            (branchService.updateBranch as jest.Mock).mockResolvedValue(updatedBranch);

            // Act
            await branchController.updateBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch updated successfully.",
                data: {
                    id: 1,
                    name: "RRC Notre Dame Campus is much better than EDC",
                    address: "2055 Notre Dame Ave, Winnipeg, MB R3H 0J9",
                    phone: "991"
                },
            });
        });

        it("should return 400 if update body is missing", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            mockReq.body = {};

            // Act
            await branchController.updateBranch(
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

    // Test for deleteBranch
    describe("deleteBranch", () => {
        it("should return 200 and success message", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            (branchService.deleteBranch as jest.Mock).mockResolvedValue(true);

            // Act
            await branchController.deleteBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `Branch with ID 1 deleted successfully.`,
            });
        });

        it("should return 404 and error if branch isn't found", async () => {
            // Arrange
            mockReq.params = { id: "999" };
            (branchService.deleteBranch as jest.Mock).mockResolvedValue(false);

            // Act
            await branchController.deleteBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );
            
            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `Branch with ID 999 not found.`
            });
        });
    });
});