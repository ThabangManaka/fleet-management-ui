import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FleetDashboard } from '../models/fleet-dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:YOUR_PORT/api/FleetDashboard';

  getDashboard(): Observable<FleetDashboard> {
    return this.http.get<FleetDashboard>(this.apiUrl);
  }
}