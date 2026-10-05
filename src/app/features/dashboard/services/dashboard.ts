import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FleetDashboard } from '../models/fleet-dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:5299/api/FleetDashboard';

  getDashboard(
    from?: string | null,
    to?: string | null
  ): Observable<FleetDashboard> {

    let params = new HttpParams();

    if (from) {
      params = params.set('from', from);
    }

    if (to) {
      params = params.set('to', to);
    }

    return this.http.get<FleetDashboard>(
      this.apiUrl,
      { params }
    );
  }
}