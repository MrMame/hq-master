import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { GridSettings } from './grid-settings';

describe('GridSettings – origin and step buttons', () => {
  let fixture: ComponentFixture<GridSettings>;
  let host: HTMLElement;
  let board: DungeonBoardService;

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSettings);
    host = fixture.nativeElement as HTMLElement;
    board = TestBed.inject(DungeonBoardService);
    fixture.detectChanges();
  });

  afterEach(() => vi.useRealTimers());

  const originSwitch: () => HTMLInputElement = (): HTMLInputElement =>
    host.querySelector('input[type="checkbox"]') as HTMLInputElement;
  const slider: (label: string) => HTMLInputElement = (label: string): HTMLInputElement => {
    const labelElement: HTMLLabelElement | undefined = Array.from(
      host.querySelectorAll('label'),
    ).find((l) => l.textContent?.trim().startsWith(label));
    return host.querySelector(`[id="${labelElement?.htmlFor}"]`) as HTMLInputElement;
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

  it('reports the switch "Nullpunkt verschieben" without storing it', () => {
    const before: DungeonBoardState = board.boardState();
    expect(originSwitch().checked).toBe(false);
    expect(originSwitch().closest('label')?.textContent?.trim()).toBe('Nullpunkt verschieben');

    originSwitch().click();
    expect(fixture.componentInstance.originMode()).toBe(true);

    originSwitch().click();
    expect(fixture.componentInstance.originMode()).toBe(false);
    expect(board.boardState()).toBe(before);
  });

  it('shows the switch as set by the page', () => {
    fixture.componentRef.setInput('originMode', true);
    fixture.detectChanges();
    expect(originSwitch().checked).toBe(true);
  });

  it('labels the origin sliders in German with at most one decimal', () => {
    update({ gridOffsetX: 412.4, gridOffsetY: -12.5 });

    expect(host.textContent).toContain('Nullpunkt X: 412,4');
    expect(host.textContent).toContain('Nullpunkt Y: -12,5');
    expect(host.textContent).not.toContain('Versatz');
    expect(slider('Nullpunkt X').value).toBe('412.4');
  });

  it.each<string>(['Nullpunkt X', 'Nullpunkt Y'])(
    'lets the %s slider reach from -100 over the whole stage in steps of 0.1',
    (label) => {
      expect([slider(label).min, slider(label).max, slider(label).step]).toEqual([
        '-100',
        '1000',
        '0.1',
      ]);
    },
  );

  it.each<[string, Partial<DungeonBoardState>, Partial<DungeonBoardState>]>([
    ['Zellgröße erhöhen', { gridCellSizePx: 1000 / 26 }, { gridCellSizePx: 38.47 }],
    ['Zellgröße verringern', { gridCellSizePx: 60 }, { gridCellSizePx: 59.99 }],
    ['Nullpunkt X verringern', { gridOffsetX: 0 }, { gridOffsetX: -0.1 }],
    ['Nullpunkt Y erhöhen', { gridOffsetY: 412.4 }, { gridOffsetY: 412.5 }],
    ['Deckkraft verringern', { gridOpacity: 0.4 }, { gridOpacity: 0.35 }],
    ['Deckkraft erhöhen', { gridOpacity: 0.4 }, { gridOpacity: 0.45 }],
  ])('"%s" changes only this value by its finest step', (label, start, expected) => {
    update(start);
    const before: DungeonBoardState = board.boardState();

    press(label);

    expect(board.boardState()).toEqual({ ...before, ...expected });
  });

  it('disables "+" at full opacity', () => {
    update({ gridOpacity: 1 });
    expect(stepButton('Deckkraft erhöhen').disabled).toBe(true);
    expect(stepButton('Deckkraft verringern').disabled).toBe(false);
  });

  it('repeats the step while "+" is held', () => {
    vi.useFakeTimers();
    stepButton('Nullpunkt X erhöhen').dispatchEvent(new PointerEvent('pointerdown', { button: 0 }));
    fixture.detectChanges();
    vi.advanceTimersByTime(400);
    fixture.detectChanges();
    vi.advanceTimersByTime(80);
    fixture.detectChanges();
    stepButton('Nullpunkt X erhöhen').dispatchEvent(new PointerEvent('pointerup', { button: 0 }));

    expect(board.boardState().gridOffsetX).toBe(0.3);
  });
});
