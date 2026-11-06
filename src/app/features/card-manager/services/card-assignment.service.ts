import { computed, inject, Injectable, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Card } from '../../../core/models/card.model';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { AssignedCard } from '../../../core/models/deck-state.model';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { slotOccupant } from '../../../core/services/card-deck/deck-assignment.util';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { EquipmentService } from '../../../core/services/equipment/equipment.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { AssignEquipmentDialog } from '../components/assign-equipment-dialog/assign-equipment-dialog';
import { AssignEquipmentChoice, AssignEquipmentDialogData } from '../models/assign-equipment.model';

/**
 * Ablauf im Card Manager rund um Ausrüstung: Zuweisungsdialog, Rückfrage bei belegtem Slot und vor einem
 * neuen Deck. Geschrieben wird über den `EquipmentService` bzw. den `CardManagerService`.
 */
@Injectable({
  providedIn: 'root',
})
export class CardAssignmentService {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly confirmation: ConfirmationService = inject(ConfirmationService);
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly equipment: EquipmentService = inject(EquipmentService);
  private readonly characters: Signal<CharacterInfo[]> = inject(CharactersDbService).characters;

  /** Grund für einen deaktivierten „Charakter zuweisen“-Button; `null` = zuweisbar. */
  readonly assignDisabledReason: Signal<string | null> = computed(() =>
    this.characters().length === 0 ? 'Keine Charaktere in der Session' : null,
  );

  /** Aktueller Name je Charakter-ID, damit Umbenennungen sofort auf der Karte stehen. */
  readonly ownerNames: Signal<ReadonlyMap<string, string>> = computed(
    () => new Map(this.characters().map((character) => [character.id, character.name])),
  );

  /** Öffnet den Dialog für die aktive Ausrüstungskarte und weist sie nach der Auswahl zu. */
  async assignActiveCard(): Promise<void> {
    const card: Card | null = this.cardManager.state()?.activeCard ?? null;
    if (card?.cardType !== 'equipment' || this.assignDisabledReason() !== null) return;
    const assigned: AssignedCard[] = this.cardManager.assigned();
    const choice: AssignEquipmentChoice | undefined = await firstValueFrom(
      this.dialog
        .open<AssignEquipmentDialog, AssignEquipmentDialogData, AssignEquipmentChoice>(
          AssignEquipmentDialog,
          { data: { card, characters: this.characters(), assigned }, width: '24rem' },
        )
        .afterClosed(),
    );
    if (!choice || !(await this.confirmReplace(assigned, choice))) return;
    this.equipment.assignActiveCard(choice.characterId, choice.slot);
  }

  /** Rückfrage vor dem Laden eines neuen Decks, wenn Karten zugewiesen sind (verwirft alle Zuweisungen). */
  confirmNewDeck(): Promise<boolean> {
    return this.confirmation.confirm({
      title: 'Neues Deck laden',
      message: 'Alle zugewiesenen Ausrüstungskarten werden verworfen. Neues Deck laden?',
      confirmLabel: 'Deck laden',
    });
  }

  private async confirmReplace(
    assigned: AssignedCard[],
    { characterId, slot }: AssignEquipmentChoice,
  ): Promise<boolean> {
    const previous: AssignedCard | undefined = slotOccupant(assigned, characterId, slot);
    if (!previous) return true;
    return this.confirmation.confirm({
      title: 'Slot belegt',
      message: `„${previous.card.name}“ in den Ablagestapel legen?`,
      confirmLabel: 'Ablegen',
    });
  }
}
