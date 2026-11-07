import { inject, Injectable, Signal } from '@angular/core';
import { CardLocation } from '../../models/card-location.model';
import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard, CardRef, DeckState, InventoryCard } from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { CardManagerService } from '../card-deck/card-manager.service';
import { findCardAt, LocatedCard, ownerOf } from '../card-deck/card-location.util';
import { slotOccupant } from '../card-deck/deck-assignment.util';
import { isSameCard, toCardRef } from '../card-deck/deck-state.util';
import { withinLimits } from '../characters/character-limits.util';
import { CharactersDbService } from '../characters/characters-db.service';
import { GameLogService } from '../game-log/game-log.service';
import { GameTimeService } from '../game-time/game-time.service';
import { cardsOf, modifiersOf } from './effective-stats.util';
import { EquipmentTransfer, transferEquipment } from './equipment-transfer.util';
import { moveEntries } from './inventory-log.util';

/** Wohin die bisherige Karte eines belegten Slots beim Anlegen kommt. */
export type DisplacedTarget = 'discardPile' | 'inventory';

/**
 * Zuweisen, Ablegen und Inventar über Deck und Charakter hinweg: Der Besitz steht im Deck
 * (`CardManagerService`), Leben und Rüstung folgen dem wirksamen Maximum, jede Bewegung kommt ins Log.
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

  /**
   * Weist eine Ausrüstungskarte von beliebigem Ort zu (Hand, Stapel, Bank, Slot oder Inventar). Der
   * bisherige Besitzer eines Slots und eine Karte im Zielslot werden zuerst abgelegt (Leben/Rüstung auf das
   * neue Maximum begrenzt), dann steigen Leben/Rüstung des Empfängers um den Bonus. Die Karte im Zielslot
   * kommt in den Ablagestapel oder (`displaced` = `inventory`) ins Inventar des Empfängers.
   * Ungültige Zuweisung → keine Änderung.
   */
  assignCard(
    ref: CardRef,
    characterId: string,
    slot: EquipmentSlot,
    displaced: DisplacedTarget = 'discardPile',
  ): void {
    const found: LocatedCard | null = findCardAt(this.cardManager.state(), ref);
    if (!this.findCharacter(characterId) || found?.card.cardType !== 'equipment') return;
    const occupant: AssignedCard | undefined = slotOccupant(this.assigned(), characterId, slot);
    if (displaced === 'inventory' && occupant && !isSameCard(occupant, ref)) {
      this.moveCard(toCardRef(occupant), { kind: 'inventory', characterId });
    }
    const before: DeckState = this.cardManager.state();
    this.cardManager.moveCard(ref, { kind: 'equipped', characterId, slot });
    const receiver: CharacterInfo | undefined = this.findCharacter(characterId);
    if (this.cardManager.state() === before || !receiver) return;
    const { location } = found;
    const transfer: EquipmentTransfer = transferEquipment({
      assigned: before.assigned,
      ref,
      card: found.card,
      giver: location.kind === 'equipped' ? this.findCharacter(location.characterId) : undefined,
      receiver,
      slot,
      now: this.gameTime.gameTime(),
      inventoryOwner:
        location.kind === 'inventory' ? this.findCharacter(location.characterId) : undefined,
    });
    transfer.characters.forEach((character) => this.charactersDb.writeCharacter(character));
    this.gameLog.append(...transfer.entries);
  }

  /**
   * Bewegt eine Karte von beliebigem Ort ans Ziel; ein Slot als Ziel weist zu (`assignCard`). Verlässt eine
   * ausgerüstete Karte dabei ihren Slot (auch ins Inventar), verliert der Besitzer den Bonus (Leben/Rüstung
   * auf das neue Maximum begrenzt). Bewegungen aus Slots und in und aus Inventaren kommen ins Log.
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
    if (giver && found.location.kind === 'equipped') {
      const remaining: AssignedCard[] = cardsOf(this.assigned(), giver.id);
      this.charactersDb.writeCharacter(withinLimits(giver, modifiersOf(remaining)));
    }
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

  private findCharacter(characterId: string): CharacterInfo | undefined {
    return this.charactersDb.characters().find((character) => character.id === characterId);
  }
}
