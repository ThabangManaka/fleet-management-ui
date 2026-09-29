import {
  Component,
  OnInit,
  inject,
  signal
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

  vehicle = signal<Vehicle | null>(null);
  performance = signal<VehiclePerformance | null>(null);

  loading = signal(false);
  error = signal(false);

  ngOnInit(): void {

    console.log('VehicleDetails initialized');

    const id = this.route.snapshot.paramMap.get('id');

    console.log('Vehicle ID from route:', id);

    if (!id) {
      this.error.set(true);
      return;
    }

    this.loadVehicle(id);
  }

  private loadVehicle(id: string): void {

    console.log('Loading vehicle:', id);

    this.loading.set(true);
    this.error.set(false);

    this.vehicleService.getVehicle(id).subscribe({

      next: (vehicle) => {

        console.log('Vehicle API response:', vehicle);

        this.vehicle.set(vehicle);

        this.loadPerformance(id);
      },

      error: (error) => {

        console.error('Vehicle API error:', error);

        this.loading.set(false);
        this.error.set(true);
      }

    });
  }

  private loadPerformance(id: string): void {

    console.log('Loading vehicle performance:', id);

    this.vehicleService.getVehiclePerformance(id).subscribe({

      next: (performance) => {

        console.log('Performance API response:', performance);

        this.performance.set(performance);
        this.loading.set(false);

      },

      error: (error) => {

        console.error('Performance API error:', error);

        this.loading.set(false);
      }

    });
  }

  goBack(): void {
    this.router.navigate(['/vehicles']);
  }

 getFuelTypeLabel(fuelType: number): string {
  switch (fuelType) {
    case 0: return 'Petrol';
    case 1: return 'Diesel';
    case 2: return 'Electric';
    case 3: return 'Hybrid';
    default: return 'Unknown';
  }
}

getStatusLabel(status: number): string {
  switch (status) {
    case 0: return 'Available';
    case 1: return 'Assigned';
    case 2: return 'Maintenance';
    default: return 'Unknown';
  }
}
}