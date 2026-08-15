import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterTrackerExPage } from './monster-tracker-ex-page';

describe('MonsterTrackerExPage', () => {
  let component: MonsterTrackerExPage;
  let fixture: ComponentFixture<MonsterTrackerExPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonsterTrackerExPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MonsterTrackerExPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
