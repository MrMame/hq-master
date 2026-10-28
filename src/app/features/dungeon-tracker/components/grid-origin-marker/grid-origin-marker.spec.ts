import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridOriginMarker } from './grid-origin-marker';
import { Point } from '../../models/point.model';

describe('GridOriginMarker', () => {
  let fixture: ComponentFixture<GridOriginMarker>;
  let host: HTMLElement;
  let grip: HTMLElement;
  let previews: (Point | null)[];
  let moves: Point[];

  beforeEach(() => {
    fixture = TestBed.createComponent(GridOriginMarker);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('origin', { x: 500, y: 375 });
    fixture.componentRef.setInput('scale', 0.8);
    fixture.componentRef.setInput('stage', { width: 1000, height: 750 });
    fixture.detectChanges();
    grip = host.querySelector('[data-testid="grid-origin"]') as HTMLElement;
    // jsdom kennt kein Pointer-Capture.
    grip.setPointerCapture = vi.fn();
    previews = [];
    moves = [];
    fixture.componentInstance.originPreview.subscribe((p) => previews.push(p));
    fixture.componentInstance.originMoved.subscribe((p) => moves.push(p));
  });

  const pointer: (type: string, x: number, y: number, button?: number) => void = (
    type: string,
    x: number,
    y: number,
    button: number = 0,
  ): void => {
    grip.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, button, bubbles: true }));
  };

  it('sits on the origin and is found by its name', () => {
    expect(host.style.left).toBe('500px');
    expect(host.style.top).toBe('375px');
    expect(grip.getAttribute('aria-label')).toBe('Nullpunkt');
    expect(grip.getAttribute('role')).toBe('img');
  });

  it('keeps its screen size at every zoom', () => {
    expect(host.style.transform).toBe('scale(1.25)');

    fixture.componentRef.setInput('scale', 0);
    fixture.detectChanges();
    expect(host.style.transform).toBe('scale(1)');
  });

  it('reports the converted origin while dragging and when released', () => {
    pointer('pointerdown', 100, 100);
    pointer('pointermove', 60, 120);
    pointer('pointermove', 20, 140);
    pointer('pointerup', 20, 140);

    // (-80 px, 40 px) / 0.8 = (-100, 50) Einheiten
    expect(previews).toEqual([
      { x: 450, y: 400 },
      { x: 400, y: 425 },
    ]);
    expect(moves).toEqual([{ x: 400, y: 425 }]);
    expect(grip.setPointerCapture).toHaveBeenCalledTimes(1);
  });

  it('keeps the origin on the stage and rounds it to one decimal', () => {
    pointer('pointerdown', 100, 100);
    pointer('pointerup', 100 + 2000, 100 + 0.07);

    expect(moves).toEqual([{ x: 1000, y: 375.1 }]);
  });

  it('reports nothing for pointer moves without a press', () => {
    pointer('pointermove', 20, 140);
    pointer('pointerup', 20, 140);
    pointer('pointercancel', 20, 140);

    expect(previews).toEqual([]);
    expect(moves).toEqual([]);
  });

  it('drops the preview when the drag is cancelled', () => {
    pointer('pointerdown', 100, 100);
    pointer('pointermove', 60, 120);
    pointer('pointercancel', 60, 120);
    pointer('pointerup', 60, 120);

    expect(previews).toEqual([{ x: 450, y: 400 }, null]);
    expect(moves).toEqual([]);
  });

  it('ignores the secondary mouse button', () => {
    pointer('pointerdown', 100, 100, 2);
    pointer('pointermove', 20, 140);

    expect(previews).toEqual([]);
    expect(grip.setPointerCapture).not.toHaveBeenCalled();
  });

  it('keeps press and click away from the board', () => {
    const reachedBoard: () => void = vi.fn();
    host.addEventListener('pointerdown', reachedBoard);
    host.addEventListener('click', reachedBoard);

    pointer('pointerdown', 100, 100);
    pointer('pointerdown', 100, 100, 2);
    grip.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(reachedBoard).not.toHaveBeenCalled();
  });
});
