import { Card } from '../../models/card.model';
import { CardProperty } from '../../models/card-property.model';
import { CharacterInfo } from '../../models/character-info.model';
import { CardInDeck, isSameCard, toCardRef } from '../card-deck/deck-state.util';
import { withEquipmentChange } from '../characters/character-limits.util';
import { ActiveState, activeEntriesOf, propertiesOf } from './effective-stats.util';

function missingIn(cards: readonly CardInDeck[], others: readonly CardInDeck[]): Card[] {
  return cards
    .filter((entry) => !others.some((other) => isSameCard(other, toCardRef(entry))))
    .map((entry) => entry.card);
}

/**
 * Leben und Ruestung nach einer Kartenbewegung (statt einer Neuberechnung, damit Schaden einfach bleibt): Karten,
 * die bei einem Charakter nicht mehr wirken, senken sie um ihre Eigenschaften `Leben`/`Ruestung`, neu wirkende
 * erhöhen sie. Je Charakter und Bewegung zählt die Summe, das Ergebnis ist nie unter 0 (Ablegen kann töten; ein
 * Tausch gleichwertiger Karten ändert nichts). Ein Wechsel zwischen Slot und Gürtel desselben Charakters ändert
 * nichts. Liefert nur die Charaktere, deren wirkende Karten sich geändert haben.
 */
export function activeChanges(
  characters: readonly CharacterInfo[],
  before: ActiveState,
  after: ActiveState,
): CharacterInfo[] {
  return characters.flatMap((character) => {
    const change: CardProperty[] | null = activeChangeOf(character.id, before, after);
    return change ? [withEquipmentChange(character, change, 1)] : [];
  });
}

/**
 * Eigenschaften, um die sich die wirkenden Karten eines Charakters zwischen `before` und `after` ändern: nicht
 * mehr wirkende negativ, neu wirkende positiv. `null`, wenn sich seine wirkenden Karten nicht ändern.
 */
export function activeChangeOf(
  characterId: string,
  before: ActiveState,
  after: ActiveState,
): CardProperty[] | null {
  const was: CardInDeck[] = activeEntriesOf(before, characterId);
  const now: CardInDeck[] = activeEntriesOf(after, characterId);
  const lost: Card[] = missingIn(was, now);
  const gained: Card[] = missingIn(now, was);
  if (lost.length === 0 && gained.length === 0) return null;
  return [...propertiesOf(lost).map(negated), ...propertiesOf(gained)];
}

function negated({ name, value }: CardProperty): CardProperty {
  return { name, value: -value };
}
