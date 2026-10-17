import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { AddCharacterDialog } from './add-character-dialog';

describe('AddCharacterDialog', () => {
  let component: AddCharacterDialog;
  let fixture: ComponentFixture<AddCharacterDialog>;
  const close: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    close.mockReset();
    await TestBed.configureTestingModule({
      imports: [AddCharacterDialog],
      providers: [{ provide: MatDialogRef, useValue: { close } }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCharacterDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close with a new character on ok', () => {
    component.onOkClick();
    expect(close).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
  });

  it('should close without a result on cancel', () => {
    component.onNoClick();
    expect(close).toHaveBeenCalledWith();
  });
});
