import { Point } from '../models/point.model';
import { Size } from '../models/size.model';
import { draggedOrigin, fieldAt } from './grid-origin.util';

const stage: Size = { width: 1000, height: 750 };

describe('draggedOrigin', () => {
  it('converts the screen distance into units of the stage', () => {
    expect(draggedOrigin({ x: 500, y: 375 }, { x: -80, y: 40 }, 0.8, stage)).toEqual({
      x: 400,
      y: 425,
    });
  });

  it('converts the same unit distance at zoom 200 %', () => {
    expect(draggedOrigin({ x: 500, y: 375 }, { x: -160, y: 80 }, 1.6, stage)).toEqual({
      x: 400,
      y: 425,
    });
  });

  it('rounds to one decimal', () => {
    // 10 / 0.8 = 12.5, 7 / 0.8 = 8.75
    expect(draggedOrigin({ x: 100, y: 100.04 }, { x: 10, y: 7 }, 0.8, stage)).toEqual({
      x: 112.5,
      y: 108.8,
    });
  });

  it.each<[string, Point, Point]>([
    ['left and above', { x: -900, y: -900 }, { x: 0, y: 0 }],
    ['right and below', { x: 900, y: 900 }, { x: 1000, y: 750 }],
  ])('keeps the marker on the stage when dragged out %s', (_case, distance, expected) => {
    expect(draggedOrigin({ x: 500, y: 375 }, distance, 1, stage)).toEqual(expected);
  });

  it('keeps the origin within 1000 also on a stage of a portrait photo', () => {
    const portrait: Size = { width: 1000, height: 1500 };
    expect(draggedOrigin({ x: 500, y: 900 }, { x: 0, y: 400 }, 1, portrait).y).toBe(1000);
  });

  it('moves a negative origin set with the slider onto the stage', () => {
    expect(draggedOrigin({ x: -50, y: -20 }, { x: 10, y: 0 }, 1, stage)).toEqual({ x: 0, y: 0 });
  });
});

describe('fieldAt', () => {
  it.each<[string, number, number]>([
    ['right of the origin', 535, 0],
    ['one field further', 595, 1],
    ['directly left of the origin', 499, -1],
    ['two fields left of the origin', 395, -2],
  ])('counts a portrait center %s', (_case, center, expected) => {
    expect(fieldAt(center, 500, 60)).toBe(expected);
  });

  it('counts a portrait center left of the stage as its edge', () => {
    expect(fieldAt(-200, 500, 60)).toBe(fieldAt(0, 500, 60));
    expect(fieldAt(-200, 500, 60)).toBe(-9);
  });

  it('keeps the old behavior for an origin at the stage corner', () => {
    expect(fieldAt(-20, 0, 60)).toBe(0);
    expect(fieldAt(130, 0, 60)).toBe(2);
  });
});
