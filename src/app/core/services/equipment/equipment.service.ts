import { inject, Injectable, Signal } from '@angular/core';
import { Card } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { ActiveCard, AssignedCard, CardRef } from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { CardManagerService } from '../card-deck/card-manager.service';
import { slotOccupant } from '../card-deck/deck-assignment.util';
import { isSameCard, toCardRef } from '../card-deck/deck-state.util';
import { CharactersDbService } from '../characters/characters-db.service';
import { withAddedEquipment, withinLimits } from '../characters/character-limits.util';
import { GameLogService } from '../game-log/game-log.service';
import { GameTimeService } from '../game-time/game-time.service';
import { cardsOf, modifiersOf } from './effective-stats.util';
import { equipmentEntry } from './equipment-log.util';

/**
 * Zuweisen und Ablegen von Ausrüstungskarten über Deck und Charakter hinweg: Der Besitz steht im Deck
 * (`CardManagerService`), Leben und Rüstung folgen dem wirksamen Maximum, beides kommt ins Log.
 * Kein eigener Zustand.
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

  /**
   * Weist die aktive Ausrüstungskarte zu. Eine Karte im Slot wird zuerst abgelegt (Leben/Rüstung auf das
   * neue Maximum begrenzt), dann steigen Leben/Rüstung um den Bonus der neuen Karte.
   */
  assignActiveCard(characterId: string, slot: EquipmentSlot): void {
    const active: ActiveCard | null = this.cardManager.state().activeCard;
    const card: Card | undefined = active?.card;
    const character: CharacterInfo | undefined = this.findCharacter(characterId);
    if (card?.cardType !== 'equipment' || !character) return;
    const own: AssignedCard[] = cardsOf(this.assigned(), characterId);
    const previous: AssignedCard | undefined = slotOccupant(own, characterId, slot);
    const kept: AssignedCard[] = own.filter((entry) => entry !== previous);
    const afterRemoval: CharacterInfo = withinLimits(character, modifiersOf(kept));
    this.charactersDb.writeCharacter(
      withAddedEquipment(afterRemoval, modifiersOf(kept), card.modifiers),
    );
    this.cardManager.assignActiveCard(characterId, slot);
    const now: Date = this.gameTime.gameTime();
    this.gameLog.append(
      ...(previous ? [equipmentEntry(character, previous.card, null, now)] : []),
      equipmentEntry(character, card, slot, now),
    );
  }

  /**
   * Legt Karten eines Charakters in den Ablagestapel. `character` ist der schon geschriebene Stand
   * (der Editor hat Leben/Rüstung mit den verbleibenden Karten begrenzt); er liefert den Namen fürs Log.
   */
  discardCards(character: CharacterInfo, refs: readonly CardRef[]): void {
    const discarded: AssignedCard[] = cardsOf(this.assigned(), character.id).filter((entry) =>
      refs.some((ref) => isSameCard(entry, ref)),
    );
    if (discarded.length === 0) return;
    this.cardManager.discardAssignedCards(discarded.map(toCardRef));
    const now: Date = this.gameTime.gameTime();
    this.gameLog.append(
      ...discarded.map((entry) => equipmentEntry(character, entry.card, null, now)),
    );
  }

  private findCharacter(characterId: string): CharacterInfo | undefined {
    return this.charactersDb.characters().find((character) => character.id === characterId);
  }
}
