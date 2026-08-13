import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterTrackerPage } from './monster-tracker-page';

describe('MonsterTrackerPage', () => {
  let component: MonsterTrackerPage;
  let fixture: ComponentFixture<MonsterTrackerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonsterTrackerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MonsterTrackerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
