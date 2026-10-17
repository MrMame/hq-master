import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { DamageTakenDialog } from './damage-taken-dialog';

describe('DamageTakenDialog', () => {
  let component: DamageTakenDialog;
  let fixture: ComponentFixture<DamageTakenDialog>;
  const close: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    close.mockReset();
    await TestBed.configureTestingModule({
      imports: [DamageTakenDialog],
      providers: [{ provide: MatDialogRef, useValue: { close } }],
    }).compileComponents();

    fixture = TestBed.createComponent(DamageTakenDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close with the chosen damage', () => {
    component.confirmDamageTaken(7);
    expect(close).toHaveBeenCalledWith(7);
  });

  it('should close without a result on cancel', () => {
    component.onNoClick();
    expect(close).toHaveBeenCalledWith();
  });
});
