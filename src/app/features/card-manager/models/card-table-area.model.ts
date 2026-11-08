/** Bereiche im Hauptbereich des Card Managers, von oben nach unten. */
export type CardTableAreaKey = 'hand' | 'equipped' | 'inventory' | 'belt' | 'decks';

/** Anzahl je Bereich: Karten bzw. beim Spieltisch die Decks. */
export type CardTableAreaCounts = Readonly<Record<CardTableAreaKey, number>>;

/** Ein Bereich mit Überschrift im Hauptbereich und Eintrag in der Gruppe „Bereiche“ der Seitenleiste. */
export interface CardTableArea {
  key: CardTableAreaKey;
  /** Überschrift im Hauptbereich und Name der Region, z. B. „Hand des Dungeon Masters“. */
  title: string;
  /** Kurzer Name in der Seitenleiste, z. B. „Hand“. */
  navLabel: string;
  /** Abschnitts-ID für den gespeicherten Klappzustand, Bereich `card-manager-table`. */
  sectionId: string;
  /** DOM-ID des Abschnitts, Ziel des Sprungs aus der Seitenleiste. */
  elementId: string;
  count: number;
  /** Grund, warum der Bereich ausgeblendet ist; `null` = sichtbar. */
  emptyReason: string | null;
}
