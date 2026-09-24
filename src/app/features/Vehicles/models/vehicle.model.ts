export interface Vehicle {
  id: string;
  registrationNumber: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  fuelType: number;
  mileage: number;
  status: number;
  createdAt: string;
  updatedAt?: string | null;
}