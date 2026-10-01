import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTransactionList } from './fuel-transaction-list';

describe('FuelTransactionList', () => {
  let component: FuelTransactionList;
  let fixture: ComponentFixture<FuelTransactionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelTransactionList],
    }).compileComponents();

    fixture = TestBed.createComponent(FuelTransactionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
