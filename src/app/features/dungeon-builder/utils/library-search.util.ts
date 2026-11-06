import { LibraryGroup } from '../models/library-entry.model';
import { isSearching, matchesSearch } from '../../../shared/utils/text-search.util';

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
