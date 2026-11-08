import { Card } from '../../models/card.model';
import { CardLocation, CarriedKind } from '../../models/card-location.model';
import { CharacterInfo } from '../../models/character-info.model';
import { NewGameLogEntry } from '../../models/game-log-entry.model';
import { inventoryAddedText, inventoryRemovedText } from '../game-log/game-log-text.util';
import { equipmentEntry } from './equipment-log.util';

/** Ziel außerhalb von Slot, Inventar und Gürtel als Text nach „aus dem Inventar von …“. */
const DESTINATIONS: Readonly<Record<'hand' | 'drawPile' | 'discardPile' | 'bank', string>> = {
  hand: 'in die Hand',
  drawPile: 'in den Nachziehstapel',
  discardPile: 'in den Ablagestapel',
  bank: 'in die Bank',
};

/** Ziel, wenn eine Karte Inventar oder Gürtel verlässt; in Inventar oder Gürtel gilt der Eintrag „hinein“. */
export type CarriedTarget = Exclude<CardLocation, { kind: CarriedKind }>;

/**
 * Eine Karte kommt ins Inventar (bzw. mit `container` = `belt` in den Gürtel) von `receiver`; `giver` hatte sie
 * vorher bei sich.
 */
export function inventoryAddedEntry(
  receiver: CharacterInfo,
  card: Card,
  giver: CharacterInfo | undefined,
  now: Date,
  container: CarriedKind = 'inventory',
): NewGameLogEntry {
  const giverName: string | null = giver && giver.id !== receiver.id ? giver.name : null;
  return {
    type: container === 'belt' ? 'belt-added' : 'inventory-added',
    gameTime: now.toISOString(),
    characterId: receiver.id,
    characterName: receiver.name,
    text: inventoryAddedText(card.name, receiver.name, giverName, container),
  };
}

/**
 * Eine Karte verlässt Inventar bzw. Gürtel von `owner` in Richtung `target`; bei einem Slot ist `receiver` der
 * Charakter, der sie anlegt.
 */
export function inventoryRemovedEntry(
  owner: CharacterInfo,
  card: Card,
  target: CarriedTarget,
  receiver: CharacterInfo | undefined,
  now: Date,
  container: CarriedKind = 'inventory',
): NewGameLogEntry {
  return {
    type: container === 'belt' ? 'belt-removed' : 'inventory-removed',
    gameTime: now.toISOString(),
    characterId: owner.id,
    characterName: owner.name,
    text: inventoryRemovedText(
      card.name,
      owner.name,
      destination(target, owner, receiver),
      container,
    ),
  };
}

function destination(
  target: CarriedTarget,
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
  /** Ziel ohne Slot; ein Slot als Ziel läuft über `transferEntries`. */
  target: Exclude<CardLocation, { kind: 'equipped' }>;
  giver: CharacterInfo | undefined;
  receiver: CharacterInfo | undefined;
  now: Date;
}

/**
 * Ein Eintrag je Bewegung: in Inventar oder Gürtel („… ins Inventar von …“, „… in den Gürtel von …“), aus
 * Inventar oder Gürtel („… aus dem Inventar von … in die Hand“) oder aus einem Slot in Hand, Stapel oder Bank
 * („… legt … ab“). Sonst kein Eintrag.
 */
export function moveEntries(parties: MoveParties): NewGameLogEntry[] {
  const { card, from, target, giver, receiver, now } = parties;
  if (target.kind === 'inventory' || target.kind === 'belt') {
    return receiver ? [inventoryAddedEntry(receiver, card, giver, now, target.kind)] : [];
  }
  if (!giver) return [];
  if (from.kind === 'inventory' || from.kind === 'belt') {
    return [inventoryRemovedEntry(giver, card, target, undefined, now, from.kind)];
  }
  return from.kind === 'equipped' ? [equipmentEntry(giver, card, null, now)] : [];
}
