import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Mock, vi } from 'vitest';

import { GameSessionPage } from '../components/game-session-page/game-session-page';

export interface GameSessionPageSetup {
  fixture: ComponentFixture<GameSessionPage>;
  host: HTMLElement;
  dialogOpen: Mock;
  /** Legt fest, ob der Bestätigungsdialog mit OK (`true`) geschlossen wird. */
  confirmWith: (confirmed: boolean) => void;
  /** Textinhalt des Elements mit `data-testid` (leer, wenn es fehlt). */
  readText: (testId: string) => string;
  /** Element mit `data-testid`; wirft, wenn es fehlt. */
  byTestId: <T extends HTMLElement>(testId: string) => T;
}

/** Rendert die Page mit gemocktem Bestätigungsdialog (Standard: OK). */
export async function setupGameSessionPage(): Promise<GameSessionPageSetup> {
  let confirmed: boolean = true;
  const dialogOpen: Mock = vi.fn(() => ({ afterClosed: () => of(confirmed) }));
  await TestBed.configureTestingModule({
    imports: [GameSessionPage],
    providers: [{ provide: MatDialog, useValue: { open: dialogOpen } }],
  }).compileComponents();
  const fixture: ComponentFixture<GameSessionPage> = TestBed.createComponent(GameSessionPage);
  const host: HTMLElement = fixture.nativeElement as HTMLElement;
  await fixture.whenStable();

  function byTestId<T extends HTMLElement>(testId: string): T {
    const el: T | null = host.querySelector<T>(`[data-testid="${testId}"]`);
    if (!el) throw new Error(`data-testid="${testId}" nicht gefunden`);
    return el;
  }
  return {
    fixture,
    host,
    dialogOpen,
    confirmWith: (value: boolean): void => {
      confirmed = value;
    },
    readText: (testId: string): string => {
      fixture.detectChanges();
      return host.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim() ?? '';
    },
    byTestId,
  };
}

/** Setzt den Wert eines Eingabefelds und löst `input` aus. */
export function typeInto(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}
