import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTransactionForm } from './fuel-transaction-form';

describe('FuelTransactionForm', () => {
  let component: FuelTransactionForm;
  let fixture: ComponentFixture<FuelTransactionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelTransactionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FuelTransactionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
