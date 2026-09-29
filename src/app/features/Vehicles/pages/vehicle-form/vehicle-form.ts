import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { VehicleService } from '../../services/vehicle.service';
import { CreateVehicleRequest } from '../../models/CreateVehicleRequest .model';


@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss'
})
export class VehicleForm {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);

  saving = signal(false);
  error = signal(false);
  errorMessage = signal('');

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
      new Date().getFullYear(),
      [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear() + 1)
      ]
    ],

    fuelType: [
      0,
      Validators.required
    ]

  });

saveVehicle(): void {

  if (this.vehicleForm.invalid) {
    this.vehicleForm.markAllAsTouched();
    return;
  }

  this.saving.set(true);
  this.error.set(false);
  this.errorMessage.set('');

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

  console.log('Creating vehicle:', request);

  this.vehicleService.createVehicle(request).subscribe({

    next: (response) => {

      console.log('Vehicle created:', response);

      this.saving.set(false);

      this.router.navigate(['/vehicles']);
    },

    error: (error) => {

      console.error('Create vehicle error:', error);

      this.saving.set(false);
      this.error.set(true);

      const validationErrors = error.error?.errors;

      if (validationErrors) {

        const messages = Object.values(validationErrors)
          .flat()
          .join(' ');

        this.errorMessage.set(messages);

      } else {

        this.errorMessage.set(
          'Failed to create vehicle. Please try again.'
        );
      }
    }

  });
}

  cancel(): void {
    this.router.navigate(['/vehicles']);
  }
}