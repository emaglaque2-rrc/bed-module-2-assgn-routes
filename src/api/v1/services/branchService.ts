import { Branch, branches } from "../../../data/branches";

let branchId = branches.length + 1;

/**
 * Creates a new branch.
 * @param branchData Data for the new branch, excluding ID.
 * @returns The newly created Branch, including system generated ID.
 */
export const createBranch = async (branchData: Omit<Branch, "id">):
    Promise<Branch> => {
        const newBranch: Branch = {
            id: branchId++,
            ...branchData
        };

        branches.push(newBranch);
        return structuredClone(newBranch);
};

/**
 * Retrieves all branches from storage
 * @returns Array of Branches, containing ID, name, address, and phone.
 */
export const getAllBranches = async (): Promise<Branch[]> => {
    return structuredClone(branches);
};