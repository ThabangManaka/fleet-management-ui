import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { VehiclePerformance } from '../../models/vehicle-performance.model';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './vehicle-details.html',
  styleUrl: './vehicle-details.scss'
})
export class VehicleDetails implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);

  vehicle: Vehicle | null = null;
  performance: VehiclePerformance | null = null;

  loading = false;
  error = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = true;
      return;
    }

    this.loadVehicle(id);
  }

  private loadVehicle(id: string): void {
    this.loading = true;
    this.error = false;

    this.vehicleService.getVehicle(id).subscribe({
      next: (vehicle) => {
        this.vehicle = vehicle;
        this.loadPerformance(id);
      },

      error: (error) => {
        console.error('Vehicle details error:', error);

        this.loading = false;
        this.error = true;
      }
    });
  }

  private loadPerformance(id: string): void {
    this.vehicleService.getVehiclePerformance(id).subscribe({
      next: (performance) => {
        this.performance = performance;
        this.loading = false;
      },

      error: (error) => {
        console.error('Vehicle performance error:', error);

        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/vehicles']);
  }

  getFuelTypeLabel(fuelType: number): string {
    switch (fuelType) {
      case 0:
        return 'Petrol';

      case 1:
        return 'Diesel';

      case 2:
        return 'Electric';

      case 3:
        return 'Hybrid';

      default:
        return 'Unknown';
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Available';

      case 1:
        return 'Assigned';

      case 2:
        return 'Maintenance';

      default:
        return 'Unknown';
    }
  }
}