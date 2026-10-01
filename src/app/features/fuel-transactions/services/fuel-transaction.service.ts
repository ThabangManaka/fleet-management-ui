import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FuelTransaction } from '../models/fuel-transaction.model';
import { CreateFuelTransactionRequest } from '../models/create-fuel-transaction-request.model';
import { UpdateFuelTransactionRequest } from '../models/update-fuel-transaction-request.model';

@Injectable({
  providedIn: 'root'
})
export class FuelTransactionService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:5299/api/FuelTransactions';

  getFuelTransactions(): Observable<FuelTransaction[]> {
    return this.http.get<FuelTransaction[]>(
      this.apiUrl
    );
  }

  getFuelTransaction(
    id: string
  ): Observable<FuelTransaction> {
    return this.http.get<FuelTransaction>(
      `${this.apiUrl}/${id}`
    );
  }

  createFuelTransaction(
    request: CreateFuelTransactionRequest
  ): Observable<string> {
    return this.http.post<string>(
      this.apiUrl,
      request
    );
  }

  updateFuelTransaction(
    id: string,
    request: UpdateFuelTransactionRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  deleteFuelTransaction(
    id: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
} 