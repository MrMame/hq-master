import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterTrackerPage } from './character-tracker-page';

describe('CharacterTrackerExPage', () => {
  let component: CharacterTrackerPage;
  let fixture: ComponentFixture<CharacterTrackerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterTrackerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterTrackerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
