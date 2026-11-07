import { computed, inject, Injectable, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Card } from '../../core/models/card.model';
import { CardLocation } from '../../core/models/card-location.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { AssignedCard, CardRef } from '../../core/models/deck-state.model';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { findCard } from '../../core/services/card-deck/card-location.util';
import { slotOccupant } from '../../core/services/card-deck/deck-assignment.util';
import { isSameCard } from '../../core/services/card-deck/deck-state.util';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { EquipmentService } from '../../core/services/equipment/equipment.service';
import { AssignEquipmentDialog } from '../components/assign-equipment-dialog/assign-equipment-dialog';
import { GiveToInventoryDialog } from '../components/give-to-inventory-dialog/give-to-inventory-dialog';
import { SlotOccupiedDialog } from '../components/slot-occupied-dialog/slot-occupied-dialog';
import { AssignEquipmentChoice, AssignEquipmentDialogData } from '../models/assign-equipment.model';
import { GiveToInventoryDialogData } from '../models/give-to-inventory.model';
import { SlotOccupiedChoice, SlotOccupiedDialogData } from '../models/slot-occupied.model';

/**
 * Abläufe rund um Karten der Charaktere: Zuweisungsdialog, Rückfrage bei belegtem Slot (Inventar,
 * Ablagestapel oder Abbrechen) und „Ins Inventar geben“. Geschrieben wird über den `EquipmentService`.
 */
@Injectable({
  providedIn: 'root',
})
export class CardAssignmentService {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly equipment: EquipmentService = inject(EquipmentService);
  readonly characters: Signal<CharacterInfo[]> = inject(CharactersDbService).characters;

  /** Grund für deaktiviertes „anlegen“ bzw. „ins Inventar geben“; `null` = möglich. */
  readonly assignDisabledReason: Signal<string | null> = computed(() =>
    this.characters().length === 0 ? 'Keine Charaktere in der Session' : null,
  );

  /** Aktueller Name je Charakter-ID, damit Umbenennungen sofort auf der Karte stehen. */
  readonly ownerNames: Signal<ReadonlyMap<string, string>> = computed(
    () => new Map(this.characters().map((character) => [character.id, character.name])),
  );

  /**
   * Öffnet den Dialog für eine Ausrüstungskarte von beliebigem Ort (Hand, Stapel, Bank, Slot, Inventar) und
   * weist sie nach der Auswahl zu; bei belegtem Slot wählt der DM, wohin die bisherige Karte kommt.
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
    if (!choice) return;
    const previous: AssignedCard | undefined = slotOccupant(
      assigned,
      choice.characterId,
      choice.slot,
    );
    const displaced: SlotOccupiedChoice | undefined =
      previous && !isSameCard(previous, ref)
        ? await this.chooseDisplaced(previous.card.name, choice.characterId)
        : 'discardPile';
    if (displaced) this.equipment.assignCard(ref, choice.characterId, choice.slot, displaced);
  }

  /** Wählt den Charakter und legt die Karte in sein Inventar; der bisherige Inventarbesitzer fehlt. */
  async giveToInventory(ref: CardRef, location: CardLocation): Promise<void> {
    const card: Card | undefined = findCard(this.cardManager.state(), ref);
    const characters: CharacterInfo[] = this.inventoryTargets(location);
    if (!card || characters.length === 0) return;
    const characterId: string | undefined = await firstValueFrom(
      this.dialog
        .open<GiveToInventoryDialog, GiveToInventoryDialogData, string>(GiveToInventoryDialog, {
          data: { card, characters },
          width: '24rem',
        })
        .afterClosed(),
    );
    if (characterId) this.equipment.moveCard(ref, { kind: 'inventory', characterId });
  }

  /** Charaktere, in deren Inventar eine Karte von `location` kommen kann. */
  inventoryTargets(location: CardLocation): CharacterInfo[] {
    const owner: string | null = location.kind === 'inventory' ? location.characterId : null;
    return this.characters().filter((character) => character.id !== owner);
  }

  /** Rückfrage bei belegtem Slot; `undefined` = abgebrochen. */
  chooseDisplaced(cardName: string, characterId: string): Promise<SlotOccupiedChoice | undefined> {
    const characterName: string = this.ownerNames().get(characterId) ?? 'Unbekannt';
    return firstValueFrom(
      this.dialog
        .open<SlotOccupiedDialog, SlotOccupiedDialogData, SlotOccupiedChoice>(SlotOccupiedDialog, {
          data: { cardName, characterName },
        })
        .afterClosed(),
    );
  }
}
