import { Request, Response, NextFunction } from "express";
import { Branch } from "../../../data/branches";
import * as branchService from "../services/branchService";
import { HTTP_STATUS } from "../../../constants/httpConstants";

type BranchBody = Omit<Branch, "id">;

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
