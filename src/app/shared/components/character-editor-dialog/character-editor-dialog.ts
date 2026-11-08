import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { CHARACTER_IMAGES } from '../../../core/models/character-images.model';
import { createNewCharacter } from '../../utils/new-character.util';
import { createRandomCharacter } from '../../utils/random-character.util';
import { ConfirmationService } from '../../services/confirmation.service';
import { CharacterConditionsEditor } from '../character-conditions-editor/character-conditions-editor';
import { GameTimeService } from '../../../core/services/game-time/game-time.service';
import { GameLogService } from '../../../core/services/game-log/game-log.service';
import { startConditions } from '../../utils/condition-draft.util';
import { conditionChangeEntries } from '../../utils/game-log-entries.util';
import { withStat } from '../../utils/character-stat.util';
import { withinLimits } from '../../../core/services/characters/character-limits.util';
import { AssignedCard, CardRef } from '../../../core/models/deck-state.model';
import { EquipmentService } from '../../../core/services/equipment/equipment.service';
import { cardsOf, modifiersOf } from '../../../core/services/equipment/effective-stats.util';
import { CharacterStatsEditor, StatChange } from '../character-stats-editor/character-stats-editor';
import { CharacterEquipmentEditor } from '../character-equipment-editor/character-equipment-editor';
import { CardViewerService } from '../../services/card-viewer.service';
import { CardDraft } from '../../models/card-action.model';
import { CharacterInventoryEditor } from '../character-inventory-editor/character-inventory-editor';
import { CharacterCardDraftService } from '../../services/character-card-draft.service';
import { DraftCards } from '../../utils/card-draft.util';

/**
 * Systemweiter Charakter-Editor: Ohne Daten geöffnet legt er einen neuen Charakter an, sonst bearbeitet
 * er den übergebenen. „Übernehmen“ schreibt sofort in die Session, „Abbrechen“ verwirft die Arbeitskopie.
 * „Entfernen“ (nur beim Bearbeiten) löscht den Charakter nach einer Rückfrage aus der Session.
 * „Zufälliger Charakter erstellen“ (nur beim Anlegen) füllt die Arbeitskopie mit Zufallswerten.
 * Beim Übernehmen werden Leben und Rüstung auf ihr wirksames Maximum begrenzt. Karten unter „Ausrüstung“
 * und „Inventar“ öffnen den Card Viewer im Entwurf; dort vorgemerkte Bewegungen wirken erst dann.
 */
@Component({
  selector: 'app-character-editor-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    CharacterConditionsEditor,
    CharacterStatsEditor,
    CharacterEquipmentEditor,
    CharacterInventoryEditor,
  ],
  host: { class: 'general-dialog' },
  providers: [CharacterCardDraftService],
  templateUrl: './character-editor-dialog.html',
  styleUrl: './character-editor-dialog.css',
})
export class CharacterEditorDialog {
  private readonly charactersDbService: CharactersDbService = inject(CharactersDbService);
  private readonly dialogRef: MatDialogRef<CharacterEditorDialog, CharacterInfo> = inject(
    MatDialogRef<CharacterEditorDialog, CharacterInfo>,
  );
  private readonly confirmation: ConfirmationService = inject(ConfirmationService);
  private readonly gameTimeService: GameTimeService = inject(GameTimeService);
  private readonly gameLog: GameLogService = inject(GameLogService);
  private readonly equipment: EquipmentService = inject(EquipmentService);
  private readonly cardViewer: CardViewerService = inject(CardViewerService);
  private readonly character: CharacterInfo | null = inject<CharacterInfo | null>(MAT_DIALOG_DATA);

  protected readonly isEditMode: boolean = this.character !== null;
  protected readonly title: string = this.isEditMode ? 'Charakter bearbeiten' : 'Neuer Charakter';
  /** Gespeicherter Name für die Rückfrage; die Arbeitskopie kann schon umbenannt sein. */
  private readonly storedName: string = this.character?.name ?? '';
  /** Arbeitskopie: Die Session ändert sich erst mit „Übernehmen“. */
  protected readonly draft: WritableSignal<CharacterInfo> = signal<CharacterInfo>(
    this.character ? { ...this.character } : createNewCharacter(),
  );

  private readonly cardDraftService: CharacterCardDraftService = inject(CharacterCardDraftService);
  /** Entwurf für den Card Viewer: Ablegen, Ins Inventar legen und Anlegen wirken erst mit „Übernehmen“. */
  private readonly cardDraft: CardDraft = this.cardDraftService.start(this.draft().id);
  /** Slot- und Inventarkarten, wie sie nach dem Übernehmen lägen. */
  protected readonly draftCards: Signal<DraftCards> = this.cardDraftService.cards;
  protected readonly images: string[] = CHARACTER_IMAGES;

  setField<K extends keyof CharacterInfo>(key: K, value: CharacterInfo[K]): void {
    this.draft.update((character) => ({ ...character, [key]: value }));
  }

  /** Beim Anlegen folgt das Maximum dem eingegebenen Startwert. */
  setStat({ stat, value }: StatChange): void {
    this.draft.update((character) => withStat(character, stat, value, !this.isEditMode));
  }

  viewCard(ref: CardRef): void {
    this.cardViewer.open(ref, { mode: 'draft', draft: this.cardDraft });
  }

  /** Nur im Neu-Modus: überschreibt die Arbeitskopie ohne Rückfrage, die ID bleibt. */
  randomize(): void {
    this.draft.set(createRandomCharacter(this.draft().id));
  }

  /**
   * Neu angekreuzte Zustände starten zur aktuellen Spielzeit. Danach laufen die vorgemerkten Kartenbewegungen
   * wie im Card Viewer (Bonus, Begrenzung, Log); Zustände kommen ins Log.
   */
  apply(): void {
    const now: Date = this.gameTimeService.gameTime();
    const current: AssignedCard[] = cardsOf(this.equipment.assigned(), this.draft().id);
    const written: CharacterInfo = {
      ...withinLimits(this.draft(), modifiersOf(current)),
      conditions: startConditions(this.draft().conditions, now),
    };
    this.charactersDbService.writeCharacter(written);
    this.cardDraftService.apply();
    const character: CharacterInfo =
      this.charactersDbService.characters().find((entry) => entry.id === written.id) ?? written;
    this.gameLog.append(
      ...conditionChangeEntries(this.character?.conditions ?? [], character, now),
    );
    this.dialogRef.close(character);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  /** Löscht anhand der ID; ungespeicherte Änderungen der Arbeitskopie werden nicht geschrieben. */
  async remove(): Promise<void> {
    const confirmed: boolean = await this.confirmation.confirm({
      title: 'Charakter entfernen',
      message: `„${this.storedName}“ wirklich entfernen?`,
      confirmLabel: 'Entfernen',
    });
    if (!confirmed) return;
    this.charactersDbService.removeCharacter(this.draft());
    this.dialogRef.close();
  }
}
