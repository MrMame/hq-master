import { DeckCatalogEntry } from '../../models/deck-catalog-entry.model';

function isDeckCatalogEntry(value: unknown): value is DeckCatalogEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry: Partial<Record<keyof DeckCatalogEntry, unknown>> = value;
  return (
    typeof entry.id === 'string' && typeof entry.name === 'string' && typeof entry.url === 'string'
  );
}

/** Prüft den Inhalt von `decks/index.json`; alles andere als eine Liste gültiger Einträge ist ein Fehler. */
export function readDeckCatalog(value: unknown): DeckCatalogEntry[] {
  if (!Array.isArray(value) || !value.every(isDeckCatalogEntry)) {
    throw new Error('Ungültige Deckliste');
  }
  return value.map(({ id, name, url }) => ({ id, name, url }));
}
