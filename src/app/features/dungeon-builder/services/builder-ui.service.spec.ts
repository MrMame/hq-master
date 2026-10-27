import { PlaceGesture } from '../gestures/place.gesture';
import { BuilderServices, setupBuilderServices } from '../testing/builder-services.fixtures';
import { DEFAULT_FLOOR_ID } from './builder-ui.service';

describe('BuilderUiService', () => {
  let s: BuilderServices;

  beforeEach(() => {
    s = setupBuilderServices();
  });

  it('should start with the select tool, room floor and nothing selected', () => {
    expect(s.ui.tool()).toEqual({ kind: 'select' });
    expect(s.ui.floorId()).toBe(DEFAULT_FLOOR_ID);
    expect(s.ui.selection()).toBeNull();
  });

  it('should switch to the brush when a floor is chosen outside the floor tools', () => {
    s.ui.chooseFloor('corridor');
    expect(s.ui.tool()).toEqual({ kind: 'brush' });

    s.ui.selectTool('rectangle');
    s.ui.chooseFloor(null);
    expect(s.ui.tool()).toEqual({ kind: 'rectangle' });
    expect(s.ui.floorId()).toBeNull();
  });

  it('should toggle the stamp and end it with escape', () => {
    s.ui.toggleStamp('chest');
    expect(s.ui.tool()).toEqual({ kind: 'stamp', catalogId: 'chest' });
    s.ui.toggleStamp('chest');
    expect(s.ui.tool()).toEqual({ kind: 'select' });

    s.ui.toggleStamp('table');
    s.ui.toggleStamp('chest');
    expect(s.ui.tool()).toEqual({ kind: 'stamp', catalogId: 'chest' });
    s.ui.escape();
    expect(s.ui.tool()).toEqual({ kind: 'select' });
  });

  it('should drop the selection when the element disappears or another tool is chosen', () => {
    s.layout.placeElement('chest', { x: 1.5, y: 1.5 });
    const id: string = s.layout.layout().pieces[0].id;
    s.ui.select({ kind: 'piece', id });
    expect(s.ui.selection()).toEqual({ kind: 'piece', id });

    s.layout.undo();
    expect(s.ui.selection()).toBeNull();

    s.layout.redo();
    expect(s.ui.selection()).toEqual({ kind: 'piece', id });
    s.ui.selectTool('wall');
    expect(s.ui.selection()).toBeNull();
  });

  it('should keep the selection with the select tool and clear it on escape', () => {
    s.layout.placeElement('chest', { x: 1.5, y: 1.5 });
    s.ui.select({ kind: 'piece', id: s.layout.layout().pieces[0].id });
    s.ui.selectTool('select');
    expect(s.ui.selection()).not.toBeNull();
    s.ui.escape();
    expect(s.ui.selection()).toBeNull();
  });

  it('should preview a library element where it would land', () => {
    s.ui.setGesture(new PlaceGesture('door', { x: 3.5, y: 2.1 }));
    expect(s.ui.draft().doors).toEqual([expect.objectContaining({ x: 3, y: 2, rotation: 0 })]);
    expect(s.layout.layout().doors).toEqual([]);

    s.ui.setGesture(s.ui.gesture()!.move({ x: 6.5, y: 4.9 }));
    s.ui.gesture()!.commit(s.layout);
    expect(s.layout.layout().doors).toEqual([expect.objectContaining({ x: 6, y: 5 })]);
  });
});
