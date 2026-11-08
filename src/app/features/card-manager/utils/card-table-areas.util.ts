import {
  CardTableArea,
  CardTableAreaCounts,
  CardTableAreaKey,
} from '../models/card-table-area.model';

/** Bereich für „alle auf-/zuklappen“ im Hauptbereich, getrennt von der Seitenleiste (`card-manager`). */
export const CARD_TABLE_SCOPE: string = 'card-manager-table';

interface AreaDefinition {
  key: CardTableAreaKey;
  title: string;
  navLabel: string;
  /** Grund für einen leeren Bereich; `null` = immer sichtbar. */
  emptyReason: string | null;
}

const AREAS: readonly AreaDefinition[] = [
  {
    key: 'hand',
    title: 'Hand des Dungeon Masters',
    navLabel: 'Hand',
    emptyReason: 'Keine Karten in der Hand',
  },
  {
    key: 'equipped',
    title: 'Ausgerüstet',
    navLabel: 'Ausgerüstet',
    emptyReason: 'Keine ausgerüsteten Karten',
  },
  {
    key: 'inventory',
    title: 'Inventar',
    navLabel: 'Inventar',
    emptyReason: 'Keine Karten im Inventar',
  },
  { key: 'belt', title: 'Gürtel', navLabel: 'Gürtel', emptyReason: 'Keine Karten im Gürtel' },
  { key: 'decks', title: 'Spieltisch', navLabel: 'Spieltisch', emptyReason: null },
];

/** Alle Bereiche in Reihenfolge des Hauptbereichs; leere (außer dem Spieltisch) mit Grund. */
export function cardTableAreas(counts: CardTableAreaCounts): CardTableArea[] {
  return AREAS.map(({ key, title, navLabel, emptyReason }) => ({
    key,
    title,
    navLabel,
    sectionId: `${CARD_TABLE_SCOPE}.${key}`,
    elementId: `card-table-area-${key}`,
    count: counts[key],
    emptyReason: emptyReason !== null && counts[key] === 0 ? emptyReason : null,
  }));
}

/** Anzahl der Karten, deren Charakter es noch gibt (wie die Gruppen in Inventar und Gürtel). */
export function ownedCount(
  cards: readonly { characterId: string }[],
  characterIds: readonly string[],
): number {
  return cards.filter((card) => characterIds.includes(card.characterId)).length;
}
