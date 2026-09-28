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

  private readonly dashboardService = inject(DashboardService);

  dashboard = signal<FleetDashboard | null>(null);

  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {

    console.log('Loading dashboard...');

    this.loading.set(true);
    this.error.set(false);

    this.dashboardService.getDashboard().subscribe({

      next: (response) => {

        console.log('Dashboard API response:', response);

        this.dashboard.set(response);
        this.loading.set(false);

      },

      error: (error) => {

        console.error('Dashboard API error:', error);

        this.loading.set(false);
        this.error.set(true);

      }

    });
  }
}