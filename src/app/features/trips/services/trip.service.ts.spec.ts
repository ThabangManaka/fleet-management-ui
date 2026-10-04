import { TestBed } from '@angular/core/testing';

import { TripServiceTs } from './trip.service.ts';

describe('TripServiceTs', () => {
  let service: TripServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
