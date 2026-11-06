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
