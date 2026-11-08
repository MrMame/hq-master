import {
  clampSidebarWidth,
  isResizeDrag,
  maxSidebarWidth,
  SIDEBAR_MIN_WIDTH,
} from './sidebar-width.util';

describe('sidebar-width.util', () => {
  it('should allow half of the window as maximum', () => {
    expect(maxSidebarWidth(1280)).toBe(640);
  });

  it('should never let the maximum fall below the minimum on narrow windows', () => {
    expect(maxSidebarWidth(360)).toBe(SIDEBAR_MIN_WIDTH);
  });

  it('should keep widths inside the limits unchanged', () => {
    expect(clampSidebarWidth(300, 1280)).toBe(300);
  });

  it('should stop at the minimum without going below it', () => {
    expect(clampSidebarWidth(120, 1280)).toBe(200);
  });

  it('should cut widths above half of the window', () => {
    expect(clampSidebarWidth(900, 1280)).toBe(640);
  });

  it('should pin the width to the minimum when the window is too narrow to resize', () => {
    expect(clampSidebarWidth(260, 360)).toBe(200);
    expect(clampSidebarWidth(150, 360)).toBe(200);
  });

  it('should treat less than 4px as click and from 4px on as drag, in both directions', () => {
    expect(isResizeDrag(0)).toBe(false);
    expect(isResizeDrag(3)).toBe(false);
    expect(isResizeDrag(-3.9)).toBe(false);
    expect(isResizeDrag(4)).toBe(true);
    expect(isResizeDrag(-4)).toBe(true);
  });
});
