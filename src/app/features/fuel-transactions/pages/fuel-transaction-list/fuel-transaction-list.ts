import { DatePipe, DecimalPipe } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';

import { FuelTransactionService } from '../../services/fuel-transaction.service';
import { FuelTransaction } from '../../models/fuel-transaction.model';

import { VehicleService } from '../../../Vehicles/services/vehicle.service';
import { Vehicle } from '../../../Vehicles/models/vehicle.model';

@Component({
  selector: 'app-fuel-transaction-list',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './fuel-transaction-list.html',
  styleUrl: './fuel-transaction-list.scss'
})
export class FuelTransactionList implements OnInit {

  private readonly router = inject(Router);

  private readonly fuelTransactionService =
    inject(FuelTransactionService);

  private readonly vehicleService =
    inject(VehicleService);

  fuelTransactions = signal<FuelTransaction[]>([]);
  vehicles = signal<Vehicle[]>([]);

  loading = signal(false);
  error = signal(false);
  errorMessage = signal('');

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

        this.fuelTransactionService
          .getFuelTransactions()
          .subscribe({
            next: (transactions) => {

              console.log(
                'Fuel transactions loaded:',
                transactions
              );

              this.fuelTransactions.set(transactions);
              this.loading.set(false);
            },

            error: (error) => {
              console.error(
                'Failed to load fuel transactions:',
                error
              );

              this.handleLoadError();
            }
          });
      },

      error: (error) => {
        console.error(
          'Failed to load vehicles:',
          error
        );

        this.handleLoadError();
      }
    });
  }

  private handleLoadError(): void {
    this.loading.set(false);
    this.error.set(true);

    this.errorMessage.set(
      'Failed to load fuel transaction information. Please try again.'
    );
  }

  getVehicleName(vehicleId: string): string {

    const vehicle = this.vehicles().find(
      v => v.id === vehicleId
    );

    if (!vehicle) {
      return 'Unknown Vehicle';
    }

    return `${vehicle.registrationNumber} — ${vehicle.make} ${vehicle.model}`;
  }

  addFuelTransaction(): void {
    this.router.navigate([
      '/fuel-transactions/new'
    ]);
  }

  editFuelTransaction(id: string): void {
    this.router.navigate([
      '/fuel-transactions',
      id,
      'edit'
    ]);
  }

  deleteFuelTransaction(
    transaction: FuelTransaction
  ): void {

    const confirmed = window.confirm(
      'Are you sure you want to delete this fuel transaction?'
    );

    if (!confirmed) {
      return;
    }

    this.fuelTransactionService
      .deleteFuelTransaction(transaction.id)
      .subscribe({

        next: () => {

          console.log(
            'Fuel transaction deleted successfully.'
          );

          this.loadData();
        },

        error: (error) => {

          console.error(
            'Failed to delete fuel transaction:',
            error
          );

          this.error.set(true);

          this.errorMessage.set(
            'Failed to delete fuel transaction. Please try again.'
          );
        }

      });
  }
}