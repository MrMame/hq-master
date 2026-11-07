import { MatSnackBar } from '@angular/material/snack-bar';
import { Provider } from '@angular/core';
import { Subject } from 'rxjs';
import { Mock, vi } from 'vitest';

/** Ein geöffneter Hinweis: „Aktion“ und „geschlossen“ lassen sich im Spec auslösen. */
export interface SnackBarHintMock {
  action: Subject<void>;
  dismissed: Subject<void>;
  /** Schließt den Hinweis (löst `dismissed` aus). */
  dismiss: Mock<() => void>;
}

/** Steuerbare Snackbar statt der echten (nur für Specs). */
export interface SnackBarMock {
  open: Mock;
  /** Alle geöffneten Hinweise in Reihenfolge. */
  hints: SnackBarHintMock[];
  provider: Provider;
}

export function createSnackBarMock(): SnackBarMock {
  const hints: SnackBarHintMock[] = [];
  const open: Mock = vi.fn(() => {
    const hint: SnackBarHintMock = {
      action: new Subject(),
      dismissed: new Subject(),
      dismiss: vi.fn(),
    };
    hint.dismiss.mockImplementation(() => hint.dismissed.next());
    hints.push(hint);
    return {
      onAction: (): Subject<void> => hint.action,
      afterDismissed: (): Subject<void> => hint.dismissed,
      dismiss: hint.dismiss,
    };
  });
  return { open, hints, provider: { provide: MatSnackBar, useValue: { open } } };
}
