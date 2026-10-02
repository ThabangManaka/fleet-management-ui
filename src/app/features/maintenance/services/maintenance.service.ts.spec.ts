import { TestBed } from '@angular/core/testing';

import { MaintenanceServiceTs } from './maintenance.service.ts';

describe('MaintenanceServiceTs', () => {
  let service: MaintenanceServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
