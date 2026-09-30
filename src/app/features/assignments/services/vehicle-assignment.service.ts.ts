import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CreateVehicleAssignmentRequest } from '../models/create-vehicle-assignment-request.model';
import { VehicleAssignment } from '../models/vehicle-assignment.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleAssignmentService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:5299/api/VehicleAssignments';

  getAssignments(): Observable<VehicleAssignment[]> {
    return this.http.get<VehicleAssignment[]>(
      this.apiUrl
    );
  }
  
  createAssignment(
    request: CreateVehicleAssignmentRequest
  ): Observable<VehicleAssignment> {
    return this.http.post<VehicleAssignment>(
      this.apiUrl,
      {
        request
      }
    );
  }
}