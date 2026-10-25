/** Markierter Charakter im Dungeon Tracker: reiner UI-Zustand, gehört nicht zur Spielesession. */
export interface CharacterSelection {
  characterId: string;
  /** Wo markiert wurde; die jeweils andere Seite scrollt den Charakter ins Bild. */
  source: 'board' | 'legend';
}
