import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

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
  private readonly cdr = inject(ChangeDetectorRef);

  vehicle: Vehicle | null = null;
  performance: VehiclePerformance | null = null;

  loading = false;
  error = false;

  ngOnInit(): void {

    console.log('VehicleDetails initialized');

    const id = this.route.snapshot.paramMap.get('id');

    console.log('Vehicle ID from route:', id);

    if (!id) {
      this.error = true;
      this.cdr.detectChanges();
      return;
    }

    this.loadVehicle(id);
  }

  private loadVehicle(id: string): void {

    console.log('Loading vehicle:', id);

    this.loading = true;
    this.error = false;

    this.vehicleService.getVehicle(id).subscribe({

      next: (vehicle) => {

        console.log('Vehicle API response:', vehicle);

        this.vehicle = vehicle;

        console.log('Vehicle loaded successfully');

        this.cdr.detectChanges();

        this.loadPerformance(id);
      },

      error: (error) => {

        console.error('Vehicle API error:', error);

        this.loading = false;
        this.error = true;

        this.cdr.detectChanges();
      }
    });
  }

  private loadPerformance(id: string): void {

    console.log('Loading vehicle performance:', id);

    this.vehicleService.getVehiclePerformance(id).subscribe({

      next: (performance) => {

        console.log('Performance API response:', performance);

        this.performance = performance;
        this.loading = false;

        console.log('Performance loaded');
        console.log('Loading:', this.loading);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Performance API error:', error);

        this.loading = false;

        this.cdr.detectChanges();
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