export interface FleetDashboard {
  totalVehicles: number;
  availableVehicles: number;
  assignedVehicles: number;
  vehiclesInMaintenance: number;

  totalDrivers: number;
  activeDrivers: number;

  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalOperatingCost: number;

  averageFuelCostPerVehicle: number;
  averageMaintenanceCostPerVehicle: number;

  totalTrips: number;
  totalDistanceTravelled: number;
  averageDistancePerTrip: number;

  vehicleUtilizationRate: number;
  vehicleMaintenanceRate: number;
}