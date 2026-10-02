export interface Maintenance {
  id: string;
  vehicleId: string;
  maintenanceType: string;
  description: string;
  serviceDate: string;
  mileage: number;
  cost: number;
  notes: string | null;
  status: number;
  createdAt: string;
  updatedAt: string | null;
}