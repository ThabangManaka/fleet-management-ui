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

  loading = true;
  error = false;

  ngOnInit(): void {
    this.loadVehicles();
  }

  private loadVehicles(): void {

    this.loading = true;
    this.error = false;

    this.vehicleService.getVehicles().subscribe({

      next: (response) => {
        console.log('Vehicles:', response);

        this.vehicles = response;
        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load vehicles', error);

        this.error = true;
        this.loading = false;
      }

    });
  }
}