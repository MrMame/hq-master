import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackerPage } from './time-tracker-page';

describe('TimeTrackerPage', () => {
  let component: TimeTrackerPage;
  let fixture: ComponentFixture<TimeTrackerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeTrackerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeTrackerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
