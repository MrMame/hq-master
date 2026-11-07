import { inject, Injectable, Signal } from '@angular/core';
import { Card } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard, CardRef, DeckState } from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { CardManagerService } from '../card-deck/card-manager.service';
import { findCard } from '../card-deck/card-location.util';
import { isSameCard, toCardRef } from '../card-deck/deck-state.util';
import { CharactersDbService } from '../characters/characters-db.service';
import { GameLogService } from '../game-log/game-log.service';
import { GameTimeService } from '../game-time/game-time.service';
import { cardsOf } from './effective-stats.util';
import { equipmentEntry } from './equipment-log.util';
import { EquipmentTransfer, transferEquipment } from './equipment-transfer.util';

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
   * Weist eine Ausrüstungskarte von beliebigem Ort zu (aktiv, Stapel, Bank, Slot eines Charakters). Der
   * bisherige Besitzer und eine Karte im Slot werden zuerst abgelegt (Leben/Rüstung auf das neue Maximum
   * begrenzt), dann steigen Leben/Rüstung des Empfängers um den Bonus. Ungültige Zuweisung → keine Änderung.
   */
  assignCard(ref: CardRef, characterId: string, slot: EquipmentSlot): void {
    const receiver: CharacterInfo | undefined = this.findCharacter(characterId);
    const before: DeckState = this.cardManager.state();
    const card: Card | undefined = findCard(before, ref);
    if (!receiver || card?.cardType !== 'equipment') return;
    this.cardManager.moveCard(ref, { kind: 'equipped', characterId, slot });
    if (this.cardManager.state() === before) return;
    const giverId: string | undefined = before.assigned.find((entry) =>
      isSameCard(entry, ref),
    )?.characterId;
    const transfer: EquipmentTransfer = transferEquipment({
      assigned: before.assigned,
      ref,
      card,
      giver: giverId === undefined ? undefined : this.findCharacter(giverId),
      receiver,
      slot,
      now: this.gameTime.gameTime(),
    });
    transfer.characters.forEach((character) => this.charactersDb.writeCharacter(character));
    this.gameLog.append(...transfer.entries);
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
