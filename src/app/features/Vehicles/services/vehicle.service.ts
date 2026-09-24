import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Vehicle } from '../models/vehicle.model';
import { VehiclePerformance } from '../models/vehicle-performance.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5299/api/Vehicles';

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  getVehicle(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  getVehiclePerformance(id: string): Observable<VehiclePerformance> {
    return this.http.get<VehiclePerformance>(
      `${this.apiUrl}/${id}/performance`
    );
  }
}