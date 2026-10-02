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

import {
  ActivatedRoute,
  Router
} from '@angular/router';


import { CreateMaintenanceRequest } from '../../models/create-maintenance-request.model';
import { UpdateMaintenanceRequest } from '../../models/update-maintenance-request.model';

import { VehicleService } from '../../../Vehicles/services/vehicle.service';
import { Vehicle } from '../../../Vehicles/models/vehicle.model';
import { MaintenanceService } from '../../services/maintenance.service.ts';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './maintenance-form.html',
  styleUrl: './maintenance-form.scss'
})
export class MaintenanceForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly maintenanceService =
    inject(MaintenanceService);

  private readonly vehicleService =
    inject(VehicleService);

  vehicles = signal<Vehicle[]>([]);

  loading = signal(false);
  saving = signal(false);

  error = signal(false);
  errorMessage = signal('');

  maintenanceId = signal<string | null>(null);
  isEditMode = signal(false);

  maintenanceForm = this.fb.nonNullable.group({

    vehicleId: [
      '',
      Validators.required
    ],

    maintenanceType: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    description: [
      '',
      [
        Validators.required,
        Validators.maxLength(250)
      ]
    ],

    serviceDate: [
      '',
      Validators.required
    ],

    mileage: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    cost: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    notes: [
      '',
      Validators.maxLength(500)
    ],

    status: [
      1,
      Validators.required
    ]
  });

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {
      this.maintenanceId.set(id);
      this.isEditMode.set(true);
    }

    this.loadVehicles();
  }

  loadVehicles(): void {

    this.loading.set(true);
    this.error.set(false);
    this.errorMessage.set('');

    this.vehicleService.getVehicles().subscribe({

      next: (vehicles) => {

        this.vehicles.set(vehicles);

        if (
          this.isEditMode() &&
          this.maintenanceId()
        ) {

          this.loadMaintenance(
            this.maintenanceId()!
          );

        } else {

          this.loading.set(false);

        }
      },

      error: (error) => {

        console.error(
          'Failed to load vehicles:',
          error
        );

        this.loading.set(false);
        this.error.set(true);

        this.errorMessage.set(
          'Failed to load vehicles. Please try again.'
        );
      }
    });
  }

  loadMaintenance(id: string): void {

    this.loading.set(true);

    this.maintenanceService
      .getMaintenance(id)
      .subscribe({

        next: (maintenance) => {

          console.log(
            'Maintenance loaded:',
            maintenance
          );

          this.maintenanceForm.patchValue({

            vehicleId:
              maintenance.vehicleId,

            maintenanceType:
              maintenance.maintenanceType,

            description:
              maintenance.description,

            serviceDate:
              this.toDateTimeLocal(
                maintenance.serviceDate
              ),

            mileage:
              maintenance.mileage,

            cost:
              maintenance.cost,

            notes:
              maintenance.notes ?? '',

            status:
              maintenance.status

          });

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load maintenance:',
            error
          );

          this.loading.set(false);
          this.error.set(true);

          this.errorMessage.set(
            'Failed to load maintenance. Please try again.'
          );
        }
      });
  }

  saveMaintenance(): void {

    if (this.saving()) {
      return;
    }

    if (this.maintenanceForm.invalid) {

      this.maintenanceForm.markAllAsTouched();

      return;
    }

    this.saving.set(true);
    this.error.set(false);
    this.errorMessage.set('');

    const formValue =
      this.maintenanceForm.getRawValue();

    /*
     * UPDATE
     */
    if (
      this.isEditMode() &&
      this.maintenanceId()
    ) {

      const id =
        this.maintenanceId()!;

      const request:
        UpdateMaintenanceRequest = {

        maintenanceType:
          formValue.maintenanceType.trim(),

        description:
          formValue.description.trim(),

        serviceDate:
          new Date(
            formValue.serviceDate
          ).toISOString(),

        mileage:
          formValue.mileage,

        cost:
          formValue.cost,

        notes:
          formValue.notes.trim() || null,

        status:
          formValue.status
      };

      console.log(
        'Updating maintenance:',
        {
          id,
          request
        }
      );

      this.maintenanceService
        .updateMaintenance(
          id,
          request
        )
        .subscribe({

          next: () => {

            console.log(
              'Maintenance updated successfully.'
            );

            this.saving.set(false);

            this.router.navigate([
              '/maintenance'
            ]);
          },

          error: (error) => {

            console.error(
              'Failed to update maintenance:',
              error
            );

            console.error(
              'Validation errors:',
              error?.error?.errors
            );

            this.saving.set(false);
            this.error.set(true);

            this.errorMessage.set(
              'Failed to update maintenance. Please check the information and try again.'
            );
          }
        });

      return;
    }

    /*
     * CREATE
     */
    const request:
      CreateMaintenanceRequest = {

      vehicleId:
        formValue.vehicleId,

      maintenanceType:
        formValue.maintenanceType.trim(),

      description:
        formValue.description.trim(),

      serviceDate:
        new Date(
          formValue.serviceDate
        ).toISOString(),

      mileage:
        formValue.mileage,

      cost:
        formValue.cost,

      notes:
        formValue.notes.trim() || null
    };

    console.log(
      'Creating maintenance:',
      request
    );

    this.maintenanceService
      .createMaintenance(request)
      .subscribe({

        next: (id) => {

          console.log(
            'Maintenance created successfully:',
            id
          );

          this.saving.set(false);

          this.router.navigate([
            '/maintenance'
          ]);
        },

        error: (error) => {

          console.error(
            'Failed to create maintenance:',
            error
          );

          console.error(
            'Validation errors:',
            error?.error?.errors
          );

          this.saving.set(false);
          this.error.set(true);

          this.errorMessage.set(
            'Failed to create maintenance. Please check the information and try again.'
          );
        }
      });
  }

  cancel(): void {

    this.router.navigate([
      '/maintenance'
    ]);
  }

  private toDateTimeLocal(
    value: string
  ): string {

    const date =
      new Date(value);

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    const hours =
      String(
        date.getHours()
      ).padStart(2, '0');

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}