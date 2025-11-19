import Joi from "joi";

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
            id: Joi.string().required().messages({
                "any.required": "Branch ID is required",
                "string.base": "Branch ID must be a string",
            }),
        }),
    },

    // PUT /api/v1/branches/:id - Update existing Branch
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Branch ID is required",
                "string.base": "Branch ID must be a string",
            }),
        }),
        body: Joi.object({
            name: Joi.string().optional().messages({
                "string.empty": "Branch name cannot be empty",
            }),
            address: Joi.string().optional().messages({
                "string.empty": "Branch address cannot be empty",
            }),
            phone: Joi.string().optional().messages({
                "string.empty": "Branch phone number cannot be empty",
            }),
        }),
    },

    // DELETE /api/v1/branches/:id - Delete Branch by ID
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Branch ID is required",
                "string.base": "Branch ID must be a string",
            }),
        }),
    },
};