import { DatePipe, DecimalPipe } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';

import { Maintenance } from '../../models/maintenance.model';

import { VehicleService } from '../../../Vehicles/services/vehicle.service';
import { Vehicle } from '../../../Vehicles/models/vehicle.model';
import { MaintenanceService } from '../../services/maintenance.service.ts';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './maintenance-list.html',
  styleUrl: './maintenance-list.scss'
})
export class MaintenanceList implements OnInit {

  private readonly router = inject(Router);

  private readonly maintenanceService =
    inject(MaintenanceService);

  private readonly vehicleService =
    inject(VehicleService);

  maintenances = signal<Maintenance[]>([]);
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

        this.maintenanceService
          .getMaintenances()
          .subscribe({
            next: (maintenances) => {

              console.log(
                'Maintenances loaded:',
                maintenances
              );

              this.maintenances.set(maintenances);
              this.loading.set(false);
            },

            error: (error) => {
              console.error(
                'Failed to load maintenances:',
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
      'Failed to load maintenance information. Please try again.'
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

  addMaintenance(): void {
    this.router.navigate([
      '/maintenance/new'
    ]);
  }

  editMaintenance(id: string): void {
    this.router.navigate([
      '/maintenance',
      id,
      'edit'
    ]);
  }

  deleteMaintenance(
    maintenance: Maintenance
  ): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this maintenance record?'
    );

    if (!confirmed) {
      return;
    }

    console.log(
      'Deleting maintenance:',
      maintenance.id
    );

    this.maintenanceService
      .deleteMaintenance(maintenance.id)
      .subscribe({
        next: () => {
          console.log(
            'Maintenance deleted successfully.'
          );

          this.loadData();
        },

        error: (error) => {
          console.error(
            'Failed to delete maintenance:',
            error
          );

          this.error.set(true);
          this.errorMessage.set(
            'Failed to delete maintenance. Please try again.'
          );
        }
      });
  }
}