export interface UpdateTripRequest {
  startLocation: string;
  destination: string;
  startDate: string;
  endDate: string | null;
  startMileage: number;
  endMileage: number | null;
  status: number;
  notes: string | null;
}