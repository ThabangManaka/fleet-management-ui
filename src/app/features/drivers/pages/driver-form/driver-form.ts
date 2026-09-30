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
import { DriverService } from '../../services/driver.service.ts';
import { CreateDriverRequest } from '../../models/CreateDriverRequest.model.js';
import { UpdateDriverRequest } from '../../models/update-driver-request.model.js';



@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './driver-form.html',
  styleUrl: './driver-form.scss'
})
export class DriverForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly driverService = inject(DriverService);

  saving = signal(false);
  loading = signal(false);
  error = signal(false);

  errorMessage = signal('');

  driverId = signal<string | null>(null);
  isEditMode = signal(false);

  driverForm = this.fb.nonNullable.group({

    firstName: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

    lastName: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

    employeeNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(30)
      ]
    ],

    licenseNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

      licenseExpiryDate: [
      '',
        Validators.required
      ],

    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(20)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]
    ],
      status: [1]
  });

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.driverId.set(id);
      this.isEditMode.set(true);

      this.loadDriver(id);
    }
  }

  private loadDriver(id: string): void {

    this.loading.set(true);
    this.error.set(false);

    this.driverService.getDriver(id).subscribe({

      next: (driver) => {

        console.log(
          'Driver loaded for edit:',
          driver
        );

        this.driverForm.patchValue({

          firstName:
            driver.firstName,

          lastName:
            driver.lastName,

          employeeNumber:
            driver.employeeNumber,

          licenseNumber:
            driver.licenseNumber,

          phoneNumber:
            driver.phoneNumber,

          email:
            driver.email
        });

        this.loading.set(false);
      },

      error: (error) => {

        console.error(
          'Failed to load driver:',
          error
        );

        this.loading.set(false);
        this.error.set(true);

        this.errorMessage.set(
          'Failed to load driver. Please try again.'
        );
      }
    });
  }

  cancel(): void {
  this.router.navigate(['/drivers']);
}

saveDriver(): void {
  if (this.saving()) {
    return;
  }

  if (this.driverForm.invalid) {
    this.driverForm.markAllAsTouched();
    return;
  }

  console.log('Edit mode:', this.isEditMode());
  console.log('Driver ID:', this.driverId());

  this.saving.set(true);
  this.error.set(false);
  this.errorMessage.set('');

  const request: UpdateDriverRequest = {
    employeeNumber:
      this.driverForm.controls.employeeNumber.value.trim(),

    firstName:
      this.driverForm.controls.firstName.value.trim(),

    lastName:
      this.driverForm.controls.lastName.value.trim(),

    email:
      this.driverForm.controls.email.value.trim(),

    phoneNumber:
      this.driverForm.controls.phoneNumber.value.trim(),

    licenseNumber:
      this.driverForm.controls.licenseNumber.value.trim(),

    licenseExpiryDate:
      this.driverForm.controls.licenseExpiryDate.value,

    status:
      this.driverForm.controls.status.value
  };

  // =========================
  // EDIT DRIVER
  // =========================
  if (this.isEditMode() && this.driverId()) {

    const id = this.driverId()!;

    console.log('Updating driver:', {
      id,
      request
    });

    this.driverService.updateDriver(id, request).subscribe({
      next: (response) => {
        console.log(
          'Driver updated successfully:',
          response
        );

        this.saving.set(false);

        this.router.navigate(['/drivers'], {
          state: {
            successMessage:
              `Driver ${response.firstName} ${response.lastName} updated successfully.`
          }
        });
      },

      error: (error) => {
        console.error(
          'Failed to update driver:',
          error
        );

        console.error(
          'Validation errors:',
          error?.error?.errors
        );

        this.saving.set(false);
        this.error.set(true);

        this.errorMessage.set(
          'Failed to update driver. Please check the information and try again.'
        );
      }
    });

    return;
  }

  // =========================
  // CREATE DRIVER
  // =========================

  const createRequest: CreateDriverRequest = {
    employeeNumber:
      request.employeeNumber,

    firstName:
      request.firstName,

    lastName:
      request.lastName,

    email:
      request.email,

    phoneNumber:
      request.phoneNumber,

    licenseNumber:
      request.licenseNumber,

    licenseExpiryDate:
      request.licenseExpiryDate
  };

  console.log(
    'Creating driver:',
    createRequest
  );

  this.driverService.createDriver(createRequest).subscribe({
    next: (response) => {
      console.log(
        'Driver created successfully:',
        response
      );

      this.saving.set(false);

      this.router.navigate(['/drivers'], {
        state: {
          successMessage:
            `Driver ${response.firstName} ${response.lastName} created successfully.`
        }
      });
    },

    error: (error) => {
      console.error(
        'Failed to create driver:',
        error
      );

      console.error(
        'Validation errors:',
        error?.error?.errors
      );

      this.saving.set(false);
      this.error.set(true);

      this.errorMessage.set(
        'Failed to create driver. Please check the information and try again.'
      );
    }
  });
}
}