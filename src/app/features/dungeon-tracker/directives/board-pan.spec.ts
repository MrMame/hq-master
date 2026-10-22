import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPan } from './board-pan';

@Component({
  imports: [BoardPan],
  template: `
    <div class="viewport" appBoardPan (clickWithoutPan)="clicks = clicks + 1">
      <div class="free"></div>
      <div class="cdk-drag"><span class="token-part"></span></div>
    </div>
  `,
})
class PanHost {
  clicks: number = 0;
}

describe('BoardPan', () => {
  let fixture: ComponentFixture<PanHost>;
  let viewport: HTMLElement;

  // jsdom hat kein Layout: Client-Fläche 400 × 300 ab (0,0); Pointer-Capture als Stub.
  beforeEach(() => {
    fixture = TestBed.createComponent(PanHost);
    fixture.detectChanges();
    viewport = (fixture.nativeElement as HTMLElement).querySelector('.viewport') as HTMLElement;
    Object.defineProperty(viewport, 'clientWidth', { value: 400 });
    Object.defineProperty(viewport, 'clientHeight', { value: 300 });
    viewport.setPointerCapture = vi.fn();
    viewport.scrollLeft = 500;
    viewport.scrollTop = 200;
  });

  const pointer: (type: string, target: string, x: number, y: number, button?: number) => void = (
    type: string,
    target: string,
    x: number,
    y: number,
    button: number = 0,
  ): void => {
    const init: PointerEventInit = { bubbles: true, clientX: x, clientY: y, button, pointerId: 1 };
    viewport.querySelector(target)?.dispatchEvent(new PointerEvent(type, init));
  };

  const drag: (target: string, from: [number, number], to: [number, number]) => void = (
    target: string,
    from: [number, number],
    to: [number, number],
  ): void => {
    pointer('pointerdown', target, ...from);
    pointer('pointermove', target, ...to);
    pointer('pointerup', target, ...to);
  };

  const click: () => void = (): void => (viewport.querySelector('.free') as HTMLElement).click();

  it('moves the visible area against the pointer when dragging on a free spot', () => {
    drag('.free', [100, 100], [160, 70]);

    expect(viewport.scrollLeft).toBe(440);
    expect(viewport.scrollTop).toBe(230);
    expect(viewport.setPointerCapture).toHaveBeenCalledWith(1);
  });

  it('stops moving after the pointer is released', () => {
    drag('.free', [100, 100], [160, 70]);
    pointer('pointermove', '.free', 300, 300);

    expect(viewport.scrollLeft).toBe(440);
  });

  it.each<[string, string, [number, number], number]>([
    ['a draggable token', '.token-part', [100, 100], 0],
    ['the vertical scrollbar', '.free', [400, 100], 0],
    ['the horizontal scrollbar', '.free', [100, 300], 0],
    ['the secondary mouse button', '.free', [100, 100], 2],
  ])('does not move the visible area when starting on %s', (_, target, [x, y], button) => {
    pointer('pointerdown', target, x, y, button);
    pointer('pointermove', target, x + 50, y + 50);

    expect([viewport.scrollLeft, viewport.scrollTop]).toEqual([500, 200]);
  });

  it('reports a click without movement', () => {
    drag('.free', [100, 100], [102, 101]);
    click();

    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('swallows the click that ends a pan, but reports the next one', () => {
    drag('.free', [100, 100], [160, 70]);
    click();
    expect(fixture.componentInstance.clicks).toBe(0);

    click();
    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('ends the pan when the browser cancels the pointer', () => {
    pointer('pointerdown', '.free', 100, 100);
    pointer('pointercancel', '.free', 100, 100);
    pointer('pointermove', '.free', 160, 70);

    expect(viewport.scrollLeft).toBe(500);
  });
});
