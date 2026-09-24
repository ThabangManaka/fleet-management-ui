import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

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

  vehicles: Vehicle[] = [];

  loading = false;
  error = false;

  ngOnInit(): void {
    this.loadVehicles();
  }

  private loadVehicles(): void {

    console.log('Starting vehicle request...');

    this.loading = true;
    this.error = false;

    this.vehicleService.getVehicles().subscribe({
      next: (response) => {

        console.log('Vehicles API response:', response);

        this.vehicles = response;

        this.loading = false;

        console.log('Loading:', this.loading);
      },

      error: (error) => {

        console.error('Vehicle API error:', error);

        this.loading = false;
        this.error = true;

        console.log('Loading:', this.loading);
      },

      complete: () => {
        console.log('Vehicle request completed');
      }
    });
  }
}