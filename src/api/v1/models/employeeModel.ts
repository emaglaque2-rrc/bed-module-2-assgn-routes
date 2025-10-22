/**
 * Represents an Employee in the system.
 */
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  branchId: number;
}