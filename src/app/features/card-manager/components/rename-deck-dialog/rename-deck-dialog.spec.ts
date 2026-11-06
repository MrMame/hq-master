import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mock } from 'vitest';

import { RenameDeckDialog } from './rename-deck-dialog';
import { clickButton } from '../../../../shared/testing/click-button';

describe('RenameDeckDialog', () => {
  let fixture: ComponentFixture<RenameDeckDialog>;
  let host: HTMLElement;
  let close: Mock<(name?: string) => void>;

  const input: () => HTMLInputElement = () => host.querySelector('input')!;
  const type: (value: string) => Promise<void> = async (value) => {
    input().value = value;
    input().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };
  const confirmButton: () => HTMLButtonElement = () =>
    host.querySelector<HTMLButtonElement>('.general-dialog__confirm')!;

  beforeEach(async () => {
    close = vi.fn();
    TestBed.configureTestingModule({
      imports: [RenameDeckDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: 'Monster' },
      ],
    });
    fixture = TestBed.createComponent(RenameDeckDialog);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('starts with the current name', () => {
    expect(input().value).toBe('Monster');
  });

  it('closes with the trimmed new name', async () => {
    await type('  Drachen ');
    clickButton(host, 'Umbenennen');
    expect(close).toHaveBeenCalledWith('Drachen');
  });

  it('confirms with Enter', async () => {
    await type('Drachen');
    input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(close).toHaveBeenCalledWith('Drachen');
  });

  it('does not accept a blank name', async () => {
    await type('   ');
    expect(confirmButton().disabled).toBe(true);
    input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(close).not.toHaveBeenCalled();
  });

  it('closes without a value on cancel', () => {
    clickButton(host, 'Abbrechen');
    expect(close).toHaveBeenCalledWith();
  });
});
