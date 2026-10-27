import { Mock, vi } from 'vitest';

/** Aufgezeichnete Canvas-Zeichenbefehle; jsdom hat keine echte Canvas. */
export interface FakeContext {
  context: CanvasRenderingContext2D;
  calls: Record<
    | 'save'
    | 'restore'
    | 'translate'
    | 'rotate'
    | 'drawImage'
    | 'fillRect'
    | 'beginPath'
    | 'moveTo'
    | 'lineTo'
    | 'stroke'
    | 'fillText',
    Mock
  >;
}

export function createFakeContext(): FakeContext {
  const calls: FakeContext['calls'] = {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
  };
  return { context: { ...calls } as unknown as CanvasRenderingContext2D, calls };
}
