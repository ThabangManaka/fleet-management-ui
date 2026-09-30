import { TestBed } from '@angular/core/testing';

import { VehicleAssignmentServiceTs } from './vehicle-assignment.service.ts';

describe('VehicleAssignmentServiceTs', () => {
  let service: VehicleAssignmentServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleAssignmentServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
