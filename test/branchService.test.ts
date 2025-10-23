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

    it("should retrieve all branches successfully", async (): Promise<void> => {
        // Arrange
        const mockDocs: { id: string; data: () => { name: string; address: string; phone: string; }; }[] = [
            { id: "b1", data: () => ({ name: "Branch 1", address: "Addr 1", phone: "111-111-1111" }) },
            { id: "b2", data: () => ({ name: "Branch 2", address: "Addr 2", phone: "222-222-2222" }) },
        ];
        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
            docs: mockDocs,
        });

        // Act
        const result: Branch[] = await branchService.getAllBranches();

        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("branches");
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            id: "b1",
            name: "Branch 1",
            address: "Addr 1",
            phone: "111-111-1111",
        });
        expect(result[1]).toEqual({
            id: "b2",
            name: "Branch 2",
            address: "Addr 2",
            phone: "222-222-2222",
        });
    });

    it("should retrieve a branch by ID successfully", async () => {
        // Arrange
        const mockBranchId: string = "branch1";
        const mockDoc: Omit<Branch, "id"> = {
            name: "RRC NDC",
            address: "100 Main St, Winnipeg, MB",
            phone: "991",
        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
            id: mockBranchId,
            data: () => mockDoc,
        });

        // Act
        const result: Branch = await branchService.getBranchById(mockBranchId);

        // Assert
        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(
            "branches",
            mockBranchId
        );
        expect(result.id).toBe(mockBranchId);
        expect(result.name).toBe(mockDoc.name);
        expect(result.address).toBe(mockDoc.address);
        expect(result.phone).toBe(mockDoc.phone);
    });

    it("should update a branch successfully", async () => {
        // Arrange
        const mockExistingBranchData: {
            name: string;
            address: string;
            phone: string;
        } = {
            name: "RRC EDC",
            address: "123 Main St, Winnipeg, MB",
            phone: "204-123-4567",
        };
        const mockDocumentId: string = "branch-69420";
        const updateData: Omit<Branch, "id"> = {
            name: "RRC EDC",
            address: "123 Main St, Winnipeg, MB",
            phone: "991",
        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
            id: mockDocumentId,
            data: () => mockExistingBranchData,
        });
        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        const result: Branch = await branchService.updateBranch(
            mockDocumentId,
            updateData
        );

        // Assert
        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "branches",
            mockDocumentId,
            expect.objectContaining({
                name: "RRC EDC",
                address: "123 Main St, Winnipeg, MB",
                phone: "991",
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.phone).toBe(updateData.phone);
    });

    it("should delete a branch successfully", async () => {
        // Arrange
        const mockExistingBranchData: {
            name: string;
            address: string;
            phone: string;
        } = {
            name: "RRC EDC",
            address: "123 Main St, Winnipeg, MB",
            phone: "204-123-4567",
        };
        const mockDocumentId: string = "branch-69420";

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
            id: mockDocumentId,
            data: () => mockExistingBranchData,
        });
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await branchService.deleteBranch(mockDocumentId);

        // Assert
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "branches",
            mockDocumentId
        );
    });
});