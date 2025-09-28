import { employees, Employee } from "../../../data/employee";

/**
 * Retrieve all employees from storage
 * @returns Array of Employees
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
    return structuredClone(employees);
};


