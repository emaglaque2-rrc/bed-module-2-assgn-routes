import * as employeeService from "../src/api/v1/services/employeeService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Employee } from "../src/api/v1/models/employeeModel";

// Mocks repository module
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Employee Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create an employee successfully", async () => {
        // Arrange 
        const mockEmployeeData: Omit<Employee, "id"> = {
            name: "Derek Sabourin",
            position: "Developer",
            department: "ACE",
            email: "derek.sabourin@example.com",
            phone: "123-456-7890",
            branchId: "1",
        };
        const mockDocumentId: string = "123";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            mockDocumentId
        );

        // Act
        const result: Employee = await employeeService.createEmployee(mockEmployeeData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "employees",
            expect.objectContaining({
                name: "Derek Sabourin",
                position: "Developer",
                department: "ACE",
                email: "derek.sabourin@example.com",
                phone: "123-456-7890",
                branchId: "1"
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe(mockEmployeeData.name);
        expect(result.position).toBe(mockEmployeeData.position);
        expect(result.department).toBe(mockEmployeeData.department);
        expect(result.email).toBe(mockEmployeeData.email);
        expect(result.phone).toBe(mockEmployeeData.phone);
        expect(result.branchId).toBe(mockEmployeeData.branchId);
    });

    it("should retrieve all employees successfully", async () => {
        // Arrange
        const mockDocs = [
            { 
                id: "1", 
                data: () => ({
                    name: "Derek Sabourin",
                    position: "Developer",
                    department: "ACE",
                    email: "derek.sabourin@example.com",
                    phone: "123-456-7890",
                    branchId: "1"
                }),
            },
            {
                id: "2",
                data: () => ({
                    name: "Edraque Doe",
                    position: "Manager",
                    department: "HR",
                    email: "emaglaque2@academic.rrc.ca",
                    phone: "991",
                    branchId: "2"
                }),
            },
        ];

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
            docs: mockDocs,
        });

        // Act
        const result: Employee[] = await employeeService.getAllEmployees();

        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith(
            "employees"
        );
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            id: "1",
            name: "Derek Sabourin",
            position: "Developer",
            department: "ACE",
            email: "derek.sabourin@example.com",
            phone: "123-456-7890",
            branchId: "1"
        });
        expect(result[1]).toEqual({
            id: "2",
            name: "Edraque Doe",
            position: "Manager",
            department: "HR",
            email: "emaglaque2@academic.rrc.ca",
            phone: "991",
            branchId: "2"
        }); 
    });

    it("should retrieve an employee by ID successfully", async () => {
        // Arrange
        const mockDoc = {
            id: "1",
            data: () => ({
                name: "Derek Sabourin",
                position: "Developer",
                department: "ACE",
                email: "derek.sabourin@example.com",
                phone: "123-456-7890",
                branchId: "1"
            })
        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
        
        // Act
        const result: Employee = await employeeService.getEmployeeById("1");

        // Assert
        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(
            "employees",
            "1"
        );
        expect(result.id).toBe("1");
        expect(result.name).toBe("Derek Sabourin");
        expect(result.position).toBe("Developer");
        expect(result.department).toBe("ACE");
        expect(result.email).toBe("derek.sabourin@example.com");
        expect(result.phone).toBe("123-456-7890");
        expect(result.branchId).toBe("1");
    });

    it("should update an employee successfully", async () => {
        // Arrange 
        const mockExistingEmployeeData: Employee = {
            id: "1",
            name: "Derek Sabourin",
            position: "Developer",
            department: "ACE",
            email: "derek.sabourin@example.com",
            phone: "123-456-7890",
            branchId: "1"
        };
        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
            id: mockExistingEmployeeData.id,
            data: () => ({ ...mockExistingEmployeeData }),
        });
        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);
        
        const updateData: Partial<Pick<Employee, 
            "name" | "position" | "department" | "email" | "phone" | "branchId">> = 
            {
                position: "Senior Developer",
                phone: "991",
            };

        // Act
        await employeeService.updateEmployee(
            mockExistingEmployeeData.id,
            updateData as Pick<Employee,
            "name" | "position" | "department" | "email" | "phone" | "branchId">
        )

        // Assert
        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "employees",
            mockExistingEmployeeData.id,
            expect.objectContaining({
                position: "Senior Developer",
                phone: "991",
            })
        );
    });

    it("should delete an employee successfully", async () => {
        // Arrange
        const mockEmployee: Employee = {
            id: "1",
            name: "Derek Sabourin",
            position: "Developer",
            department: "ACE",
            email: "derek.sabourin@example.com",
            phone: "991",
            branchId: "1"
        };
        
        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
            id: mockEmployee.id,
            data: () => ({ ...mockEmployee }),
        });
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

        // Act
        await employeeService.deleteEmployee(mockEmployee.id);

        // Assert 
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "employees",
            mockEmployee.id
        );
    });

    it("should retrieve employees by branch ID successfully", async () => {
        // Arrange
        const mockDocs = [
            {
                id: "1",
                data: () => ({
                    name: "Derek Sabourin",
                    position: "Developer",
                    department: "ACE",
                    email: "derek.sabourin@example.com",
                    phone: "991",
                    branchId: "1"
                }),
            },
            {
                id: "2",
                data: () => ({
                    name: "Edraque",
                    position: "Software Engineer",
                    department: "ACE",
                    email: "emaglaque@academic.rrc.ca",
                    phone: "992",
                    branchId: "1"
                }),
            },
        ];

        (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue({
            docs: mockDocs,
        });

        // Act
        const result: Employee[] = await employeeService.getEmployeesByBranchId("1");

        // Assert
        expect(firestoreRepository.getDocumentsByFieldValues).toHaveBeenCalledWith(
            "employees",
            [{ fieldName: "branchId", fieldValue: "1" },]
        );
        expect(result).toHaveLength(2);
        expect(result[0].branchId).toBe("1");
        expect(result[1].name).toBe("Edraque");
    });

    it("should retrieve employees by department successfully", async () => {
        // Arrange
        const mockDocs = [
            {
                id: "1",
                data: () => ({
                    name: "Derek Sabourin",
                    position: "Developer",
                    department: "ACE",
                    email: "derek.sabourin@example.com",
                    phone: "991",
                    branchId: "1"
                }),
            },
        ];

        (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue({
            docs: mockDocs,
        });
        
        // Act
        const result: Employee[] = await employeeService.getEmployeesByDepartment("ACE");

        // Assert
        expect(firestoreRepository.getDocumentsByFieldValues).toHaveBeenCalledWith(
            "employees",
            [{ fieldName: "department", fieldValue: "ACE" }]
        );
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Derek Sabourin");
        expect(result[0].department).toBe("ACE");
    });
});