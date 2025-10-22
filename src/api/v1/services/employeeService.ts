
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
    Query,
} from "firebase-admin/firestore";
import { Employee } from "../models/employeeModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getDocumentsByFieldValues,
} from "../repositories/firestoreRepository";

// reference to the Firestore collection name
const COLLECTION_NAME = "employees";

/**
 * Creates a new employee
 * @param employeeData Data for the new employee, excluding ID.
 * @returns The newly created Employee, including system (firestore) generated ID.
 */
export const createEmployee = async (employeeData: Omit<Employee, "id">):
    Promise<Employee> => {
        try {
            const newEmployee: Partial<Employee> = {
                ...employeeData,
            };

            const employeeId: string = await createDocument<Employee>(
                COLLECTION_NAME,
                newEmployee
            );

            return structuredClone({ id: employeeId, ...newEmployee } as Employee);
        } catch (error: unknown) {
            const message =
            error instanceof Error ? error.message : "Unknown error creating employee";
            throw new Error(`Failed to create employee: ${message}`);
        }
};

/**
 * Retrieve all employees from storage
 * @returns Array of Employees, containing ID, name, position,
 * department, email, phone, and branchId.
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION_NAME);
        const employees: Employee[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Employee;
        });

        return structuredClone(employees);
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message : "Unknown error retrieving employees";
        throw new Error(`Failed to retrieve employees: ${errorMessage}`);
    }
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
    const employeeIndex: number = employees.findIndex((emp: Employee) => emp.id === id);

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

/**
 * Get all employees for a specific branch.
 * @param branchId - The ID of the branch to get employees for.
 * @returns An array of employees belonging to the specified branch.
 */
export const getEmployeesByBranchId = async (branchId: number): Promise<Employee[]> => {
    const branchEmployee: Employee[] = employees.filter((employee: Employee) => employee.branchId === branchId);
    return structuredClone(branchEmployee);
};

/**
 * Retrieves all employees in the specified department.
 * @param department - The department to filter employees by.
 * @returns An array of employees in the specified department.
 */
export const getEmployeesByDepartment = async (department: string): Promise<Employee[]> => {
    const departmentEmployees: Employee[] = employees.filter(
        (employee: Employee) => employee.department.toLowerCase() === department.toLowerCase()
    );

    return structuredClone(departmentEmployees);
};