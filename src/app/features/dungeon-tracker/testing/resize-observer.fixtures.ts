import { vi } from 'vitest';

/**
 * Steuerbarer ResizeObserver für Specs (jsdom misst kein Layout). Nach `vi.stubGlobal('ResizeObserver',
 * FakeResizeObserver)` meldet `FakeResizeObserver.resizeAll(w, h)` allen Beobachtern eine neue Größe.
 */
export class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  readonly observe: ReturnType<typeof vi.fn> = vi.fn();
  readonly unobserve: ReturnType<typeof vi.fn> = vi.fn();
  readonly disconnect: ReturnType<typeof vi.fn> = vi.fn();

  constructor(private readonly callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this);
  }

  /** Meldet eine Rahmengröße (`borderBoxSize`) wie der Browser nach einer Größenänderung. */
  static resizeAll(width: number, height: number): void {
    const entry: ResizeObserverEntry = {
      borderBoxSize: [{ inlineSize: width, blockSize: height }],
    } as unknown as ResizeObserverEntry;
    for (const observer of FakeResizeObserver.instances) {
      observer.callback([entry], observer as unknown as ResizeObserver);
    }
  }

  static reset(): void {
    FakeResizeObserver.instances = [];
  }
}
