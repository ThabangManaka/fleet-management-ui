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

import { ActivatedRoute, Router } from '@angular/router';

import { FuelTransactionService } from '../../services/fuel-transaction.service';

import { CreateFuelTransactionRequest } from '../../models/create-fuel-transaction-request.model';
import { UpdateFuelTransactionRequest } from '../../models/update-fuel-transaction-request.model';

import { VehicleService } from '../../../Vehicles/services/vehicle.service';
import { Vehicle } from '../../../Vehicles/models/vehicle.model';

@Component({
  selector: 'app-fuel-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './fuel-transaction-form.html',
  styleUrl: './fuel-transaction-form.scss'
})
export class FuelTransactionForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly fuelTransactionService =
    inject(FuelTransactionService);

  private readonly vehicleService =
    inject(VehicleService);

  vehicles = signal<Vehicle[]>([]);

  loading = signal(false);
  saving = signal(false);

  error = signal(false);
  errorMessage = signal('');

  fuelTransactionId = signal<string | null>(null);
  isEditMode = signal(false);

  fuelForm = this.fb.nonNullable.group({
    vehicleId: ['', Validators.required],

    transactionDate: [
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

    litres: [
      0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    pricePerLitre: [
      0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    fuelType: [
      '',
      Validators.required
    ],

    fuelStation: [
      '',
      Validators.maxLength(100)
    ],

    receiptNumber: [
      '',
      Validators.maxLength(50)
    ],

    notes: [
      '',
      Validators.maxLength(500)
    ]
  });

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.fuelTransactionId.set(id);
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

        if (this.isEditMode() && this.fuelTransactionId()) {
          this.loadFuelTransaction(
            this.fuelTransactionId()!
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

  loadFuelTransaction(id: string): void {

    this.loading.set(true);

    this.fuelTransactionService
      .getFuelTransaction(id)
      .subscribe({

        next: (transaction) => {

          console.log(
            'Fuel transaction loaded:',
            transaction
          );

          this.fuelForm.patchValue({
            vehicleId: transaction.vehicleId,

            transactionDate:
              this.toDateTimeLocal(
                transaction.transactionDate
              ),

            mileage: transaction.mileage,

            litres: transaction.litres,

            pricePerLitre:
              transaction.pricePerLitre,

            fuelType:
              transaction.fuelType,

            fuelStation:
              transaction.fuelStation ?? '',

            receiptNumber:
              transaction.receiptNumber ?? '',

            notes:
              transaction.notes ?? ''
          });

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load fuel transaction:',
            error
          );

          this.loading.set(false);
          this.error.set(true);

          this.errorMessage.set(
            'Failed to load fuel transaction. Please try again.'
          );
        }
      });
  }

  saveFuelTransaction(): void {

    if (this.saving()) {
      return;
    }

    if (this.fuelForm.invalid) {
      this.fuelForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(false);
    this.errorMessage.set('');

    const formValue = this.fuelForm.getRawValue();

    if (this.isEditMode() && this.fuelTransactionId()) {

      const id = this.fuelTransactionId()!;

      const request: UpdateFuelTransactionRequest = {
        transactionDate:
          new Date(
            formValue.transactionDate
          ).toISOString(),

        mileage:
          formValue.mileage,

        litres:
          formValue.litres,

        pricePerLitre:
          formValue.pricePerLitre,

        fuelType:
          formValue.fuelType.trim(),

        fuelStation:
          formValue.fuelStation.trim() || null,

        receiptNumber:
          formValue.receiptNumber.trim() || null,

        notes:
          formValue.notes.trim() || null
      };

      console.log(
        'Updating fuel transaction:',
        {
          id,
          request
        }
      );

      this.fuelTransactionService
        .updateFuelTransaction(id, request)
        .subscribe({

          next: () => {

            console.log(
              'Fuel transaction updated successfully.'
            );

            this.saving.set(false);

            this.router.navigate([
              '/fuel-transactions'
            ]);
          },

          error: (error) => {

            console.error(
              'Failed to update fuel transaction:',
              error
            );

            console.error(
              'Validation errors:',
              error?.error?.errors
            );

            this.saving.set(false);
            this.error.set(true);

            this.errorMessage.set(
              'Failed to update fuel transaction. Please check the information and try again.'
            );
          }
        });

      return;
    }

    const request: CreateFuelTransactionRequest = {

      vehicleId:
        formValue.vehicleId,

      transactionDate:
        new Date(
          formValue.transactionDate
        ).toISOString(),

      mileage:
        formValue.mileage,

      litres:
        formValue.litres,

      pricePerLitre:
        formValue.pricePerLitre,

      fuelType:
        formValue.fuelType.trim(),

      fuelStation:
        formValue.fuelStation.trim() || null,

      receiptNumber:
        formValue.receiptNumber.trim() || null,

      notes:
        formValue.notes.trim() || null
    };

    console.log(
      'Creating fuel transaction:',
      request
    );

    this.fuelTransactionService
      .createFuelTransaction(request)
      .subscribe({

        next: (id) => {

          console.log(
            'Fuel transaction created successfully:',
            id
          );

          this.saving.set(false);

          this.router.navigate([
            '/fuel-transactions'
          ]);
        },

        error: (error) => {

          console.error(
            'Failed to create fuel transaction:',
            error
          );

          console.error(
            'Validation errors:',
            error?.error?.errors
          );

          this.saving.set(false);
          this.error.set(true);

          this.errorMessage.set(
            'Failed to create fuel transaction. Please check the information and try again.'
          );
        }
      });
  }

  cancel(): void {
    this.router.navigate([
      '/fuel-transactions'
    ]);
  }

  private toDateTimeLocal(
    value: string
  ): string {

    const date = new Date(value);

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