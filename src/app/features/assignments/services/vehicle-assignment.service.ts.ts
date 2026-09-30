import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CreateVehicleAssignmentRequest } from '../models/create-vehicle-assignment-request.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleAssignmentService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:5299/api/VehicleAssignments';

  createAssignment(
    request: CreateVehicleAssignmentRequest
  ): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      { request }
    );
  }
}