export interface CreateMaintenanceRequest {
  vehicleId: string;
  maintenanceType: string;
  description: string;
  serviceDate: string;
  mileage: number;
  cost: number;
  notes: string | null;
}