import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { GridSettings } from './grid-settings';
import { clickButton } from '../../../../shared/testing/click-button';

type GridSetting = 'gridCellSizePx' | 'gridOffsetX' | 'gridOffsetY' | 'gridOpacity';

describe('GridSettings', () => {
  let fixture: ComponentFixture<GridSettings>;
  let host: HTMLElement;
  let board: DungeonBoardService;

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSettings);
    host = fixture.nativeElement as HTMLElement;
    board = TestBed.inject(DungeonBoardService);
    fixture.detectChanges();
  });

  function enter(input: HTMLInputElement, value: string, event: 'input' | 'change'): void {
    input.value = value;
    input.dispatchEvent(new Event(event));
    fixture.detectChanges();
  }

  const sliders: () => HTMLInputElement[] = (): HTMLInputElement[] =>
    Array.from(host.querySelectorAll<HTMLInputElement>('input[type="range"]'));
  const cellSizeField: () => HTMLInputElement = (): HTMLInputElement =>
    host.querySelector('input[aria-label="Zellgröße"]') as HTMLInputElement;
  const columnsField: () => HTMLInputElement = (): HTMLInputElement =>
    host.querySelector('input[step="1"][type="number"]') as HTMLInputElement;
  const apply: () => void = (): void => {
    clickButton(host, 'Übernehmen');
    fixture.detectChanges();
  };

  it.each<[number, GridSetting, string, number]>([
    [0, 'gridCellSizePx', '60.5', 60.5],
    [1, 'gridOffsetX', '-10', -10],
    [2, 'gridOffsetY', '15', 15],
    [3, 'gridOpacity', '0.5', 0.5],
  ])('slider %i changes only %s', (index, key, rawValue, expected) => {
    const before: DungeonBoardState = board.boardState();
    enter(sliders()[index], rawValue, 'input');
    expect(board.boardState()).toEqual({ ...before, [key]: expected });
  });

  it('should show slider and number field with the same cell size', () => {
    board.updateGridSettings({ gridCellSizePx: 1000 / 26 });
    fixture.detectChanges();

    expect(host.textContent).toContain('Zellgröße: 38,46px');
    expect(cellSizeField().value).toBe('38.46');
    expect(Number(sliders()[0].value)).toBeCloseTo(38.46, 2);
    expect(sliders()[0].step).toBe('0.01');
    expect(cellSizeField().step).toBe('0.01');
  });

  it('should store an entered cell size with decimals', () => {
    enter(cellSizeField(), '38.46', 'change');
    expect(board.boardState().gridCellSizePx).toBe(38.46);
    expect(host.textContent).toContain('Zellgröße: 38,46px');
  });

  it.each<string>(['', '19', '151'])(
    'should ignore the entry "%s" and show the stored size',
    (raw) => {
      enter(cellSizeField(), raw, 'change');
      expect(board.boardState().gridCellSizePx).toBe(60);
      expect(cellSizeField().value).toBe('60');
    },
  );

  it('should fit the grid to the image width with the column count', () => {
    board.updateGridSettings({ gridOffsetX: 12, gridOffsetY: -4 });
    expect(columnsField().value).toBe('10');

    enter(columnsField(), '26', 'input');
    apply();

    expect(board.boardState()).toMatchObject({ gridColumns: 26, gridOffsetX: 0, gridOffsetY: 0 });
    expect(board.boardState().gridCellSizePx).toBe(1000 / 26);
    expect(host.querySelector('[data-testid="grid-columns-hint"]')).toBeNull();
  });

  it.each<[string, string]>([
    ['60', 'Bei so vielen Spalten wäre eine Zelle kleiner als 20.'],
    ['', 'Bitte eine ganze Zahl von 1 bis 100 eingeben.'],
  ])('should refuse %s columns with a hint and change nothing', (raw, hint) => {
    const before: DungeonBoardState = board.boardState();
    enter(columnsField(), raw, 'input');
    apply();

    expect(board.boardState()).toBe(before);
    expect(host.querySelector('[data-testid="grid-columns-hint"]')?.textContent).toBe(hint);

    enter(columnsField(), '20', 'input');
    apply();
    expect(host.querySelector('[data-testid="grid-columns-hint"]')).toBeNull();
  });

  it('should keep the column count when the cell size is changed by hand later', () => {
    enter(columnsField(), '26', 'input');
    apply();
    enter(cellSizeField(), '40', 'change');

    expect(board.boardState()).toMatchObject({ gridColumns: 26, gridCellSizePx: 40 });
  });
});
