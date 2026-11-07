import { computed, inject, Injectable, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Card } from '../../../core/models/card.model';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { AssignedCard, CardRef } from '../../../core/models/deck-state.model';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { findCard } from '../../../core/services/card-deck/card-location.util';
import { slotOccupant } from '../../../core/services/card-deck/deck-assignment.util';
import { isSameCard } from '../../../core/services/card-deck/deck-state.util';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { EquipmentService } from '../../../core/services/equipment/equipment.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { AssignEquipmentDialog } from '../components/assign-equipment-dialog/assign-equipment-dialog';
import { AssignEquipmentChoice, AssignEquipmentDialogData } from '../models/assign-equipment.model';

/**
 * Ablauf im Card Manager rund um Ausrüstung: Zuweisungsdialog und Rückfrage bei belegtem Slot. Geschrieben wird über den `EquipmentService` bzw. den `CardManagerService`.
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

  /**
   * Öffnet den Dialog für eine Ausrüstungskarte von beliebigem Ort (aktiv, Stapel, Bank, Slot) und weist
   * sie nach der Auswahl zu.
   */
  async assignCard(ref: CardRef): Promise<void> {
    const card: Card | undefined = findCard(this.cardManager.state(), ref);
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
    if (!choice || !(await this.confirmReplace(assigned, ref, choice))) return;
    this.equipment.assignCard(ref, choice.characterId, choice.slot);
  }

  /** Fragt nur, wenn im Slot eine andere Karte liegt. */
  private async confirmReplace(
    assigned: AssignedCard[],
    ref: CardRef,
    { characterId, slot }: AssignEquipmentChoice,
  ): Promise<boolean> {
    const previous: AssignedCard | undefined = slotOccupant(assigned, characterId, slot);
    if (!previous || isSameCard(previous, ref)) return true;
    return this.confirmation.confirm({
      title: 'Slot belegt',
      message: `„${previous.card.name}“ in den Ablagestapel legen?`,
      confirmLabel: 'Ablegen',
    });
  }
}
