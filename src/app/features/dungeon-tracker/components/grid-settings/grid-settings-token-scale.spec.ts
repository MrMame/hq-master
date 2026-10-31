import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { GridSettings } from './grid-settings';

describe('GridSettings – token size', () => {
  let fixture: ComponentFixture<GridSettings>;
  let host: HTMLElement;
  let board: DungeonBoardService;

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSettings);
    host = fixture.nativeElement as HTMLElement;
    board = TestBed.inject(DungeonBoardService);
    fixture.detectChanges();
  });

  const labels: () => string[] = (): string[] =>
    Array.from(host.querySelectorAll('label')).map((l) => l.textContent?.trim() ?? '');
  const slider: () => HTMLInputElement = (): HTMLInputElement => {
    const label: HTMLLabelElement | undefined = Array.from(host.querySelectorAll('label')).find(
      (l) => l.textContent?.trim().startsWith('Token-Größe'),
    );
    return host.querySelector(`[id="${label?.htmlFor}"]`) as HTMLInputElement;
  };
  const stepButton: (label: string) => HTMLButtonElement = (label: string): HTMLButtonElement =>
    host.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement;
  const press: (label: string) => void = (label: string): void => {
    stepButton(label).dispatchEvent(new PointerEvent('pointerdown', { button: 0 }));
    stepButton(label).dispatchEvent(new PointerEvent('pointerup', { button: 0 }));
    fixture.detectChanges();
  };
  const update: (partial: Partial<DungeonBoardState>) => void = (
    partial: Partial<DungeonBoardState>,
  ): void => {
    board.updateGridSettings(partial);
    fixture.detectChanges();
  };

  it('shows the token size at 85 % directly after the cell size', () => {
    const order: string[] = labels().filter((l) => /^(Zellgröße|Token-Größe|Spalten)/.test(l));
    expect(order[0]).toMatch(/^Zellgröße/);
    expect(order[1]).toBe('Token-Größe: 85 %');
    expect(order[2]).toMatch(/^Spalten/);
  });

  it('lets the slider reach from 30 % to 150 % in steps of 5 %', () => {
    expect([slider().min, slider().max, slider().step, slider().value]).toEqual([
      '0.3',
      '1.5',
      '0.05',
      '0.85',
    ]);
  });

  it.each<[string, number, number, string]>([
    ['Token-Größe erhöhen', 0.85, 0.9, 'Token-Größe: 90 %'],
    ['Token-Größe verringern', 0.85, 0.8, 'Token-Größe: 80 %'],
    ['Token-Größe erhöhen', 1.45, 1.5, 'Token-Größe: 150 %'],
  ])('"%s" from %s stores only %s', (label, start, expected, text) => {
    update({ tokenScale: start });
    const before: DungeonBoardState = board.boardState();

    press(label);

    expect(board.boardState()).toEqual({ ...before, tokenScale: expected });
    expect(labels()).toContain(text);
  });

  it.each<[number, string, string]>([
    [1.5, 'Token-Größe erhöhen', 'Token-Größe verringern'],
    [0.3, 'Token-Größe verringern', 'Token-Größe erhöhen'],
  ])('stays within the limits at %s', (limit, disabled, enabled) => {
    update({ tokenScale: limit });
    expect(stepButton(disabled).disabled).toBe(true);
    expect(stepButton(enabled).disabled).toBe(false);
  });
});
