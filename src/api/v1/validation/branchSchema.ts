import Joi from "joi";
import { getBranchById } from "../services/branchService";

// Branch operation schemas organized by request part
export const branchSchemas = {
    // POST /api/v1/branches - Create new Branch
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Branch name is required",
                "string.empty": "Branch name cannot be empty",
            }),
            address: Joi.string().required().messages({
                "any.required": "Branch address is required",
                "string.empty": "Branch address cannot be empty",
            }),
            phone: Joi.string().required().messages({
                "any.required": "Branch phone number is required",
                "string.empty": "Branch phone number cannot be empty",
            }),
        }),
    },

    // GET /api/v1/branches/:id - Get Branch by ID
    getBranchById: {
        params: Joi.object({
            id: Joi.number().integer().required().messages({
                "any.required": "Branch ID is required",
                "number.base": "Branch ID must be a number",
            }),
        }),
    },

    
}