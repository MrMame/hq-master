import { ElementCatalog } from '../models/element-catalog.model';
import {
  DOOR_GROUP_KEY,
  FLOOR_GROUP_KEY,
  LibraryGroup,
  LibraryItem,
  RECENT_GROUP_KEY,
  ROCK_ID,
} from '../models/library-entry.model';

/** Bodenarten zum Malen; „Fels“ steht immer vorn. */
export function floorGroup(catalog: ElementCatalog): LibraryGroup {
  const rock: LibraryItem = {
    id: ROCK_ID,
    name: 'Fels',
    image: '',
    size: '',
    label: 'Fels',
    swatch: catalog.appearance.rockColor,
  };
  const floors: LibraryItem[] = catalog.floors.map((floor) => ({
    ...floor,
    size: '',
    label: floor.name,
  }));
  return { key: FLOOR_GROUP_KEY, name: 'Boden', items: [rock, ...floors] };
}

/** Türen und Möbelgruppen in Katalog-Reihenfolge; leere Gruppen fallen weg. */
export function pieceGroups(catalog: ElementCatalog): LibraryGroup[] {
  const doors: LibraryGroup = {
    key: DOOR_GROUP_KEY,
    name: 'Türen',
    items: catalog.doors.map((door) => ({ ...door, size: '', label: door.name })),
  };
  const pieces: LibraryGroup[] = catalog.categories.map((category) => ({
    key: category.name,
    name: category.name,
    items: category.pieces.map((piece) => {
      const size: string = `${piece.width} × ${piece.height}`;
      return {
        id: piece.id,
        name: piece.name,
        image: piece.image,
        size,
        label: `${piece.name} (${size})`,
      };
    }),
  }));
  return [doors, ...pieces].filter((group) => group.items.length > 0);
}

/**
 * „Zuletzt verwendet“ in der Reihenfolge der IDs; IDs ohne Katalogeintrag fallen weg.
 * Der barrierefreie Name bekommt einen Zusatz, damit er sich vom Eintrag in seiner Gruppe unterscheidet.
 */
export function recentGroup(groups: LibraryGroup[], recentIds: string[]): LibraryGroup {
  const items: Map<string, LibraryItem> = new Map<string, LibraryItem>(
    groups.flatMap((group) => group.items).map((item) => [item.id, item]),
  );
  const recent: LibraryItem[] = recentIds
    .map((id) => items.get(id))
    .filter((item): item is LibraryItem => item !== undefined)
    .map((item) => ({ ...item, label: `${item.label} – zuletzt verwendet` }));
  return { key: RECENT_GROUP_KEY, name: 'Zuletzt verwendet', items: recent };
}
