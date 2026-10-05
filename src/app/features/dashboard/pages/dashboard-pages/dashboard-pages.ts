import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { DashboardService } from '../../services/dashboard';
import { FleetDashboard } from '../../models/fleet-dashboard.model';

@Component({
  selector: 'app-dashboard-pages',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './dashboard-pages.html',
  styleUrl: './dashboard-pages.scss',
})
export class DashboardPages implements OnInit {

  private readonly dashboardService =
    inject(DashboardService);

  dashboard = signal<FleetDashboard | null>(null);

  loading = signal(true);
  error = signal(false);

  fromDate = signal('');
  toDate = signal('');

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    console.log('Loading dashboard...');

    this.loading.set(true);
    this.error.set(false);

    this.dashboardService
      .getDashboard(
        this.fromDate() || null,
        this.toDate() || null
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Dashboard API response:',
            response
          );

          this.dashboard.set(response);
          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Dashboard API error:',
            error
          );

          this.loading.set(false);
          this.error.set(true);

        }

      });
  }

  applyDateFilter(): void {

    if (
      this.fromDate() &&
      this.toDate() &&
      this.fromDate() > this.toDate()
    ) {
      this.error.set(true);
      return;
    }

    this.loadDashboard();
  }

  clearDateFilter(): void {

    this.fromDate.set('');
    this.toDate.set('');

    this.loadDashboard();
  }

  setFromDate(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.fromDate.set(input.value);
  }

  setToDate(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.toDate.set(input.value);
  }
}