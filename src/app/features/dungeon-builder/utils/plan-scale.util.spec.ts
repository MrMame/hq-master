import { Extent, planScale } from './plan-scale.util';

describe('plan-scale.util', () => {
  const plan: Extent = { width: 1000, height: 500 };

  it('fits the whole plan at zoom 1 and multiplies with the zoom', () => {
    expect(planScale({ width: 500, height: 500 }, plan, 1)).toBe(0.5);
    expect(planScale({ width: 500, height: 500 }, plan, 3)).toBe(1.5);
  });

  it('uses the zoom alone while the area is not measured yet', () => {
    expect(planScale({ width: 0, height: 0 }, plan, 2)).toBe(2);
  });
});
