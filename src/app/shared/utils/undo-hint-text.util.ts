import { CardLocation } from '../../core/models/card-location.model';

const PLACE_TEXTS: Readonly<Record<'hand' | 'drawPile' | 'discardPile' | 'bank', string>> = {
  hand: 'in die Hand genommen',
  drawPile: 'in den Nachziehstapel gelegt',
  discardPile: 'in den Ablagestapel gelegt',
  bank: 'in die Bank gelegt',
};

/** Text des Rückgängig-Hinweises, z. B. „Runenrüstung an Barbar angelegt“. */
export function undoHintText(
  cardName: string,
  to: CardLocation,
  ownerName: string | undefined,
): string {
  const owner: string = ownerName ?? 'Unbekannt';
  if (to.kind === 'equipped') return `${cardName} an ${owner} angelegt`;
  if (to.kind === 'inventory') return `${cardName} ins Inventar von ${owner} gelegt`;
  if (to.kind === 'belt') return `${cardName} in den Gürtel von ${owner} gelegt`;
  return `${cardName} ${PLACE_TEXTS[to.kind]}`;
}
