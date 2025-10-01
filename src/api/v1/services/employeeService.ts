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

/**
 * Returns an employee by their ID.
 * @param id - ID of the employee to retrieve.
 * @returns The employee specified by ID, or undefined if not found.
 */
export const getEmployeeById = async (id: number): Promise<Employee | undefined> => {
    return structuredClone(employees.find((emp: Employee) => emp.id === id));
};

/**
 * Updates (replaces) an existing employee by their ID.
 * @param id - The ID of the employee to update.
 * @param employeeData - The fields to update.
 * @returns The updated Employee.
 * @throws Error if employee with given ID is not found.
 */
export const updateEmployee = async (
    id: number,
    employeeData: Partial<Omit<Employee, "id">>
): Promise<Employee> => {
    const employeeIndex = employees.findIndex((emp: Employee) => emp.id === id);

    if (employeeIndex === -1) {
        throw new Error(`Employee with ID ${id} not found`);
    }

    employees[employeeIndex] = {
        ...employees[employeeIndex],
        ...employeeData,
    };

    return structuredClone(employees[employeeIndex]);
};

/**
 * Delete an employee from storage.
 * @param id - The ID of the employee to delete.
 * @returns True if the employee was deleted, false if not found.
 */
export const deleteEmployee = async (id: number): Promise<boolean> => {
    const index: number = employees.findIndex((emp: Employee) => emp.id === id);

    if (index === -1) {
        return false;
    }

    employees.splice(index, 1);
    return true;
};