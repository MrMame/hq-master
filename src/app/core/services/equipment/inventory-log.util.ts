import { Card } from '../../models/card.model';
import { CardLocation } from '../../models/card-location.model';
import { CharacterInfo } from '../../models/character-info.model';
import { NewGameLogEntry } from '../../models/game-log-entry.model';
import { inventoryAddedText, inventoryRemovedText } from '../game-log/game-log-text.util';
import { equipmentEntry } from './equipment-log.util';

/** Ziel außerhalb von Slot und Inventar als Text nach „aus dem Inventar von …“. */
const DESTINATIONS: Readonly<Record<'hand' | 'drawPile' | 'discardPile' | 'bank', string>> = {
  hand: 'in die Hand',
  drawPile: 'in den Nachziehstapel',
  discardPile: 'in den Ablagestapel',
  bank: 'in die Bank',
};

/** Eine Karte kommt ins Inventar von `receiver`; `giver` hatte sie vorher (Slot oder Inventar). */
export function inventoryAddedEntry(
  receiver: CharacterInfo,
  card: Card,
  giver: CharacterInfo | undefined,
  now: Date,
): NewGameLogEntry {
  const giverName: string | null = giver && giver.id !== receiver.id ? giver.name : null;
  return {
    type: 'inventory-added',
    gameTime: now.toISOString(),
    characterId: receiver.id,
    characterName: receiver.name,
    text: inventoryAddedText(card.name, receiver.name, giverName),
  };
}

/**
 * Eine Karte verlässt das Inventar von `owner` in Richtung `target`; bei einem Slot ist `receiver` der
 * Charakter, der sie anlegt.
 */
export function inventoryRemovedEntry(
  owner: CharacterInfo,
  card: Card,
  target: Exclude<CardLocation, { kind: 'inventory' }>,
  receiver: CharacterInfo | undefined,
  now: Date,
): NewGameLogEntry {
  return {
    type: 'inventory-removed',
    gameTime: now.toISOString(),
    characterId: owner.id,
    characterName: owner.name,
    text: inventoryRemovedText(card.name, owner.name, destination(target, owner, receiver)),
  };
}

function destination(
  target: Exclude<CardLocation, { kind: 'inventory' }>,
  owner: CharacterInfo,
  receiver: CharacterInfo | undefined,
): string | null {
  if (target.kind !== 'equipped') return DESTINATIONS[target.kind];
  return receiver && receiver.id !== owner.id ? `an ${receiver.name} angelegt` : null;
}

/** Wer bei einer Bewegung abgibt und wer bekommt; Charaktere außerhalb der Session sind `undefined`. */
export interface MoveParties {
  card: Card;
  from: CardLocation;
  /** Ziel ohne Slot; ein Slot als Ziel läuft über `transferEquipment`. */
  target: Exclude<CardLocation, { kind: 'equipped' }>;
  giver: CharacterInfo | undefined;
  receiver: CharacterInfo | undefined;
  now: Date;
}

/**
 * Ein Eintrag je Bewegung: ins Inventar („… ins Inventar von …“), aus dem Inventar („… aus dem Inventar
 * von … in die Hand“) oder aus einem Slot in Hand, Stapel oder Bank („… legt … ab“). Sonst kein Eintrag.
 */
export function moveEntries(parties: MoveParties): NewGameLogEntry[] {
  const { card, from, target, giver, receiver, now } = parties;
  if (target.kind === 'inventory') {
    return receiver ? [inventoryAddedEntry(receiver, card, giver, now)] : [];
  }
  if (!giver) return [];
  if (from.kind === 'inventory')
    return [inventoryRemovedEntry(giver, card, target, undefined, now)];
  return from.kind === 'equipped' && card.cardType === 'equipment'
    ? [equipmentEntry(giver, card, null, now)]
    : [];
}
