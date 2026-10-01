import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { Router } from '@angular/router';

import { VehicleAssignment } from '../../models/vehicle-assignment.model';
import { VehicleAssignmentService } from '../../services/vehicle-assignment.service.ts';
import { DatePipe } from '@angular/common';
import { VehicleService } from '../../../Vehicles/services/vehicle.service';
import { DriverService } from '../../../drivers/services/driver.service.ts';
import { Vehicle } from '../../../Vehicles/models/vehicle.model';
import { Driver } from '../../../drivers/models/driver.model';

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './assignment-list.html',
  styleUrl: './assignment-list.scss'
})
export class AssignmentList implements OnInit {

  private readonly assignmentService = inject(
    VehicleAssignmentService
  );
  private readonly vehicleService = inject(VehicleService);
  private readonly driverService = inject(DriverService);

  private readonly router = inject(Router);

  assignments = signal<VehicleAssignment[]>([]);
  vehicles = signal<Vehicle[]>([]);
  drivers = signal<Driver[]>([]);

  loading = signal(false);
  error = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
     this.loadData();
  }

loadData(): void {
  this.loading.set(true);
  this.error.set(false);
  this.errorMessage.set('');

  this.vehicleService.getVehicles().subscribe({
    next: (vehicles) => {
      this.vehicles.set(vehicles);

      this.driverService.getDrivers().subscribe({
        next: (drivers) => {
          this.drivers.set(drivers);

          this.assignmentService.getAssignments().subscribe({
            next: (assignments) => {
              console.log('Assignments loaded:', assignments);

              this.assignments.set(assignments);
              this.loading.set(false);
            },

            error: (error) => {
              console.error(
                'Failed to load assignments:',
                error
              );

              this.handleLoadError();
            }
          });
        },

        error: (error) => {
          console.error(
            'Failed to load drivers:',
            error
          );

          this.handleLoadError();
        }
      });
    },

    error: (error) => {
      console.error(
        'Failed to load vehicles:',
        error
      );

      this.handleLoadError();
    }
  });
}
private handleLoadError(): void {
  this.loading.set(false);
  this.error.set(true);

  this.errorMessage.set(
    'Failed to load assignment information. Please try again.'
  );
}
getVehicleName(vehicleId: string): string {
  const vehicle = this.vehicles().find(
    v => v.id === vehicleId
  );

  if (!vehicle) {
    return 'Unknown Vehicle';
  }

  return `${vehicle.registrationNumber} — ${vehicle.make} ${vehicle.model}`;
}
getDriverName(driverId: string): string {
  const driver = this.drivers().find(
    d => d.id === driverId
  );

  if (!driver) {
    return 'Unknown Driver';
  }

  return `${driver.firstName} ${driver.lastName}`;
}

  addAssignment(): void {
    this.router.navigate([
      '/assignments/new'
    ]);
  }

getStatus(assignment: VehicleAssignment): string {
  return assignment.unassignedAt
    ? 'Inactive'
    : 'Active';
}
 unassignAssignment(assignment: VehicleAssignment): void {

  if (assignment.unassignedAt) {
    return;
  }

  const confirmed = window.confirm(
    'Are you sure you want to unassign this vehicle?'
  );

  if (!confirmed) {
    return;
  }

  console.log(
    'Unassigning assignment:',
    assignment.id
  );

  this.assignmentService
    .unassignDriver(assignment.id)
    .subscribe({

      next: () => {

        console.log(
          'Vehicle unassigned successfully.'
        );

        this.loadData();
      },

      error: (error) => {

        console.error(
          'Failed to unassign vehicle:',
          error
        );

        this.error.set(true);

        this.errorMessage.set(
          'Failed to unassign vehicle. Please try again.'
        );
      }

    });
}
  
}