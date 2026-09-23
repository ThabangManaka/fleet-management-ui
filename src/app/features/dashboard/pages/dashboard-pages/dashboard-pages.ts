import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard';
import { FleetDashboard } from '../../models/fleet-dashboard.model';

@Component({
  selector: 'app-dashboard-pages',
  imports: [],
  templateUrl: './dashboard-pages.html',
  styleUrl: './dashboard-pages.scss',
})
export class DashboardPages implements OnInit {

  private readonly dashboardService = inject(DashboardService);

  dashboard: FleetDashboard | null = null;

  loading = true;
  error = false;

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {

    this.loading = true;
    this.error = false;

    this.dashboardService.getDashboard().subscribe({
      next: (response) => {
        this.dashboard = response;
        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load dashboard', error);

        this.error = true;
        this.loading = false;
      }
    });
  }
}