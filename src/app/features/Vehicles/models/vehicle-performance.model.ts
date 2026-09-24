export interface VehiclePerformance {
  vehicleId: string;
  registrationNumber: string;
  make: string;
  model: string;

  currentMileage: number;

  fuelEfficiency: number;
  fuelCostPer100Km: number;

  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalOperatingCost: number;

  totalTrips: number;
  totalDistanceTravelled: number;
}