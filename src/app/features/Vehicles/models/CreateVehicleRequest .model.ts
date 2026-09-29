export interface UpdateVehicleRequest {
  id: string;
  registrationNumber: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  fuelType: number;
}