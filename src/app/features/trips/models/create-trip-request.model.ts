export interface CreateTripRequest {
  vehicleId: string;
  driverId: string;
  startLocation: string;
  destination: string;
  startDate: string;
  startMileage: number;
  notes: string | null;
}