export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  driverId: string;
  assignedAt: string;
  unassignedAt: string | null;
}