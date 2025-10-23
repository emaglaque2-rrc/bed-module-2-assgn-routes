import { Request, Response, NextFunction } from "express";
import { Branch } from "../models/branchModel";
import * as branchService from "../services/branchService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";

/**
 * Manages requests, responses, and validations to create a new branch
 * @param req - The express Request, with body of type BranchBody
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const createBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // (Destructuring) Extract only the fields we want
        const { name, address, phone } = req.body;

        // Call the service layer
        const newBranch: Branch = await branchService.createBranch({
            name,
            address,
            phone
        });

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newBranch, "Branch created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve all branches.
 * @param _req - The express Request (uninentionally not used, "_*")
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllBranches = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const branches: Branch[] = await branchService.getAllBranches();

        res.status(HTTP_STATUS.OK).json(
            successResponse(branches, "Branches retrieved successfully")
        );

    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Retrieves a branch by it's ID.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getBranchById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const branch: Branch = await branchService.getBranchById(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(branch, "Branch retrieved successfully")
        );

    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update an existing branch by ID.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const updateBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        // Extract update fields
        const { name, address, phone } = req.body;

        // Create the update Branch object using the service with the fields to be updated
        const updatedBranch: Branch = await branchService.updateBranch(id, {
            name,
            address,
            phone
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedBranch, "Branch updated successfully.")
        );

    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to delete a branch by ID.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        await branchService.deleteBranch(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(null, `Branch with ID ${id} deleted successfully.`)
        );

    } catch (error: unknown) {
        next(error);
    }
};