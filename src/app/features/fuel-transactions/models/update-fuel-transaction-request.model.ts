export interface UpdateFuelTransactionRequest {
  transactionDate: string;
  mileage: number;
  litres: number;
  pricePerLitre: number;
  fuelType: string;
  fuelStation: string | null;
  receiptNumber: string | null;
  notes: string | null;
}