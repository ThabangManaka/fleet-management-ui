import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Maintenance } from '../models/maintenance.model';
import { CreateMaintenanceRequest } from '../models/create-maintenance-request.model';
import { UpdateMaintenanceRequest } from '../models/update-maintenance-request.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:5299/api/Maintenances';

  getMaintenances(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(
      this.apiUrl
    );
  }

  getMaintenance(
    id: string
  ): Observable<Maintenance> {
    return this.http.get<Maintenance>(
      `${this.apiUrl}/${id}`
    );
  }

  createMaintenance(
    request: CreateMaintenanceRequest
  ): Observable<string> {
    return this.http.post<string>(
      this.apiUrl,
      {
        request
      }
    );
  }

  updateMaintenance(
    id: string,
    request: UpdateMaintenanceRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      {
        id,
        request
      }
    );
  }

  deleteMaintenance(
    id: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  getMaintenancesByVehicle(
    vehicleId: string
  ): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(
      `${this.apiUrl}/vehicle/${vehicleId}`
    );
  }
}