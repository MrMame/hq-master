import {
  appendElement,
  childElements,
  readNumber,
  readString,
  requireChild,
  setAttributes,
} from '../../../shared/utils/xml.util';
import {
  DungeonLayout,
  LAYOUT_SIZE_LIMITS,
  NEW_LAYOUT,
  PlacedDoor,
  PlacedPiece,
  PlacedWall,
} from '../models/dungeon-layout.model';
import { Rotation } from '../models/rotation.model';
import { clamp } from '../utils/grid-geometry.util';

/** Dateiart in den Fehlermeldungen beim Laden. */
export const LAYOUT_FILE_KIND: string = 'Layout-Datei';

const ROTATIONS: readonly Rotation[] = [0, 90, 180, 270];

function readRotation(el: Element): Rotation {
  const value: number = readNumber(el, 'rotation');
  return ROTATIONS.find((rotation) => rotation === value) ?? 0;
}

function readSize(el: Element, name: 'columns' | 'rows'): number {
  const value: number = Math.round(readNumber(el, name, NEW_LAYOUT[name]));
  return clamp(value, LAYOUT_SIZE_LIMITS.min, LAYOUT_SIZE_LIMITS.max);
}

/** Hängt das Layout als `<dungeonLayout>`-Inhalt an `root` an (Boden, Möbel, Wände, Türen). */
export function writeLayout(root: Element, layout: DungeonLayout): void {
  setAttributes(root, { name: layout.name, columns: layout.columns, rows: layout.rows });
  const floor: Element = appendElement(root, 'floor');
  for (const [key, floorId] of Object.entries(layout.floor)) {
    const [col, row]: string[] = key.split(',');
    setAttributes(appendElement(floor, 'cell'), { col, row, floor: floorId });
  }
  const pieces: Element = appendElement(root, 'pieces');
  for (const { id, catalogId, col, row, rotation } of layout.pieces) {
    setAttributes(appendElement(pieces, 'piece'), { id, catalogId, col, row, rotation });
  }
  const walls: Element = appendElement(root, 'walls');
  for (const { id, x1, y1, x2, y2 } of layout.walls) {
    setAttributes(appendElement(walls, 'wall'), { id, x1, y1, x2, y2 });
  }
  const doors: Element = appendElement(root, 'doors');
  for (const { id, catalogId, x, y, rotation } of layout.doors) {
    setAttributes(appendElement(doors, 'door'), { id, catalogId, x, y, rotation });
  }
}

/** @throws Error, wenn ein Pflicht-Element fehlt („Ungültige Layout-Datei: …“). */
export function readLayout(root: Element): DungeonLayout {
  const floor: Record<string, string> = {};
  for (const cell of childElements(requireChild(root, 'floor', LAYOUT_FILE_KIND), 'cell')) {
    const floorId: string = readString(cell, 'floor');
    if (floorId) floor[`${readNumber(cell, 'col')},${readNumber(cell, 'row')}`] = floorId;
  }
  const children: (name: string) => Element[] = (name: string): Element[] =>
    childElements(requireChild(root, `${name}s`, LAYOUT_FILE_KIND), name);
  return {
    name: readString(root, 'name', NEW_LAYOUT.name),
    columns: readSize(root, 'columns'),
    rows: readSize(root, 'rows'),
    floor,
    pieces: children('piece').map((el): PlacedPiece => ({
      id: readString(el, 'id') || crypto.randomUUID(),
      catalogId: readString(el, 'catalogId'),
      col: readNumber(el, 'col'),
      row: readNumber(el, 'row'),
      rotation: readRotation(el),
    })),
    walls: children('wall').map((el): PlacedWall => ({
      id: readString(el, 'id') || crypto.randomUUID(),
      x1: readNumber(el, 'x1'),
      y1: readNumber(el, 'y1'),
      x2: readNumber(el, 'x2'),
      y2: readNumber(el, 'y2'),
    })),
    doors: children('door').map((el): PlacedDoor => ({
      id: readString(el, 'id') || crypto.randomUUID(),
      catalogId: readString(el, 'catalogId'),
      x: readNumber(el, 'x'),
      y: readNumber(el, 'y'),
      rotation: readRotation(el),
    })),
  };
}
