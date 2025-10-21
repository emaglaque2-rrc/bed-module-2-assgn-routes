import { Request, Response, NextFunction } from "express";
import { Branch } from "../models/branchModel";
import * as branchService from "../services/branchService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse, errorResponse, ApiResponse } from "../models/responseModel";

type BranchBody = Omit<Branch, "id">;

/**
 * Manages requests, responses, and validations to create a new branch
 * @param req - The express Request, with body of type BranchBody
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const createBranch = async (
    req: Request<object, object, BranchBody>,
    res: Response<ApiResponse<Branch | null>>,
    next: NextFunction
): Promise<void> => {
    try {
        // Basic validation for required fields
        const requiredFields: (keyof BranchBody)[] = [
            "name",
            "address",
            "phone"
        ];

        // Check for missing fields
        const missingFields: string[] = requiredFields.filter((field) => {
            const value: unknown = req.body[field];
            return (value === undefined ||
                value === null ||
                value === "" ||
                (typeof value === "string" && value.trim() === "")
            );
        });

        // If any required fields are missing, respond with 400.
        if (missingFields.length > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse(`Missing required fields: ${missingFields.join(", ")}`)
            );
            return;
        }

        // (Destructuring) Extract only the fields we want
        const { name, address, phone }: BranchBody = req.body;

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
    res: Response<ApiResponse<Branch[]>>,
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
    res: Response<ApiResponse<Branch | null>>,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const branch: Branch | undefined = await branchService.getBranchById(Number(id));

        if (branch) {
            res.status(HTTP_STATUS.OK).json(
                successResponse(branch, `Branch with ID ${id} found successfully`)
            );
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse(`Branch with ID ${id} not found`)
            );
        }

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
    res: Response<ApiResponse<Branch | null>>,
    next: NextFunction
): Promise<void> => {
    try {
        // Just converting id to number for use in service layer
        const id: number = Number(req.params.id);

        if (isNaN(id)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Invalid branch ID. ID must be a number.")
            );
            return;
        }

        // An array of required fields for validation
        // CITATION FOR keyof usage: https://www.w3schools.com/typescript/typescript_keyof.php
        const requiredFields: (keyof Omit<Branch, "id">)[] = [
            "name",
            "address",
            "phone"
        ];

        // Validations
        const updates: Partial<Omit<Branch, "id">> = {};

        for (const key of requiredFields) {
            const value: unknown = req.body[key];
            if (
                typeof value === "string" &&
                value.trim() !== ""
            ) {
                updates[key] = value;
            }
        };

        if (Object.keys(updates).length === 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("At least one valid field must be provided to update.")
            );
            return;
        }

        // All fields valid, call service.
        const updatedBranch: Branch = await branchService.updateBranch(id, updates);

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
    res: Response<ApiResponse<string | null>>,
    next: NextFunction
): Promise<void> => {
    try {
        const idParam: string | undefined = req.params.id;
        const id: number = Number(idParam);

        // Checks if ID is provided at all
        if (!idParam) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Missing branch ID in request parameters.")
            );
            return;
        }

        if (isNaN(id)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Invalid branch ID. ID must be a number.")
            );
            return;
        }

        const deleted: boolean = await branchService.deleteBranch(id);

        if (!deleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse(`Branch with ID ${id} not found.`)
            );
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(`Branch with ID ${id} deleted successfully.`)
        );

    } catch (error: unknown) {
        next(error);
    }
};