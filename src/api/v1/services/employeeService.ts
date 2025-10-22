
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
export const getEmployeeById = async (id: string): Promise<Employee> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION_NAME,
            id
        );

        if (!doc) {
            throw new Error(`Employee with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        const employee: Employee = {
            id: doc.id,
            ...data,
        } as Employee;

        return structuredClone(employee);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error retrieving employee";
        throw new Error(`Failed to retrieve employee with ID ${id}: ${errorMessage}`);
    }
};

/**
 * Updates (replaces) an existing employee by their ID.
 * @param id - The ID of the employee to update.
 * @param employeeData - The fields to update.
 * @returns The updated Employee.
 * @throws Error if employee with given ID is not found.
 */
export const updateEmployee = async (
    id: string,
    employeeData: Pick<Employee,
    "name" | "position" | "department" | "email" | "phone" | "branchId">
): Promise<Employee> => {
    try {
        // check if the employee exists before updating
        const employee: Employee = await getEmployeeById(id);

        if (!employee) {
            throw new Error(`Employee with ID ${id} not found`);
        }

        // CITATION FOR OBJECT.ENTRIES USAGE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
        // AND ALSO IN ITEM DEMO FROM MOD 3.
        // Filtering out undefined fields dynamically
        const filteredUpdates = Object.fromEntries(
            Object.entries(employeeData).filter(([_, value]) => value !== undefined)
        );

        const updatedEmployee: Employee = {
            ...employee,
            ...filteredUpdates,
        };
        
        await updateDocument<Employee>(
            COLLECTION_NAME,
            id,
            updatedEmployee
        );

        return structuredClone(updatedEmployee);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error updating employee";
        throw new Error(`Failed to update employee with ID ${id}: ${errorMessage}`);
    }
};

/**
 * Delete an employee from storage.
 * @param id - The ID of the employee to delete.
 * @returns True if the employee was deleted, false if not found.
 * @throws Error if employee with given ID is not found.
 */
export const deleteEmployee = async (id: string): Promise<void> => {
    try {
        // check if the employee exists before deleting
        const employee: Employee = await getEmployeeById(id);

        if (!employee) {
            throw new Error(`Employee with ID ${id} not found`);
        }

        await deleteDocument(COLLECTION_NAME, id);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error deleting employee";
        throw new Error(`Failed to delete employee with ID ${id}: ${errorMessage}`);
    } 
};

/**
 * Get all employees for a specific branch.
 * @param branchId - The ID of the branch to get employees for.
 * @returns An array of employees belonging to the specified branch.
 */
export const getEmployeesByBranchId = async (branchId: string): Promise<Employee[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocumentsByFieldValues(
            COLLECTION_NAME,
            [{ fieldName: "branchId", fieldValue: branchId }]
        );

        const branchEmployees: Employee[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Employee;
        });

        return structuredClone(branchEmployees);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error retrieving employees by branch ID";
        throw new Error(`Failed to retrieve employees for branch ID ${branchId}: ${errorMessage}`);
    }
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