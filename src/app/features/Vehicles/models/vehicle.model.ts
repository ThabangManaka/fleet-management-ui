export interface Vehicle {
  id: string;
  registrationNumber: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  mileage: number;
  status: string;
  createdAt: string;
  updatedAt?: string | null;
}