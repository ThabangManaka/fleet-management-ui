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
 
  successMessage = signal('');
  vehicles = signal<Vehicle[]>([]);
  loading = signal(false);
  error = signal(false);

ngOnInit(): void {

  const navigation = this.router.getCurrentNavigation();

  const message = navigation?.extras.state?.['successMessage'];

  if (message) {
    this.successMessage.set(message);
  }

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
  editVehicle(id: string): void {
  this.router.navigate(['/vehicles', id, 'edit']);
  }

  addVehicle(): void {
  this.router.navigate(['/vehicles/new']);
  }

  deleteVehicle(id: string): void {
  const confirmed = confirm(
    'Are you sure you want to delete this vehicle?'
  );

  if (!confirmed) {
    return;
  }

  this.vehicleService.deleteVehicle(id).subscribe({
    next: () => {
      this.loadVehicles();
    },

    error: (error) => {
      console.error(
        'Failed to delete vehicle:',
        error
      );
    }
  });
}
}