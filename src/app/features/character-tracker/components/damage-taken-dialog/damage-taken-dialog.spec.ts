import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { DamageTakenDialog } from './damage-taken-dialog';

describe('DamageTakenDialog', () => {
  let component: DamageTakenDialog;
  let fixture: ComponentFixture<DamageTakenDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamageTakenDialog],
      providers: [{ provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }],
    }).compileComponents();

    fixture = TestBed.createComponent(DamageTakenDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
