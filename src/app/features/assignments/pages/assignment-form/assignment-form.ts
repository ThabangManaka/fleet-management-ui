import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { VehicleService } from '../../../Vehicles/services/vehicle.service';


import { Vehicle } from '../../../Vehicles/models/vehicle.model';
import { Driver } from '../../../drivers/models/driver.model';

import { CreateVehicleAssignmentRequest } from '../../models/create-vehicle-assignment-request.model';
import { DriverService } from '../../../drivers/services/driver.service.ts';
import { VehicleAssignmentService } from '../../services/vehicle-assignment.service.ts';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './assignment-form.html',
  styleUrl: './assignment-form.scss'
})
export class AssignmentForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly vehicleService =
    inject(VehicleService);

  private readonly driverService =
    inject(DriverService);

  private readonly assignmentService =
    inject(VehicleAssignmentService);

  vehicles = signal<Vehicle[]>([]);
  drivers = signal<Driver[]>([]);

  loading = signal(false);
  saving = signal(false);

  error = signal(false);
  errorMessage = signal('');

  assignmentForm = this.fb.nonNullable.group({
    vehicleId: ['', Validators.required],
    driverId: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(false);
    this.errorMessage.set('');

    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles.set(vehicles);

        this.driverService.getDrivers().subscribe({
          next: (drivers) => {
            this.drivers.set(drivers);
            this.loading.set(false);
          },
          error: (error) => {
            console.error('Failed to load drivers:', error);
            this.handleLoadError();
          }
        });
      },
      error: (error) => {
        console.error('Failed to load vehicles:', error);
        this.handleLoadError();
      }
    });
  }

  private handleLoadError(): void {
    this.loading.set(false);
    this.error.set(true);
    this.errorMessage.set(
      'Failed to load vehicles and drivers. Please try again.'
    );
  }

  saveAssignment(): void {

    if (this.saving()) {
      return;
    }

    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(false);
    this.errorMessage.set('');

    const request: CreateVehicleAssignmentRequest = {
      vehicleId:
        this.assignmentForm.controls.vehicleId.value,

      driverId:
        this.assignmentForm.controls.driverId.value
    };

    console.log('Creating assignment:', request);

    this.assignmentService.createAssignment(request).subscribe({
      next: (response) => {

        console.log(
          'Assignment created successfully:',
          response
        );

        this.saving.set(false);

        this.router.navigate(['/assignments'], {
          state: {
            successMessage:
              'Vehicle assigned successfully.'
          }
        });
      },

      error: (error) => {

        console.error(
          'Failed to create assignment:',
          error
        );

        console.error(
          'Validation errors:',
          error?.error?.errors
        );

        this.saving.set(false);
        this.error.set(true);

        this.errorMessage.set(
          'Failed to assign vehicle. Please check the information and try again.'
        );
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/assignments']);
  }
}