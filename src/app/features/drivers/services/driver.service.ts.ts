import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver.model';
import { CreateDriverRequest } from '../models/CreateDriverRequest.model';
import { UpdateDriverRequest } from '../models/update-driver-request.model';



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

  createDriver(
  request: CreateDriverRequest
): Observable<Driver> {

  return this.http.post<Driver>(
    this.apiUrl,
    {
      request
    }
  );
}
updateDriver(
  id: string,
  request: UpdateDriverRequest
): Observable<Driver> {
  return this.http.put<Driver>(
    `${this.apiUrl}/${id}`,
    {
      id,
      request
    }
  );
}


}