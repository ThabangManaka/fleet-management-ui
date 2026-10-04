import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip.model';
import { CreateTripRequest } from '../models/create-trip-request.model';
import { UpdateTripRequest } from '../models/update-trip-request.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:5299/api/Trips';

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  getTrip(id: string): Observable<Trip> {
    return this.http.get<Trip>(
      `${this.apiUrl}/${id}`
    );
  }

  createTrip(
    request: CreateTripRequest
  ): Observable<string> {
    return this.http.post<string>(
      this.apiUrl,
      {
        request
      }
    );
  }

  updateTrip(
    id: string,
    request: UpdateTripRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      {
        id,
        request
      }
    );
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}