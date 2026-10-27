import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { describePersistedState } from '../../../core/session-state/testing/describe-persisted-state';
import { TOOL_STATE_KEYS } from '../../../core/session-state/tool-state-keys';
import { DungeonLayout, NEW_LAYOUT } from '../models/dungeon-layout.model';
import { createTestLayout, TEST_CATALOG } from '../testing/builder.fixtures';
import { DungeonLayoutService } from './dungeon-layout.service';
import { ElementCatalogService } from './element-catalog.service';

function createService(): DungeonLayoutService {
  TestBed.configureTestingModule({
    providers: [{ provide: ElementCatalogService, useValue: { catalog: signal(TEST_CATALOG) } }],
  });
  return TestBed.inject(DungeonLayoutService);
}

describe('DungeonLayoutService', () => {
  let service: DungeonLayoutService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    service = createService();
  });

  describePersistedState<DungeonLayoutService, DungeonLayout>('layout', {
    key: TOOL_STATE_KEYS.dungeonBuilderLayout,
    create: () => {
      TestBed.resetTestingModule();
      return createService();
    },
    read: (s) => s.layout(),
    fallback: NEW_LAYOUT,
    stored: { raw: createTestLayout(), expected: createTestLayout() },
    mutate: (s) => s.paintFloor([{ col: 1, row: 1 }], 'room'),
  });

  it('should fall back to the start layout when the stored layout is broken', () => {
    localStorage.setItem(TOOL_STATE_KEYS.dungeonBuilderLayout, JSON.stringify({ name: 1 }));
    TestBed.resetTestingModule();
    expect(createService().layout()).toEqual(NEW_LAYOUT);
  });

  it('should paint and fill the floor', () => {
    service.paintFloor([{ col: 0, row: 0 }], 'room');
    service.fillFloor({ col: 0, row: 0 }, 'corridor');
    expect(service.layout().floor).toEqual({ '0,0': 'corridor' });
  });

  it('should add walls of at least one tile only', () => {
    service.addWall({ x: 1, y: 1 }, { x: 1, y: 1 });
    expect(service.layout().walls).toEqual([]);
    service.addWall({ x: 1, y: 1 }, { x: 4, y: 1 });
    expect(service.layout().walls).toEqual([expect.objectContaining({ x1: 1, x2: 4 })]);
  });

  it('should place pieces centred on the tile and doors on the nearest edge', () => {
    service.placeElement('table', { x: 5.5, y: 4.5 });
    service.placeElement('door', { x: 3.5, y: 2.1 });
    service.placeElement('gibt-es-nicht', { x: 1, y: 1 });

    expect(service.layout().pieces).toEqual([
      expect.objectContaining({ catalogId: 'table', col: 4, row: 4, rotation: 0 }),
    ]);
    expect(service.layout().doors).toEqual([
      expect.objectContaining({ catalogId: 'door', x: 3, y: 2, rotation: 0 }),
    ]);
  });

  it('should move, rotate and remove an element', () => {
    service.placeElement('chest', { x: 1.5, y: 1.5 });
    const id: string = service.layout().pieces[0].id;

    service.moveElement({ kind: 'piece', id }, { dx: 2, dy: 0 });
    service.rotateElement({ kind: 'piece', id });
    expect(service.layout().pieces[0]).toMatchObject({ col: 3, row: 1, rotation: 90 });

    service.removeElement({ kind: 'piece', id });
    expect(service.layout().pieces).toEqual([]);
  });

  it('should resize, rename, replace and reset', () => {
    service.resize(12, 9);
    service.rename('Gruft');
    expect(service.layout()).toMatchObject({ name: 'Gruft', columns: 12, rows: 9 });

    service.replace(createTestLayout({ name: 'Geladen' }));
    expect(service.layout().name).toBe('Geladen');
    expect(service.canUndo()).toBe(false);

    service.reset();
    expect(service.layout()).toEqual(NEW_LAYOUT);
  });

  it('should undo and redo each change as one step', () => {
    expect(service.canUndo()).toBe(false);
    service.paintFloor(
      [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
      ],
      'room',
    );
    service.addWall({ x: 0, y: 0 }, { x: 3, y: 0 });

    service.undo();
    expect(service.layout().walls).toEqual([]);
    expect(service.canRedo()).toBe(true);
    service.undo();
    expect(service.layout().floor).toEqual({});
    expect(service.canUndo()).toBe(false);

    service.redo();
    service.redo();
    expect(service.layout().walls).toHaveLength(1);
    expect(service.canRedo()).toBe(false);
  });

  it('should not record a step when nothing changes or nothing is left to undo', () => {
    service.paintFloor([{ col: 0, row: 0 }], null);
    service.rename('Nur ein Name');
    expect(service.canUndo()).toBe(false);

    service.undo();
    service.redo();
    expect(service.layout().name).toBe('Nur ein Name');
  });
});
