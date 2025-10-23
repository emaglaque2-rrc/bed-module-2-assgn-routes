import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Branch } from "../../v1/models/branchModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// reference to the Firestore collection name
const COLLECTION_NAME: string = "branches";

/**
 * Creates a new branch.
 * @param branchData Data for the new branch, excluding ID.
 * @returns The newly created Branch, including system (firestore) generated ID.
 */
export const createBranch = async (branchData: Omit<Branch, "id">):
    Promise<Branch> => {
        try {
            const newBranch: Partial<Branch> = {
                ...branchData,
            }

            const branchId: string = await createDocument<Branch>(
                COLLECTION_NAME,
                newBranch
            );

            return structuredClone({ id: branchId, ...newBranch } as Branch);
        } catch (error: unknown) {
            const message = 
                error instanceof Error ? error.message : "Unknown error creating branch";
            throw new Error(`Failed to create branch: ${message}`);
        }
};

/**
 * Retrieves all branches from storage
 * @returns Array of Branches, containing ID, name, address, and phone.
 */
export const getAllBranches = async (): Promise<Branch[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION_NAME);
        const branches: Branch[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Branch;
        });
        return structuredClone(branches);
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve branches: ${errorMessage}`);
    }
};

/**
 * Returns a branch by it's ID.
 * @param id - ID of the branch to retrieve.
 * @returns The branch specified by ID, or null if not found.
 */
export const getBranchById = async (id: string): Promise<Branch> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION_NAME,
            id
        );

        if (!doc) {
            throw new Error(`Branch with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        const branch: Branch = {
            id: doc.id,
            ...data,
        } as Branch;

        return structuredClone(branch);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve branch with ID ${id}: ${errorMessage}`);
    }
};

/**
 * Updates (replaces) an existing branch by it's ID.
 * @param id - The ID of the branch to update.
 * @param branchData - The fields to update.
 * @returns The updated Branch.
 * @throws Error if branch with given ID is not found.
 */
export const updateBranch = async (
    id: string,
    branchData: Pick<Branch, "name" | "address" | "phone">
): Promise<Branch> => {
    try {
        // check if the branch exists before updating
        const branch: Branch = await getBranchById(id);

        if (!branch) {
            throw new Error(`Branch with ID ${id} not found`);
        }

        // CITATION FOR OBJECT.ENTRIES USAGE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
        // AND ALSO IN ITEM DEMO FROM MOD 3.
        // Filtering out undefined fields dynamically
        const filteredUpdates = Object.fromEntries(
            Object.entries(branchData).filter(([_, value]) => value !== undefined)
        );

        const updatedBranch: Branch = {
            ...branch,
            ...filteredUpdates,
        };

        await updateDocument<Branch>(COLLECTION_NAME, id, updatedBranch);

        return structuredClone(updatedBranch);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update branch with ID ${id}: ${errorMessage}`);
    }
};

/**
 * Deletes a branch from Firestore.
 * @param id - The ID of the branch to delete
 * @throws Error if branch with given ID is not found.
 */
export const deleteBranch = async (id: string): Promise<void> => {
    try {
        // Check if the branch exists before deleting
        const branch: Branch = await getBranchById(id);
        if (!branch) {
            throw new Error(`Branch with ID ${id} not found`);
        }

        await deleteDocument(COLLECTION_NAME, id);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete branch with ID ${id}: ${errorMessage}`);
    }
}