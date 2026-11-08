import { inject, Injectable, Signal } from '@angular/core';
import { CardLocation } from '../../models/card-location.model';
import { CharacterInfo } from '../../models/character-info.model';
import {
  AssignedCard,
  BeltCard,
  CardRef,
  DeckState,
  InventoryCard,
} from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { NewGameLogEntry } from '../../models/game-log-entry.model';
import { CardManagerService } from '../card-deck/card-manager.service';
import { findCardAt, LocatedCard, ownerOf } from '../card-deck/card-location.util';
import { slotOccupant } from '../card-deck/deck-assignment.util';
import { isSameCard, toCardRef } from '../card-deck/deck-state.util';
import { CharactersDbService } from '../characters/characters-db.service';
import { GameLogService } from '../game-log/game-log.service';
import { GameTimeService } from '../game-time/game-time.service';
import { transferEntries } from './equipment-transfer.util';
import { activeChanges } from './property-transfer.util';
import { moveEntries } from './inventory-log.util';

/** Wohin die bisherige Karte eines belegten Slots beim Anlegen kommt. */
export type DisplacedTarget = 'discardPile' | 'inventory' | 'belt';

/**
 * Zuweisen, Ablegen und Inventar über Deck und Charakter hinweg: Der Besitz steht im Deck
 * (`CardManagerService`), Leben und Rüstung folgen der Ausrüstung, jede Bewegung kommt ins Log.
 * Karten im Inventar ändern keine Werte. Kein eigener Zustand.
 */
@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly charactersDb: CharactersDbService = inject(CharactersDbService);
  private readonly gameLog: GameLogService = inject(GameLogService);
  private readonly gameTime: GameTimeService = inject(GameTimeService);

  /** Alle zugewiesenen Karten der Session. */
  readonly assigned: Signal<AssignedCard[]> = this.cardManager.assigned;
  /** Alle Inventarkarten der Session. */
  readonly inventory: Signal<InventoryCard[]> = this.cardManager.inventory;
  /** Alle Gürtelkarten der Session. */
  readonly belt: Signal<BeltCard[]> = this.cardManager.belt;

  /**
   * Legt eine Karte von beliebigem Ort in einen Slot (Hand, Stapel, Bank, Slot oder Inventar). Leben/Ruestung
   * folgen `activeChanges`: Wer die Karte abgibt und wessen Karte im Zielslot verdrängt wird, verliert ihren Wert
   * (nie unter 0), der Empfänger bekommt ihn. Die Karte im Zielslot kommt in den Ablagestapel oder
   * (`displaced` = `inventory` bzw. `belt`) in Inventar bzw. Gürtel des Empfängers.
   * Ungültige Zuweisung → keine Änderung.
   */
  assignCard(
    ref: CardRef,
    characterId: string,
    slot: EquipmentSlot,
    displaced: DisplacedTarget = 'discardPile',
  ): void {
    const found: LocatedCard | null = findCardAt(this.cardManager.state(), ref);
    if (!this.findCharacter(characterId) || !found) return;
    const occupant: AssignedCard | undefined = slotOccupant(this.assigned(), characterId, slot);
    if (displaced !== 'discardPile' && occupant && !isSameCard(occupant, ref)) {
      this.moveCard(toCardRef(occupant), { kind: displaced, characterId });
    }
    const before: DeckState = this.cardManager.state();
    this.cardManager.moveCard(ref, { kind: 'equipped', characterId, slot });
    const receiver: CharacterInfo | undefined = this.findCharacter(characterId);
    if (this.cardManager.state() === before || !receiver) return;
    this.writeActiveChanges(before);
    const { location } = found;
    const entries: NewGameLogEntry[] = transferEntries({
      assigned: before.assigned,
      ref,
      card: found.card,
      giver: location.kind === 'equipped' ? this.findCharacter(location.characterId) : undefined,
      receiver,
      slot,
      now: this.gameTime.gameTime(),
      inventoryOwner:
        location.kind === 'inventory' || location.kind === 'belt'
          ? this.findCharacter(location.characterId)
          : undefined,
      carriedFrom:
        location.kind === 'inventory' || location.kind === 'belt' ? location.kind : undefined,
    });
    this.gameLog.append(...entries);
  }

  /**
   * Bewegt eine Karte von beliebigem Ort ans Ziel; ein Slot als Ziel weist zu (`assignCard`). Wirkt die Karte
   * danach nicht mehr beim Besitzer (auch ins Inventar), verliert er ihren Wert (Leben/Ruestung nie unter 0). Bewegungen aus Slots und in und aus Inventaren kommen ins Log.
   * Ungültige Bewegung → keine Änderung.
   */
  moveCard(ref: CardRef, target: CardLocation): void {
    if (target.kind === 'equipped') {
      this.assignCard(ref, target.characterId, target.slot);
      return;
    }
    const before: DeckState = this.cardManager.state();
    const found: LocatedCard | null = findCardAt(before, ref);
    this.cardManager.moveCard(ref, target);
    if (!found || this.cardManager.state() === before) return;
    const giverId: string | undefined = ownerOf(found.location);
    const giver: CharacterInfo | undefined = giverId ? this.findCharacter(giverId) : undefined;
    this.writeActiveChanges(before);
    const receiverId: string | undefined = ownerOf(target);
    this.gameLog.append(
      ...moveEntries({
        card: found.card,
        from: found.location,
        target,
        giver,
        receiver: receiverId ? this.findCharacter(receiverId) : undefined,
        now: this.gameTime.gameTime(),
      }),
    );
  }

  /**
   * Entfernt eine Deck-Instanz samt ihren Karten; Charaktere verlieren dabei die Werte ihrer wirkenden Karten aus
   * diesem Deck an Leben/Ruestung (wie Ablegen, nie unter 0).
   */
  removeDeck(deckId: string): void {
    const before: DeckState = this.cardManager.state();
    this.cardManager.removeDeck(deckId);
    this.writeActiveChanges(before);
  }

  /** Leben/Ruestung aller Charaktere, deren wirkende Karten sich seit `before` geändert haben. */
  private writeActiveChanges(before: DeckState): void {
    activeChanges(this.charactersDb.characters(), before, this.cardManager.state()).forEach(
      (character) => this.charactersDb.writeCharacter(character),
    );
  }

  private findCharacter(characterId: string): CharacterInfo | undefined {
    return this.charactersDb.characters().find((character) => character.id === characterId);
  }
}
