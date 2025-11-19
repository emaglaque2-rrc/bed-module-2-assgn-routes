import Joi from "joi";

// Employee operation schemas organized by request part
export const employeeSchemas = {
    // POST /api/v1/employees - Create new Employee
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Employee name is required",
                "string.empty": "Employee name cannot be empty",
            }),
            position: Joi.string().required().messages({
                "any.required": "Position is required",
                "string.empty": "Position cannot be empty",
            }),
            department: Joi.string().required().messages({
                "any.required": "Department is required",
                "string.empty": "Department cannot be empty",
            }),
            // CITATION FOR EMAIL() USAGE: https://joi.dev/api/?v=17.13.3#stringemailoptions
            email: Joi.string().email().required().messages({
                "any.required": "Email is required",
                "string.email": "Email must be a valid email address",
                "string.empty": "Email cannot be empty",
            }),
            phone: Joi.string().required().messages({
                "any.required": "Phone number is required",
                "string.empty": "Phone number cannot be empty",
            }),
            branchId: Joi.string().required().messages({
                "any.required": "Branch ID is required",
                "string.empty": "Branch ID cannot be empty",
            }),
        }),
    },

    // PUT /api/v1/employees/:id - Update existing Employee
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Employee ID is required",
                "string.base": "Employee ID must be a string",
            }),
        }),
        body: Joi.object({
            name: Joi.string().optional().messages({
                "string.empty": "Employee name cannot be empty",
            }),
            position: Joi.string().optional().messages({
                "string.empty": "Position cannot be empty",
            }),
            department: Joi.string().optional().messages({
                "string.empty": "Department cannot be empty",
            }),
            // CITATION FOR EMAIL() USAGE: https://joi.dev/api/?v=17.13.3#stringemailoptions
            email: Joi.string().email().optional().messages({
                "string.email": "Email must be a valid email address",
                "string.empty": "Email cannot be empty",
            }),
            phone: Joi.string().optional().messages({
                "string.empty": "Phone number cannot be empty",
            }),
            branchId: Joi.string().optional().messages({
                "string.empty": "Branch ID cannot be empty",
            }),
        })
    },

    // GET /api/v1/employees/:id - Retrieve a single Employee by ID
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Employee ID is required",
                "string.base": "Employee ID must be a string",
            }),
        }),
    },

    // DELETE /api/v1/employees/:id - Delete an Employee by ID
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Employee ID is required",
                "string.base": "Employee ID must be a string",
            }),
        }),
    },

    // GET /api/v1/employees/branch/:branchId - Retrieve Employees by Branch ID
    getEmployeesByBranchId: {
        params: Joi.object({
            branchId: Joi.string().required().messages({
                "any.required": "Branch ID is required",
                "string.empty": "Branch ID cannot be empty",
            }),
        }),
    },

    // GET /api/v1/employees/department/:department - Retrieve Employees by Department
    getEmployeesByDepartment: {
        params: Joi.object({
            department: Joi.string().required().messages({
                "any.required": "Department is required",
                "string.empty": "Department cannot be empty",
            }),
        }),
    },

};