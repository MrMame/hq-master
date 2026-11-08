import { computed, inject, Injectable, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Card } from '../../core/models/card.model';
import { CardLocation, CarriedKind } from '../../core/models/card-location.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { AssignedCard, CardRef } from '../../core/models/deck-state.model';
import { EquipmentSlot } from '../../core/models/equipment.model';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { findCard } from '../../core/services/card-deck/card-location.util';
import { slotOccupant } from '../../core/services/card-deck/deck-assignment.util';
import { isSameCard } from '../../core/services/card-deck/deck-state.util';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { EquipmentService } from '../../core/services/equipment/equipment.service';
import { SlotOccupiedDialog } from '../components/slot-occupied-dialog/slot-occupied-dialog';
import { SlotOccupiedChoice, SlotOccupiedDialogData } from '../models/slot-occupied.model';

/**
 * Abläufe rund um Karten der Charaktere: Anlegen mit Rückfrage bei belegtem Slot (Gürtel, Inventar, Ablagestapel
 * oder Abbrechen) und mögliche Inventar- und Gürtelziele. Geschrieben wird über den `EquipmentService`.
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
   * Legt die Karte `characterId` in `slot` an. Liegt dort eine andere Karte, wählt der DM, wohin sie kommt
   * (Gürtel, Inventar, Ablagestapel oder Abbrechen). Ohne Charaktere oder unbekannte Karte keine Änderung.
   */
  async assignTo(ref: CardRef, characterId: string, slot: EquipmentSlot): Promise<void> {
    const card: Card | undefined = findCard(this.cardManager.state(), ref);
    if (!card || this.assignDisabledReason() !== null) return;
    const previous: AssignedCard | undefined = slotOccupant(
      this.cardManager.assigned(),
      characterId,
      slot,
    );
    const displaced: SlotOccupiedChoice | undefined =
      previous && !isSameCard(previous, ref)
        ? await this.chooseDisplaced(previous.card.name, characterId)
        : 'discardPile';
    if (displaced) this.equipment.assignCard(ref, characterId, slot, displaced);
  }

  /** Charaktere, in deren Inventar eine Karte von `location` kommen kann. */
  inventoryTargets(location: CardLocation): CharacterInfo[] {
    return this.carriedTargets(location, 'inventory');
  }

  /** Charaktere, in deren Gürtel eine Karte von `location` kommen kann. */
  beltTargets(location: CardLocation): CharacterInfo[] {
    return this.carriedTargets(location, 'belt');
  }

  /** Alle Charaktere außer dem, bei dem die Karte schon an diesem Ort liegt. */
  private carriedTargets(location: CardLocation, kind: CarriedKind): CharacterInfo[] {
    const owner: string | null = location.kind === kind ? location.characterId : null;
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
