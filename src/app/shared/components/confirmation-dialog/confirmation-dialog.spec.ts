import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { Mock } from 'vitest';

import { ConfirmationDialog } from './confirmation-dialog';

describe('ConfirmationDialog', () => {
  let fixture: ComponentFixture<ConfirmationDialog>;
  let close: Mock<(result?: boolean) => void>;

  const button: (label: string) => HTMLButtonElement = (label: string): HTMLButtonElement =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find(
      (b: HTMLButtonElement) => b.textContent?.trim() === label,
    ) as HTMLButtonElement;

  beforeEach(async () => {
    close = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialog],
      providers: [{ provide: MatDialogRef, useValue: { close } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialog);
    await fixture.whenStable();
  });

  it('renders title and question', () => {
    const text: string = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Auswahl treffen');
    expect(text).toContain('Möchten Sie diese Aktion wirklich ausführen?');
  });

  it('closes with false on "Abbrechen"', () => {
    button('Abbrechen').click();

    expect(close).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('closes with true on "Bestätigen"', () => {
    button('Bestätigen').click();

    expect(close).toHaveBeenCalledExactlyOnceWith(true);
  });
});
