import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mock } from 'vitest';

import { ConfirmationDialog } from './confirmation-dialog';
import { ConfirmationDialogData } from '../../models/confirmation-dialog-data.model';

describe('ConfirmationDialog', () => {
  let host: HTMLElement;
  let loader: HarnessLoader;
  let close: Mock<(result?: boolean) => void>;

  /** Rendert die Rückfrage; ohne `data` wird kein `MAT_DIALOG_DATA` bereitgestellt. */
  async function render(data?: ConfirmationDialogData): Promise<void> {
    close = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        ...(data ? [{ provide: MAT_DIALOG_DATA, useValue: data }] : []),
      ],
    }).compileComponents();
    const fixture: ComponentFixture<ConfirmationDialog> =
      TestBed.createComponent(ConfirmationDialog);
    await fixture.whenStable();
    host = fixture.nativeElement as HTMLElement;
    loader = TestbedHarnessEnvironment.loader(fixture);
  }

  function button(text: string): Promise<MatButtonHarness> {
    return loader.getHarness(MatButtonHarness.with({ text }));
  }

  function titleText(): string | undefined {
    return host.querySelector('h2')?.textContent?.trim();
  }

  function messageText(): string | undefined {
    return host.querySelector('mat-dialog-content')?.textContent?.trim();
  }

  it('shows the default texts without dialog data', async () => {
    await render();

    expect(titleText()).toBe('Auswahl treffen');
    expect(messageText()).toBe('Möchten Sie diese Aktion wirklich ausführen?');
    expect(await (await button('Bestätigen')).getText()).toBe('Bestätigen');
    expect(host.classList).toContain('general-dialog');
  });

  it('shows the texts passed by the caller', async () => {
    await render({
      title: 'Charakter entfernen',
      message: '„Ork“ entfernen?',
      confirmLabel: 'Entfernen',
    });

    expect(titleText()).toBe('Charakter entfernen');
    expect(messageText()).toBe('„Ork“ entfernen?');
    expect(await (await button('Entfernen')).getText()).toBe('Entfernen');
  });

  it('falls back to the default texts for missing values', async () => {
    await render({ message: 'Spielstand ersetzen?' });

    expect(titleText()).toBe('Auswahl treffen');
    expect(messageText()).toBe('Spielstand ersetzen?');
    expect(await (await button('Bestätigen')).getText()).toBe('Bestätigen');
  });

  it('closes with false on "Abbrechen"', async () => {
    await render();

    await (await button('Abbrechen')).click();

    expect(close).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('closes with true on the confirm button, also with its own label', async () => {
    await render({ confirmLabel: 'Entfernen' });

    await (await button('Entfernen')).click();

    expect(close).toHaveBeenCalledExactlyOnceWith(true);
  });
});
