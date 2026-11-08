import { CardLocation, PileKind } from '../../core/models/card-location.model';
import { EQUIPMENT_SLOT_LABELS } from '../../core/models/equipment.model';

const PLACE_LABELS: Readonly<Record<PileKind | 'hand', string>> = {
  hand: 'Hand',
  drawPile: 'Nachziehstapel',
  discardPile: 'Ablagestapel',
  bank: 'Bank',
};

/**
 * Ort einer Karte als Text, z. B. „Ablagestapel“, „Barbar · Linke Hand“, „Barbar · Inventar“ oder
 * „Gürtel von Barbar“.
 */
export function locationLabel(location: CardLocation, ownerName: string | undefined): string {
  if (location.kind === 'inventory') return `${ownerName ?? 'Unbekannt'} · Inventar`;
  if (location.kind === 'belt') return `Gürtel von ${ownerName ?? 'Unbekannt'}`;
  if (location.kind !== 'equipped') return PLACE_LABELS[location.kind];
  return `${ownerName ?? 'Unbekannt'} · ${EQUIPMENT_SLOT_LABELS[location.slot]}`;
}

/**
 * Zeile über der Karte im Viewer: Deck und Ort, z. B. „Monster (2) · Ablagestapel“. Im Entwurf zeigt sie
 * statt des Orts den Entwurfsstand („wird abgelegt“).
 */
export function cardViewerTitle(
  deckName: string,
  location: CardLocation,
  ownerName: string | undefined,
  discardedInDraft: boolean,
): string {
  const place: string = discardedInDraft ? 'wird abgelegt' : locationLabel(location, ownerName);
  return `${deckName} · ${place}`;
}
