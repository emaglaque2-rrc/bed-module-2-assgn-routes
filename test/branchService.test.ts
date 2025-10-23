import * as branchService from "../src/api/v1/services/branchService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Branch } from "../src/api/v1/models/branchModel";

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Branch Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a branch successfully", async () => {
        // Arrange
        const mockBranchData: {
            name: string;
            address: string;
            phone: string;
        } = {
            name: "RRC EDC",
            address: "123 Main St, Winnipeg, MB",
            phone: "204-123-4567",
        };
        const mockDocumentId: string = "branch-69420";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            mockDocumentId
        );

        // Act
        const result: Branch = await branchService.createBranch(mockBranchData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "branches",
            expect.objectContaining({
                name: "RRC EDC",
                address: "123 Main St, Winnipeg, MB",
                phone: "204-123-4567",
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe(mockBranchData.name);
    });

});