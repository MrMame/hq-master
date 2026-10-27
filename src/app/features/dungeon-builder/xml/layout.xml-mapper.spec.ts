import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout } from '../testing/builder.fixtures';
import { readLayout, writeLayout } from './layout.xml-mapper';

function written(layout: DungeonLayout): Element {
  const root: Element = document.implementation.createDocument(
    null,
    'dungeonLayout',
    null,
  ).documentElement;
  writeLayout(root, layout);
  return root;
}

describe('layout.xml-mapper', () => {
  const layout: DungeonLayout = createTestLayout({
    name: 'Gruft',
    floor: { '3,2': 'room' },
    pieces: [{ id: 't1', catalogId: 'table', col: 1, row: 1, rotation: 180 }],
    walls: [{ id: 'w1', x1: 0, y1: 1, x2: 4, y2: 1 }],
    doors: [{ id: 'd1', catalogId: 'door', x: 2, y: 1, rotation: 90 }],
  });

  it('writes name, size and one element per floor tile, piece, wall and door', () => {
    const root: Element = written(layout);

    expect(root.getAttribute('name')).toBe('Gruft');
    expect(root.getAttribute('columns')).toBe('10');
    expect(Array.from(root.children).map((child) => child.tagName)).toEqual([
      'floor',
      'pieces',
      'walls',
      'doors',
    ]);
    expect(root.querySelector('floor > cell')?.getAttribute('floor')).toBe('room');
    expect(root.querySelector('doors > door')?.getAttribute('rotation')).toBe('90');
  });

  it('reads back the written layout', () => {
    expect(readLayout(written(layout))).toEqual(layout);
  });

  it('names the missing element of a broken file', () => {
    const root: Element = written(layout);
    root.removeChild(root.querySelector('doors')!);
    expect(() => readLayout(root)).toThrow(
      'Ungültige Layout-Datei: <doors> fehlt in <dungeonLayout>.',
    );
  });
});
