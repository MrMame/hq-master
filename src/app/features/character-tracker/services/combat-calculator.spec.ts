import { TestBed } from '@angular/core/testing';

import { CombatCalculator } from './combat-calculator';

describe('CombatCalculator', () => {
  let service: CombatCalculator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CombatCalculator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
