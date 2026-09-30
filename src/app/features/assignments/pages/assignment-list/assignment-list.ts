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

  private readonly router = inject(Router);

  assignments = signal<VehicleAssignment[]>([]);

  loading = signal(false);

  error = signal(false);

  errorMessage = signal('');

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.loading.set(true);
    this.error.set(false);
    this.errorMessage.set('');

    this.assignmentService.getAssignments().subscribe({
      next: (assignments) => {

        console.log(
          'Assignments loaded:',
          assignments
        );

        this.assignments.set(assignments);

        this.loading.set(false);
      },

      error: (error) => {

        console.error(
          'Failed to load assignments:',
          error
        );

        this.loading.set(false);
        this.error.set(true);

        this.errorMessage.set(
          'Failed to load assignments. Please try again.'
        );
      }
    });
  }

  addAssignment(): void {
    this.router.navigate([
      '/assignments/new'
    ]);
  }

  getStatus(
    assignment: VehicleAssignment
  ): string {

    return assignment.unassignedAt
      ? 'Unassigned'
      : 'Active';
  }
}