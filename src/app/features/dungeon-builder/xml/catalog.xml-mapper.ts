import { childElements, firstChild, readNumber, readString } from '../../../shared/utils/xml.util';
import {
  CatalogAppearance,
  CatalogPiece,
  DEFAULT_APPEARANCE,
  ElementCatalog,
  PieceShape,
} from '../models/element-catalog.model';
import { TileCell } from '../models/grid.model';
import { cellKey } from '../utils/grid-geometry.util';
import { isConnected, rectangleCells } from '../utils/piece-shape.util';

/** Gemeinsame Felder aller Katalogeinträge. */
interface EntryBase {
  id: string;
  name: string;
  image: string;
}

function warnSkipped(id: string, reason: string): void {
  console.warn(`Katalog: Eintrag „${id}“ übersprungen (${reason}).`);
}

/** Liest `id`, `name` und `image`; doppelte oder unvollständige Einträge entfallen mit Warnung. */
function readBase(el: Element, ids: Set<string>): EntryBase | null {
  const id: string = readString(el, 'id').trim();
  const image: string = readString(el, 'image').trim();
  if (!id || ids.has(id)) {
    warnSkipped(id, id ? 'doppelte id' : 'fehlende id');
    return null;
  }
  if (!image) {
    warnSkipped(id, 'fehlende Grafik');
    return null;
  }
  ids.add(id);
  return { id, name: readString(el, 'name', id) || id, image };
}

/** Form aus `<cell>`-Kindern oder `width`/`height`; bei ungültiger Form der Grund als Text. */
function readShape(el: Element): PieceShape | string {
  const cellElements: Element[] = childElements(el, 'cell');
  if (cellElements.length === 0) {
    const width: number = readNumber(el, 'width', 1);
    const height: number = readNumber(el, 'height', 1);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
      return 'ungültige Größe';
    }
    return { width, height, cells: rectangleCells(width, height) };
  }
  const cells: TileCell[] = cellElements.map((c) => ({
    col: readNumber(c, 'col', -1),
    row: readNumber(c, 'row', -1),
  }));
  const cols: number[] = cells.map((c) => c.col);
  const rows: number[] = cells.map((c) => c.row);
  const unique: boolean = new Set<string>(cells.map(cellKey)).size === cells.length;
  if (Math.min(...cols) !== 0 || Math.min(...rows) !== 0 || !unique || !isConnected(cells)) {
    return 'Form nicht zusammenhängend ab 0,0';
  }
  return { width: Math.max(...cols) + 1, height: Math.max(...rows) + 1, cells };
}

function readPiece(el: Element, ids: Set<string>): CatalogPiece | null {
  const shape: PieceShape | string = readShape(el);
  if (typeof shape === 'string') {
    warnSkipped(readString(el, 'id'), shape);
    return null;
  }
  const base: EntryBase | null = readBase(el, ids);
  return base ? { ...base, ...shape } : null;
}

function readAppearance(el: Element | null): CatalogAppearance {
  if (!el) return DEFAULT_APPEARANCE;
  return {
    rockColor: readString(el, 'rockColor') || DEFAULT_APPEARANCE.rockColor,
    wallColor: readString(el, 'wallColor') || DEFAULT_APPEARANCE.wallColor,
    wallThickness: readNumber(el, 'wallThickness', DEFAULT_APPEARANCE.wallThickness),
  };
}

function readEntries(group: Element | null, name: string, ids: Set<string>): EntryBase[] {
  if (!group) return [];
  return childElements(group, name).flatMap((el) => readBase(el, ids) ?? []);
}

/** Liest den Element-Katalog (`<catalog>`); Gruppen in Datei-Reihenfolge. */
export function readCatalog(root: Element): ElementCatalog {
  const ids: Set<string> = new Set<string>();
  return {
    appearance: readAppearance(firstChild(root, 'appearance')),
    floors: readEntries(firstChild(root, 'floors'), 'floor', ids),
    doors: readEntries(firstChild(root, 'doors'), 'door', ids),
    categories: childElements(root, 'pieces').map((group) => ({
      name: readString(group, 'category', 'Elemente'),
      pieces: childElements(group, 'piece').flatMap((el) => readPiece(el, ids) ?? []),
    })),
  };
}
