import { fitColumns, formatCellSize, parseCellSize, roundCellSize } from './grid-fit.util';

describe('grid-fit.util', () => {
  it.each<[string, number | null]>([
    ['38.46', 38.46],
    ['38,46', 38.46],
    [' 60 ', 60],
    ['20', 20],
    ['150', 150],
    ['19.99', null],
    ['150.5', null],
    ['', null],
    ['abc', null],
  ])('parses the cell size "%s" as %s', (raw, expected) => {
    expect(parseCellSize(raw)).toBe(expected);
  });

  it('fits the grid exactly to the image width', () => {
    expect(fitColumns(26)).toEqual({ cellSize: 1000 / 26 });
    expect(fitColumns(50)).toEqual({ cellSize: 20 });
    expect(fitColumns(7)).toEqual({ cellSize: 1000 / 7 });
  });

  it.each<[number, string]>([
    [51, 'Bei so vielen Spalten wäre eine Zelle kleiner als 20.'],
    [6, 'Bei so wenigen Spalten wäre eine Zelle größer als 150.'],
    [0, 'Bitte eine ganze Zahl von 1 bis 100 eingeben.'],
    [101, 'Bitte eine ganze Zahl von 1 bis 100 eingeben.'],
    [12.5, 'Bitte eine ganze Zahl von 1 bis 100 eingeben.'],
  ])('refuses %s columns with a hint', (columns, hint) => {
    expect(fitColumns(columns)).toEqual({ hint });
  });

  it('rounds and formats the cell size with at most two decimals in German', () => {
    expect(roundCellSize(1000 / 26)).toBe(38.46);
    expect(formatCellSize(1000 / 26)).toBe('38,46');
    expect(formatCellSize(60)).toBe('60');
    expect(formatCellSize(37.5)).toBe('37,5');
  });
});
