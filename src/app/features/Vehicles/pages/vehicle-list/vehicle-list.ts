import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
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

      this.cdr.detectChanges();

      console.log('Vehicles loaded:', this.vehicles.length);
      console.log('Loading:', this.loading);
    },

    error: (error) => {

      console.error('Vehicle API error:', error);

      this.loading = false;
      this.error = true;

      this.cdr.detectChanges();
    },

    complete: () => {
      console.log('Vehicle request completed');
    }
  });
}

    viewVehicle(id: string): void {
    this.router.navigate(['/vehicles', id]);
    }
}