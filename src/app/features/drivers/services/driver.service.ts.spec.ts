import { TestBed } from '@angular/core/testing';

import { DriverServiceTs } from './driver.service.ts';

describe('DriverServiceTs', () => {
  let service: DriverServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
