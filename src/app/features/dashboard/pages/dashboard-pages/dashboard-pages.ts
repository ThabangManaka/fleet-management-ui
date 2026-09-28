import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { DashboardService } from '../../services/dashboard';
import { FleetDashboard } from '../../models/fleet-dashboard.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-pages',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './dashboard-pages.html',
  styleUrl: './dashboard-pages.scss',
})
export class DashboardPages implements OnInit {

  private readonly dashboardService = inject(DashboardService);
  private readonly cdr = inject(ChangeDetectorRef);
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

    console.log('Dashboard API response:', response);

    this.dashboard = response;
    this.loading = false;

    this.cdr.detectChanges();

  },

  error: (error) => {

    console.error('Dashboard API error:', error);

    this.loading = false;
    this.error = true;

    this.cdr.detectChanges();

  }
});
  }
}