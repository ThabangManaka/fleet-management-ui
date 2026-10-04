import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../../models/trip.model';
import { VehicleService } from '../../../Vehicles/services/vehicle.service';
import { TripService } from '../../services/trip.service.ts';
import { DriverService } from '../../../drivers/services/driver.service.ts';
import { Vehicle } from '../../../Vehicles/models/vehicle.model';
import { Driver } from '../../../drivers/models/driver.model';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.scss'
})
export class TripList implements OnInit {

  private readonly tripService = inject(TripService);
  private readonly vehicleService = inject(VehicleService);
  private readonly driverService = inject(DriverService);
  private readonly router = inject(Router);

  trips: Trip[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  loading = true;
  error = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = false;

    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;

        this.driverService.getDrivers().subscribe({
          next: (drivers) => {
            this.drivers = drivers;

            this.tripService.getTrips().subscribe({
              next: (trips) => {
                this.trips = trips;
                this.loading = false;
              },
              error: (error) => {
                console.error('Failed to load trips:', error);
                this.showError(
                  'Failed to load trips. Please try again.'
                );
              }
            });
          },
          error: (error) => {
            console.error('Failed to load drivers:', error);
            this.showError(
              'Failed to load drivers. Please try again.'
            );
          }
        });
      },
      error: (error) => {
        console.error('Failed to load vehicles:', error);
        this.showError(
          'Failed to load vehicles. Please try again.'
        );
      }
    });
  }

  getVehicleName(vehicleId: string): string {
    const vehicle = this.vehicles.find(
      v => v.id === vehicleId
    );

    if (!vehicle) {
      return 'Unknown Vehicle';
    }

    return `${vehicle.registrationNumber} - ${vehicle.make} ${vehicle.model}`;
  }

  getDriverName(driverId: string): string {
    const driver = this.drivers.find(
      d => d.id === driverId
    );

    if (!driver) {
      return 'Unknown Driver';
    }

    return `${driver.firstName} ${driver.lastName}`;
  }

  getStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Scheduled';

      case 2:
        return 'In Progress';

      case 3:
        return 'Completed';

      case 4:
        return 'Cancelled';

      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1:
        return 'scheduled';

      case 2:
        return 'in-progress';

      case 3:
        return 'completed';

      case 4:
        return 'cancelled';

      default:
        return '';
    }
  }

  addTrip(): void {
    this.router.navigate(['/trips/new']);
  }

  editTrip(trip: Trip): void {
    this.router.navigate([
      '/trips',
      trip.id,
      'edit'
    ]);
  }

  deleteTrip(trip: Trip): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this trip?'
    );

    if (!confirmed) {
      return;
    }

    this.tripService.deleteTrip(trip.id).subscribe({
      next: () => {
        console.log('Trip deleted successfully.');
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to delete trip:', error);

        this.error = true;
        this.errorMessage =
          'Failed to delete trip. Please try again.';
      }
    });
  }

  private showError(message: string): void {
    this.loading = false;
    this.error = true;
    this.errorMessage = message;
  }
}