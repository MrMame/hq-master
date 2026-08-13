import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterTracker } from './monster-tracker';

describe('MonsterTracker', () => {
  let component: MonsterTracker;
  let fixture: ComponentFixture<MonsterTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonsterTracker],
    }).compileComponents();

    fixture = TestBed.createComponent(MonsterTracker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
