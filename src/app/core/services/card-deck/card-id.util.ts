import { Card } from '../../models/card.model';

/**
 * Eindeutige IDs: Das erste Vorkommen behält seine ID, jedes weitere erhält die nächste freie Nummer als Suffix
 * (`a`, `a-2`, `a-3`, …). Frei ist eine ID, die weder in `ids` (auch weiter hinten) noch in `reserved` steht und
 * noch nicht vergeben wurde. Eine ID aus `reserved` gilt als schon vergeben.
 */
export function uniqueIds(ids: readonly string[], reserved: readonly string[] = []): string[] {
  const blocked: Set<string> = new Set<string>([...ids, ...reserved]);
  const used: Set<string> = new Set<string>(reserved);
  return ids.map((id) => {
    const next: string = used.has(id) ? nextFreeId(id, blocked) : id;
    used.add(next);
    blocked.add(next);
    return next;
  });
}

function nextFreeId(id: string, blocked: ReadonlySet<string>): string {
  let n: number = 2;
  while (blocked.has(`${id}-${n}`)) n++;
  return `${id}-${n}`;
}

/** Karten mit eindeutigen IDs nach `uniqueIds`; Karten mit unveränderter ID bleiben dasselbe Objekt. */
export function withUniqueCardIds(
  cards: readonly Card[],
  reserved: readonly string[] = [],
): Card[] {
  const ids: string[] = uniqueIds(
    cards.map((card) => card.id),
    reserved,
  );
  return cards.map((card, i) => (card.id === ids[i] ? card : { ...card, id: ids[i] }));
}

/** IDs, die mehr als einmal vorkommen, je einmal in der Reihenfolge ihres ersten Vorkommens. */
export function duplicateIds(ids: readonly string[]): string[] {
  const seen: Set<string> = new Set<string>();
  const duplicates: Set<string> = new Set<string>();
  ids.forEach((id) => (seen.has(id) ? duplicates.add(id) : seen.add(id)));
  return [...duplicates];
}
