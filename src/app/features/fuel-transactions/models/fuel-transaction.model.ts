export interface FuelTransaction {
  id: string;
  vehicleId: string;
  transactionDate: string;
  mileage: number;
  litres: number;
  pricePerLitre: number;
  fuelType: string;
  fuelStation: string | null;
  receiptNumber: string | null;
  notes: string | null;
}