import { TestBed } from '@angular/core/testing';

import { FuelTransactionService } from './fuel-transaction.service';

describe('FuelTransactionService', () => {
  let service: FuelTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuelTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
