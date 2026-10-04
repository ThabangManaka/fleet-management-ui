import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TripService } from '../../services/trip.service.ts';
import { VehicleService } from '../../../Vehicles/services/vehicle.service';
import { DriverService } from '../../../drivers/services/driver.service.ts.js';
import { Trip } from '../../models/trip.model.js';
import { Vehicle } from '../../../Vehicles/models/vehicle.model.js';
import { Driver } from '../../../drivers/models/driver.model.js';
import { CreateTripRequest } from '../../models/create-trip-request.model.js';
import { UpdateTripRequest } from '../../models/update-trip-request.model.js';


@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.scss'
})
export class TripForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly tripService = inject(TripService);
  private readonly vehicleService = inject(VehicleService);
  private readonly driverService = inject(DriverService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  tripId: string | null = null;
  isEditMode = false;

  loading = false;
  error = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    vehicleId: ['', Validators.required],
    driverId: ['', Validators.required],
    startLocation: ['', Validators.required],
    destination: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
    startMileage: [0, [
      Validators.required,
      Validators.min(0)
    ]],
    endMileage: [null as number | null, [
      Validators.min(0)
    ]],
    status: [1, Validators.required],
    notes: ['']
  });

  ngOnInit(): void {
    this.tripId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.tripId;

    this.loadVehiclesAndDrivers();
  }

  loadVehiclesAndDrivers(): void {
    this.loading = true;

    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;

        this.driverService.getDrivers().subscribe({
          next: (drivers) => {
            this.drivers = drivers;

            if (this.isEditMode && this.tripId) {
              this.loadTrip(this.tripId);
            } else {
              this.loading = false;
            }
          },
          error: (error) => {
            console.error(
              'Failed to load drivers:',
              error
            );

            this.showError(
              'Failed to load drivers. Please try again.'
            );
          }
        });
      },
      error: (error) => {
        console.error(
          'Failed to load vehicles:',
          error
        );

        this.showError(
          'Failed to load vehicles. Please try again.'
        );
      }
    });
  }

  loadTrip(id: string): void {
    this.tripService.getTrip(id).subscribe({
      next: (trip) => {
        this.form.patchValue({
          vehicleId: trip.vehicleId,
          driverId: trip.driverId,
          startLocation: trip.startLocation,
          destination: trip.destination,
          startDate: this.toDateTimeLocal(
            trip.startDate
          ),
          endDate: trip.endDate
            ? this.toDateTimeLocal(trip.endDate)
            : '',
          startMileage: trip.startMileage,
          endMileage: trip.endMileage,
          status: trip.status,
          notes: trip.notes ?? ''
        });

        this.loading = false;
      },
      error: (error) => {
        console.error(
          'Failed to load trip:',
          error
        );

        this.showError(
          'Failed to load trip. Please try again.'
        );
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = false;

    if (this.isEditMode && this.tripId) {
      this.updateTrip();
    } else {
      this.createTrip();
    }
  }

  private createTrip(): void {
    const value = this.form.getRawValue();

    const request: CreateTripRequest = {
      vehicleId: value.vehicleId,
      driverId: value.driverId,
      startLocation: value.startLocation,
      destination: value.destination,
      startDate: this.toISOString(value.startDate),
      startMileage: value.startMileage,
      notes: value.notes || null
    };

    this.tripService.createTrip(request).subscribe({
      next: () => {
        console.log('Trip created successfully.');
        this.router.navigate(['/trips']);
      },
      error: (error) => {
        console.error(
          'Failed to create trip:',
          error
        );

        this.showError(
          'Failed to create trip. Please try again.'
        );
      }
    });
  }

  private updateTrip(): void {
    if (!this.tripId) {
      return;
    }

    const value = this.form.getRawValue();

    const request: UpdateTripRequest = {
      startLocation: value.startLocation,
      destination: value.destination,
      startDate: this.toISOString(value.startDate),
      endDate: value.endDate
        ? this.toISOString(value.endDate)
        : null,
      startMileage: value.startMileage,
      endMileage: value.endMileage,
      status: value.status,
      notes: value.notes || null
    };

    this.tripService
      .updateTrip(this.tripId, request)
      .subscribe({
        next: () => {
          console.log(
            'Trip updated successfully.'
          );

          this.router.navigate(['/trips']);
        },
        error: (error) => {
          console.error(
            'Failed to update trip:',
            error
          );

          this.showError(
            'Failed to update trip. Please try again.'
          );
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/trips']);
  }

  private toISOString(value: string): string {
    return new Date(value).toISOString();
  }

  private toDateTimeLocal(
    value: string
  ): string {
    const date = new Date(value);

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');
    const day = String(
      date.getDate()
    ).padStart(2, '0');

    const hours = String(
      date.getHours()
    ).padStart(2, '0');
    const minutes = String(
      date.getMinutes()
    ).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private showError(message: string): void {
    this.loading = false;
    this.error = true;
    this.errorMessage = message;
  }
}