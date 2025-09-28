import { employees, Employee } from "../../../data/employee";

let nextId = employees.length + 1;

/**
 * Creates a new employee
 * @param employeeData Data for the new employee, excluding ID.
 * @returns The newly created Employee, including system generated ID.
 */
export const createEmployee = async (employeeData: Omit<Employee, "id">):
     Promise<Employee> => {
        const newEmployee: Employee = { 
            id: nextId++,
            ...employeeData
        };

        employees.push(newEmployee);
        return structuredClone(newEmployee);
};

/**
 * Retrieve all employees from storage
 * @returns Array of Employees, containing ID, name, position,
 * department, email, phone, and branchId.
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
    return structuredClone(employees);
};

