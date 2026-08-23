import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageTakenDialog } from './damage-taken-dialog';

describe('DamageTakenDialog', () => {
  let component: DamageTakenDialog;
  let fixture: ComponentFixture<DamageTakenDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamageTakenDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DamageTakenDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
