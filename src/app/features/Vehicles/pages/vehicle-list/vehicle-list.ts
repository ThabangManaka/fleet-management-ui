import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss'
})
export class VehicleList implements OnInit {

  private readonly vehicleService = inject(VehicleService);
  private readonly router = inject(Router);

  vehicles = signal<Vehicle[]>([]);
  loading = signal(false);
  error = signal(false);

  ngOnInit(): void {
    this.loadVehicles();
  }

  private loadVehicles(): void {

    console.log('Starting vehicle request...');

    this.loading.set(true);
    this.error.set(false);

    this.vehicleService.getVehicles().subscribe({

      next: (response) => {

        console.log('Vehicles API response:', response);

        this.vehicles.set(response);
        this.loading.set(false);

        console.log('Vehicles loaded:', response.length);
      },

      error: (error) => {

        console.error('Vehicle API error:', error);

        this.loading.set(false);
        this.error.set(true);
      },

      complete: () => {
        console.log('Vehicle request completed');
      }

    });
  }

  viewVehicle(id: string): void {
    this.router.navigate(['/vehicles', id]);
  }

  addVehicle(): void {
  this.router.navigate(['/vehicles/new']);
  }
}