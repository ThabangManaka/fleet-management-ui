import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../../Vehicles/models/driver.model';



@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:5299/api/Drivers';

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  getDriver(id: string): Observable<Driver> {
    return this.http.get<Driver>(
      `${this.apiUrl}/${id}`
    );
  }

  deleteDriver(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}