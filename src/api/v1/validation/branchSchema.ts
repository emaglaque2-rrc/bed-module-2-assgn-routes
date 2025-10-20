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
}