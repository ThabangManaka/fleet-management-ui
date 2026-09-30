import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { Driver } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service.ts';

@Component({
  selector: 'app-driver-details',
  standalone: true,
  templateUrl: './driver-details.html',
  styleUrl: './driver-details.scss'
})
export class DriverDetails implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly driverService = inject(DriverService);

  driver = signal<Driver | null>(null);

  loading = signal(false);
  error = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    console.log('Driver details ID:', id);

    if (!id) {
      this.error.set(true);
      this.errorMessage.set('Driver ID was not provided.');
      return;
    }

    this.loadDriver(id);
  }

  private loadDriver(id: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.errorMessage.set('');

    this.driverService.getDriver(id).subscribe({
      next: (driver) => {
        console.log('Driver loaded:', driver);

        this.driver.set(driver);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Failed to load driver:', error);

        this.loading.set(false);
        this.error.set(true);
        this.errorMessage.set(
          'Failed to load driver. Please try again.'
        );
      }
    });
  }

  editDriver(): void {
    const id = this.driver()?.id;

    if (!id) {
      return;
    }

    this.router.navigate([
      '/drivers',
      id,
      'edit'
    ]);
  }

  backToDrivers(): void {
    this.router.navigate(['/drivers']);
  }
}