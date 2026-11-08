import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { DeckInstance } from '../../../core/models/deck-state.model';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { EquipmentService } from '../../../core/services/equipment/equipment.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { RenameDeckDialog } from '../components/rename-deck-dialog/rename-deck-dialog';

/** Deck-Aktionen mit Rückfrage oder Dialog; geschrieben wird über `CardManagerService` bzw. `EquipmentService`. */
@Injectable({
  providedIn: 'root',
})
export class DeckActionsService {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly confirmation: ConfirmationService = inject(ConfirmationService);
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly equipment: EquipmentService = inject(EquipmentService);

  async rename(deck: DeckInstance): Promise<void> {
    const name: string | undefined = await firstValueFrom(
      this.dialog
        .open<RenameDeckDialog, string, string>(RenameDeckDialog, {
          data: deck.name,
          width: '24rem',
        })
        .afterClosed(),
    );
    if (name) this.cardManager.renameDeck(deck.id, name);
  }

  /** Nach Rückfrage verschwinden das Deck und seine Karten; Charaktere verlieren deren Leben/Ruestung. */
  async remove(deck: DeckInstance): Promise<void> {
    const confirmed: boolean = await this.confirmation.confirm({
      title: 'Deck entfernen',
      message: `„${deck.name}“ entfernen? Stapel, Bank und ausgerüstete Karten dieses Decks verschwinden.`,
      confirmLabel: 'Entfernen',
    });
    if (confirmed) this.equipment.removeDeck(deck.id);
  }
}
