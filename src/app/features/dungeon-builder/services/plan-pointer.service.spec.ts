import { PlaceGesture } from '../gestures/place.gesture';
import { PlanPoint } from '../models/grid.model';
import { BuilderServices, setupBuilderServices } from '../testing/builder-services.fixtures';

describe('PlanPointerService', () => {
  let s: BuilderServices;

  beforeEach(() => {
    s = setupBuilderServices();
  });

  /** Drückt, bewegt über alle Punkte und lässt am letzten los. */
  function drag(...points: PlanPoint[]): boolean {
    const handled: boolean = s.pointer.down(points[0]);
    points.slice(1).forEach((point) => s.pointer.move(point));
    s.pointer.up(points[points.length - 1]);
    return handled;
  }

  it('should paint a gap-free brush stroke on release as one undo step', () => {
    s.ui.chooseFloor('corridor');
    s.pointer.down({ x: 0.5, y: 0.5 });
    s.pointer.move({ x: 3.5, y: 0.5 });
    s.pointer.move({ x: 3.6, y: 0.4 });

    expect(Object.keys(s.ui.draft().floor)).toHaveLength(4);
    expect(s.layout.layout().floor).toEqual({});

    s.pointer.up({ x: 3.5, y: 0.5 });
    expect(s.layout.layout().floor['3,0']).toBe('corridor');
    s.layout.undo();
    expect(s.layout.layout().floor).toEqual({});
  });

  it('should erase with the eraser and draw a rectangle in any direction', () => {
    s.ui.selectTool('rectangle');
    s.pointer.down({ x: 3.5, y: 2.5 });
    s.pointer.move({ x: 2.5, y: 1.5 });
    expect(Object.keys(s.ui.draft().floor)).toHaveLength(4);
    s.pointer.cancel();

    expect(drag({ x: 3.5, y: 2.5 }, { x: 1.5, y: 1.5 })).toBe(true);
    expect(Object.keys(s.layout.layout().floor)).toHaveLength(6);

    s.ui.selectTool('eraser');
    drag({ x: 1.5, y: 1.5 }, { x: 3.5, y: 1.5 });
    expect(Object.keys(s.layout.layout().floor).sort()).toEqual(['1,2', '2,2', '3,2']);
  });

  it('should fill an area on a tap', () => {
    s.ui.chooseFloor(null);
    s.ui.selectTool('fill');
    s.ui.chooseFloor('room');
    s.pointer.down({ x: 0.5, y: 0.5 });
    // Startplan 26 × 19 aus Fels: alles hängt zusammen.
    expect(Object.keys(s.layout.layout().floor)).toHaveLength(26 * 19);
  });

  it('should draw a wall along the main direction and ignore a tap', () => {
    s.ui.selectTool('wall');
    s.pointer.down({ x: 1.1, y: 1.1 });
    expect(s.ui.draft().walls).toEqual([]);
    s.pointer.move({ x: 1.2, y: 3.9 });
    expect(s.ui.draft().walls).toEqual([expect.objectContaining({ x1: 1, y1: 1, x2: 1, y2: 4 })]);
    s.pointer.cancel();

    drag({ x: 1.1, y: 1.1 }, { x: 4.2, y: 1.6 });
    expect(s.layout.layout().walls).toEqual([
      expect.objectContaining({ x1: 1, y1: 1, x2: 4, y2: 1 }),
    ]);

    drag({ x: 2, y: 2 }, { x: 2.2, y: 2.1 });
    expect(s.layout.layout().walls).toHaveLength(1);
  });

  it('should place a copy on every tap with the stamp', () => {
    s.ui.toggleStamp('chest');
    s.pointer.down({ x: 1.5, y: 1.5 });
    s.pointer.down({ x: 4.5, y: 2.5 });
    expect(s.layout.layout().pieces.map((p) => [p.col, p.row])).toEqual([
      [1, 1],
      [4, 2],
    ]);
  });

  it('should select the top element and move it with a preview', () => {
    s.layout.placeElement('table', { x: 2.5, y: 2.5 });
    s.pointer.down({ x: 1.5, y: 2.5 });
    s.pointer.move({ x: 3.5, y: 3.5 });

    expect(s.ui.selection()?.kind).toBe('piece');
    expect(s.ui.draft().pieces[0]).toMatchObject({ col: 3, row: 3 });
    expect(s.layout.layout().pieces[0]).toMatchObject({ col: 1, row: 2 });

    s.pointer.up({ x: 3.5, y: 3.5 });
    expect(s.layout.layout().pieces[0]).toMatchObject({ col: 3, row: 3 });
  });

  it('should keep the layout for a tap without movement and leave free spots to panning', () => {
    s.layout.placeElement('chest', { x: 2.5, y: 2.5 });
    expect(drag({ x: 2.5, y: 2.5 })).toBe(true);
    expect(s.layout.canUndo()).toBe(true);
    s.layout.undo();
    expect(s.layout.canUndo()).toBe(false);

    expect(s.pointer.down({ x: 8.5, y: 6.5 })).toBe(false);
    expect(s.ui.selection()).toBeNull();
  });

  it('should leave a library preview to the page instead of placing it on release', () => {
    s.ui.setGesture(new PlaceGesture('chest', { x: 2.5, y: 2.5 }));
    s.pointer.move({ x: 3.5, y: 2.5 });
    s.pointer.up({ x: 3.5, y: 2.5 });
    s.pointer.cancel();

    expect(s.layout.layout().pieces).toEqual([]);
    expect(s.ui.gesture()).not.toBeNull();
  });

  it('should drop the preview on cancel and ignore moves without a gesture', () => {
    s.ui.selectTool('brush');
    s.pointer.down({ x: 0.5, y: 0.5 });
    s.pointer.cancel();
    s.pointer.move({ x: 2.5, y: 0.5 });
    s.pointer.up({ x: 2.5, y: 0.5 });

    expect(s.ui.gesture()).toBeNull();
    expect(s.layout.layout().floor).toEqual({});
  });
});
