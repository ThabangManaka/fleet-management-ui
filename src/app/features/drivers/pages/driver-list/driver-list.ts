import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { Router } from '@angular/router';
import { DriverService } from '../../services/driver.service.ts';
import { Driver } from '../../models/driver.model.js';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  templateUrl: './driver-list.html',
  styleUrl: './driver-list.scss'
})
export class DriverList implements OnInit {

  private readonly driverService = inject(DriverService);
  private readonly router = inject(Router);

  drivers = signal<Driver[]>([]);
  loading = signal(false);
  error = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {

    this.loading.set(true);
    this.error.set(false);
    this.errorMessage.set('');

    this.driverService.getDrivers().subscribe({

      next: (drivers) => {

        console.log('Drivers loaded:', drivers);

        this.drivers.set(drivers);
        this.loading.set(false);
      },

      error: (error) => {

        console.error(
          'Failed to load drivers:',
          error
        );

        this.loading.set(false);
        this.error.set(true);

        this.errorMessage.set(
          'Failed to load drivers. Please try again.'
        );
      }
    });
  }

  addDriver(): void {
    this.router.navigate(['/drivers/new']);
  }

  viewDriver(id: string): void {
    this.router.navigate(['/drivers', id]);
  }

  editDriver(id: string): void {
    this.router.navigate([
      '/drivers',
      id,
      'edit'
    ]);
  }

  deleteDriver(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to delete this driver?'
    );

    if (!confirmed) {
      return;
    }

    this.driverService.deleteDriver(id).subscribe({

      next: () => {
        this.loadDrivers();
      },

      error: (error) => {

        console.error(
          'Failed to delete driver:',
          error
        );

        this.error.set(true);

        this.errorMessage.set(
          'Failed to delete driver. Please try again.'
        );
      }
    });
  }
}