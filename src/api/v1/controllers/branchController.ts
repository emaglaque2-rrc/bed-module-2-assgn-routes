import { Request, Response, NextFunction } from "express";
import { Branch } from "../../../data/branches";
import * as branchService from "../services/branchService";
import { HTTP_STATUS } from "../../../constants/httpConstants";

type BranchBody = Omit<Branch, "id">;

/**
 * Manages requests, responses, and validations to create a new branch
 * @param req - The express Request, with body of type BranchBody
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const createBranch = async (
    req: Request<{}, {}, BranchBody>,
    res: Response,
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
            const value = req.body[field];
            return (value === undefined ||
                value === null ||
                value === "" ||
                (typeof value === "string" && value.trim() === "")
            );
        });

        // If any required fields are missing, respond with 400.
        if (missingFields.length > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
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

        res.status(HTTP_STATUS.CREATED).json({
            message: "Branch created successfully",
            data: newBranch
        });
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

        res.status(HTTP_STATUS.OK).json({
            message: "Branches retrieved successfully",
            data: branches,
        });

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

        const branch: Branch | undefined = await branchService.getBranchById(Number(id));

        if (branch) {
            res.status(HTTP_STATUS.OK).json({
                message: `Branch with ID ${id} found successfully`,
                data: branch,
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Branch with ID ${id} not found`,
            });
        }

    } catch (error: unknown) {
        next(error);
    }
};