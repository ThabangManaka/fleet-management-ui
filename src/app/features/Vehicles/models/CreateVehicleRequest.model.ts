export interface CreateVehicleRequest {
  registrationNumber: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  fuelType: number;
}

