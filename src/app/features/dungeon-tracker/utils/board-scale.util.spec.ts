import { fitScale, STAGE_WIDTH, stageSize } from './board-scale.util';

describe('board-scale util', () => {
  describe('stageSize', () => {
    it('is always STAGE_WIDTH wide and follows the aspect ratio of a landscape photo', () => {
      expect(stageSize({ width: 1600, height: 1000 })).toEqual({ width: STAGE_WIDTH, height: 625 });
    });

    it('follows the aspect ratio of a portrait photo', () => {
      expect(stageSize({ width: 500, height: 1000 })).toEqual({ width: 1000, height: 2000 });
    });

    it('uses 4:3 without a photo', () => {
      expect(stageSize(null)).toEqual({ width: 1000, height: 750 });
    });

    it('uses 4:3 for a photo without size (not loaded or broken)', () => {
      expect(stageSize({ width: 0, height: 0 })).toEqual({ width: 1000, height: 750 });
    });
  });

  describe('fitScale', () => {
    const stage: { width: number; height: number } = { width: 1000, height: 750 };

    it('is limited by the height of a wide board', () => {
      expect(fitScale({ width: 2000, height: 375 }, stage)).toBe(0.5);
    });

    it('is limited by the width of a tall board', () => {
      expect(fitScale({ width: 800, height: 2000 }, stage)).toBe(0.8);
    });

    it('is 0 while the board has no size yet', () => {
      expect(fitScale({ width: 0, height: 0 }, stage)).toBe(0);
    });
  });
});
