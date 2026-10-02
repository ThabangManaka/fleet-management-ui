export interface UpdateMaintenanceRequest {
  maintenanceType: string;
  description: string;
  serviceDate: string;
  mileage: number;
  cost: number;
  notes: string | null;
  status: number;
}