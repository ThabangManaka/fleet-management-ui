export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  startLocation: string;
  destination: string;
  startDate: string;
  endDate: string | null;
  startMileage: number;
  endMileage: number | null;
  status: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
}