export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt?: string | null;
}