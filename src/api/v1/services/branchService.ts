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

/**
 * Returns a branch by it's ID.
 * @param id - ID of the branch to retrieve.
 * @returns The branch specified by ID, or undefined if not found.
 */
export const getBranchById = async (id: number): Promise<Branch | undefined> => {
    return structuredClone(branches.find((branch: Branch) => branch.id === id));
};

/**
 * Updates (replaces) an existing branch by it's ID.
 * @param id - The ID of the branch to update.
 * @param branchData - The fields to update.
 * @returns The updated Branch.
 * @throws Error if branch with given ID is not found.
 */
export const updateBranch = async (
    id: number,
    branchData: Partial<Omit<Branch, "id">>
): Promise<Branch> => {
    const branchIndex = branches.findIndex((branch: Branch) => branch.id === id);

    if (branchIndex === -1) {
        throw new Error(`Branch with ID ${id} not found`);
    }

    branches[branchIndex] = {
        ...branches[branchIndex],
        ...branchData,
    };

    return structuredClone(branches[branchIndex]);
};