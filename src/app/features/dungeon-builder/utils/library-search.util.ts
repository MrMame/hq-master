import { LibraryGroup } from '../models/library-entry.model';

function normalize(text: string): string {
  return text.trim().toLocaleLowerCase('de');
}

/** Ein Suchbegriff aus Leerzeichen zählt nicht als Suche. */
export function isSearching(term: string): boolean {
  return normalize(term) !== '';
}

/** Name enthält den Suchbegriff, ohne Rücksicht auf Groß- und Kleinschreibung. */
export function matchesSearch(name: string, term: string): boolean {
  return normalize(name).includes(normalize(term));
}

/** Nur Einträge, deren Name passt; Gruppen ohne Treffer fallen weg. Ohne Suchbegriff alle Gruppen. */
export function filterGroups(groups: LibraryGroup[], term: string): LibraryGroup[] {
  if (!isSearching(term)) return groups;
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matchesSearch(item.name, term)),
    }))
    .filter((group) => group.items.length > 0);
}
