export interface UpdateVehicleRequest {
  registrationNumber: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  fuelType: number;
  status: number;
  mileage: number;
}