import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { VehicleService } from '../../services/vehicle.service';

import { UpdateVehicleRequest } from '../../models/update-vehicle-request.model';
import { CreateVehicleRequest } from '../../models/CreateVehicleRequest .model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss'
})
export class VehicleForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly vehicleService = inject(VehicleService);

  saving = signal(false);
  loading = signal(false);
  error = signal(false);

  errorMessage = signal('');
  validationErrors = signal<Record<string, string[]>>({});

  vehicleId = signal<string | null>(null);
  isEditMode = signal(false);

  vehicleStatus = signal(0);
  vehicleMileage = signal(0);

  currentYear = new Date().getFullYear();

  vehicleForm = this.fb.nonNullable.group({
    registrationNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(20)
      ]
    ],

    vin: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

    make: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

    model: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

    year: [
      this.currentYear,
      [
        Validators.required,
        Validators.min(1900),
        Validators.max(this.currentYear + 1)
      ]
    ],

    fuelType: [
      0,
      Validators.required
    ]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.vehicleId.set(id);
      this.isEditMode.set(true);
      this.loadVehicle(id);
    }
  }

  private loadVehicle(id: string): void {
    this.loading.set(true);
    this.error.set(false);

    this.vehicleService.getVehicle(id).subscribe({
      next: (vehicle) => {

        console.log('Vehicle loaded for edit:', vehicle);

        this.vehicleForm.patchValue({
          registrationNumber: vehicle.registrationNumber,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          fuelType: this.getFuelTypeValue(vehicle.fuelType)
        });

        this.vehicleStatus.set(
          this.getStatusValue(vehicle.status)
        );

        this.vehicleMileage.set(
          vehicle.mileage
        );

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Failed to load vehicle:', error);

        this.loading.set(false);
        this.error.set(true);

        this.errorMessage.set(
          'Failed to load vehicle. Please try again.'
        );
      }
    });
  }

  saveVehicle(): void {

    if (this.saving()) {
      return;
    }

    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(false);
    this.errorMessage.set('');
    this.validationErrors.set({});

    const request: CreateVehicleRequest = {
      registrationNumber:
        this.vehicleForm.controls.registrationNumber.value.trim(),

      vin:
        this.vehicleForm.controls.vin.value.trim(),

      make:
        this.vehicleForm.controls.make.value.trim(),

      model:
        this.vehicleForm.controls.model.value.trim(),

      year:
        this.vehicleForm.controls.year.value,

      fuelType:
        this.vehicleForm.controls.fuelType.value
    };

    if (this.isEditMode()) {
      this.updateVehicle(request);
    } else {
      this.createVehicle(request);
    }
  }

  private createVehicle(
    request: CreateVehicleRequest
  ): void {

    this.vehicleService.createVehicle(request).subscribe({
      next: (response) => {

        console.log('Vehicle created:', response);

        this.saving.set(false);

        this.router.navigate(['/vehicles'], {
          state: {
            successMessage:
              `Vehicle ${response.make} ${response.model} created successfully.`
          }
        });
      },

      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private updateVehicle(
    request: CreateVehicleRequest
  ): void {

    const id = this.vehicleId();

    if (!id) {
      this.saving.set(false);
      this.error.set(true);

      this.errorMessage.set(
        'Vehicle ID is missing.'
      );

      return;
    }

    const updateRequest: UpdateVehicleRequest = {
      registrationNumber:
        request.registrationNumber,

      vin:
        request.vin,

      make:
        request.make,

      model:
        request.model,

      year:
        request.year,

      fuelType:
        request.fuelType,

      status:
        this.vehicleStatus(),

      mileage:
        this.vehicleMileage()
    };

    console.log('Updating vehicle:', {
      id,
      request: updateRequest
    });

    this.vehicleService.updateVehicle(
      id,
      updateRequest
    ).subscribe({
      next: (response) => {

        console.log('Vehicle updated:', response);

        this.saving.set(false);

        this.router.navigate(['/vehicles'], {
          state: {
            successMessage:
              `Vehicle ${response.make} ${response.model} updated successfully.`
          }
        });
      },

      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private getFuelTypeValue(
    fuelType: string
  ): number {

    switch (fuelType) {

      case 'Petrol':
        return 0;

      case 'Diesel':
        return 1;

      case 'Electric':
        return 2;

      case 'Hybrid':
        return 3;

      default:
        return 0;
    }
  }

  private getStatusValue(
    status: string
  ): number {

    switch (status) {

      case 'Available':
        return 0;

      case 'Assigned':
        return 1;

      case 'Maintenance':
        return 2;

      default:
        return 0;
    }
  }

  private handleError(error: any): void {

    console.error('Vehicle save error:', error);

    this.saving.set(false);
    this.error.set(true);

    const errors = error.error?.errors;

    if (errors) {

      this.validationErrors.set(errors);

      const messages = Object.values(errors)
        .flat()
        .join(' ');

      this.errorMessage.set(messages);

    } else {

      this.validationErrors.set({});

      this.errorMessage.set(
        'Failed to save vehicle. Please try again.'
      );
    }
  }

  hasValidationError(field: string): boolean {
    return !!this.validationErrors()[field]?.length;
  }

  getValidationError(field: string): string {
    return this.validationErrors()[field]?.[0] ?? '';
  }

  clearFieldError(field: string): void {

    const errors = {
      ...this.validationErrors()
    };

    delete errors[field];

    this.validationErrors.set(errors);

    if (Object.keys(errors).length === 0) {
      this.error.set(false);
      this.errorMessage.set('');
    }
  }

  cancel(): void {
    this.router.navigate(['/vehicles']);
  }
}