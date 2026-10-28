import { CELL_SIZE_LIMITS } from './grid-fit.util';
import {
  clamp,
  formatOrigin,
  GRID_STEPS,
  OPACITY_LIMITS,
  ORIGIN_LIMITS,
  roundTo,
  stepWithin,
} from './grid-step.util';

describe('grid-step.util', () => {
  it('keeps the old offset range −100 to 100 within the origin range', () => {
    expect(ORIGIN_LIMITS).toEqual({ min: -100, max: 1000 });
  });

  it.each<[number, number]>([
    [-5, 0],
    [0.5, 0.5],
    [7, 1],
  ])('clamps %s into 0 to 1 as %s', (value, expected) => {
    expect(clamp(value, OPACITY_LIMITS)).toBe(expected);
  });

  it('rounds to the given number of decimals', () => {
    expect(roundTo(38.4715, 2)).toBe(38.47);
    expect(roundTo(412.36, 1)).toBe(412.4);
    expect(roundTo(-0.25, 1)).toBe(-0.2);
  });

  it.each<[string, number, -1 | 1, number, { min: number; max: number }, number]>([
    ['cell size up', 38.46, 1, GRID_STEPS.cellSize, CELL_SIZE_LIMITS, 38.47],
    ['an unrounded cell size up', 1000 / 26, 1, GRID_STEPS.cellSize, CELL_SIZE_LIMITS, 38.47],
    ['an unrounded cell size down', 1000 / 26, -1, GRID_STEPS.cellSize, CELL_SIZE_LIMITS, 38.45],
    ['the origin up', 412.4, 1, GRID_STEPS.origin, ORIGIN_LIMITS, 412.5],
    ['the origin below zero', 0, -1, GRID_STEPS.origin, ORIGIN_LIMITS, -0.1],
    ['the opacity up', 0.4, 1, GRID_STEPS.opacity, OPACITY_LIMITS, 0.45],
    ['the opacity down', 0.1, -1, GRID_STEPS.opacity, OPACITY_LIMITS, 0.05],
  ])(
    'steps %s without a floating point rest',
    (_case, value, direction, step, limits, expected) => {
      expect(stepWithin(value, direction, step, limits)).toBe(expected);
    },
  );

  it.each<[number, -1 | 1, number]>([
    [149.995, 1, 150],
    [20.005, -1, 20],
    [150, 1, 150],
  ])('keeps the cell size %s stepped %s within the limits', (value, direction, expected) => {
    expect(stepWithin(value, direction, GRID_STEPS.cellSize, CELL_SIZE_LIMITS)).toBe(expected);
  });

  it('rounds a whole-number step to whole numbers', () => {
    expect(stepWithin(4.6, 1, 1, ORIGIN_LIMITS)).toBe(6);
  });

  it.each<[number, string]>([
    [412.4, '412,4'],
    [0, '0'],
    [-12.5, '-12,5'],
    [1000, '1.000'],
  ])('formats the origin %s as "%s"', (value, expected) => {
    expect(formatOrigin(value)).toBe(expected);
  });
});
