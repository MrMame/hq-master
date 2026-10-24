import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { ElementalTypes } from '../../../core/models/elemental-types.model';
import { CharacterAbilities } from '../../../core/models/character-abilities.model';
import { CHARACTER_IMAGES } from '../../../core/models/character-images.model';
import { createNewCharacter } from '../../utils/new-character.util';
import { createRandomCharacter } from '../../utils/random-character.util';
import { ConfirmationDialogData } from '../../models/confirmation-dialog-data.model';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';

/** Zahlenwerte eines Charakters, die der Editor als Eingabefeld anbietet. */
type CharacterStat = 'health' | 'armor' | 'attack' | 'defense' | 'speed';

/**
 * Systemweiter Charakter-Editor: Ohne Daten geöffnet legt er einen neuen Charakter an, sonst bearbeitet
 * er den übergebenen. „Übernehmen“ schreibt sofort in die Session, „Abbrechen“ verwirft die Arbeitskopie.
 * „Entfernen“ (nur beim Bearbeiten) löscht den Charakter nach einer Rückfrage aus der Session.
 * „Zufälliger Charakter erstellen“ (nur beim Anlegen) füllt die Arbeitskopie mit Zufallswerten.
 */
@Component({
  selector: 'app-character-editor-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule],
  host: { class: 'general-dialog' },
  templateUrl: './character-editor-dialog.html',
  styleUrl: './character-editor-dialog.css',
})
export class CharacterEditorDialog {
  private readonly charactersDbService: CharactersDbService = inject(CharactersDbService);
  private readonly dialogRef: MatDialogRef<CharacterEditorDialog, CharacterInfo> = inject(
    MatDialogRef<CharacterEditorDialog, CharacterInfo>,
  );
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly character: CharacterInfo | null = inject<CharacterInfo | null>(MAT_DIALOG_DATA);

  protected readonly isEditMode: boolean = this.character !== null;
  protected readonly title: string = this.isEditMode ? 'Charakter bearbeiten' : 'Neuer Charakter';
  /** Gespeicherter Name für die Rückfrage; die Arbeitskopie kann schon umbenannt sein. */
  private readonly storedName: string = this.character?.name ?? '';
  /** Arbeitskopie: Die Session ändert sich erst mit „Übernehmen“. */
  protected readonly draft: WritableSignal<CharacterInfo> = signal<CharacterInfo>(
    this.character ? { ...this.character } : createNewCharacter(),
  );

  protected readonly stats: { key: CharacterStat; label: string }[] = [
    { key: 'health', label: 'Leben' },
    { key: 'armor', label: 'Rüstung' },
    { key: 'attack', label: 'Angriff' },
    { key: 'defense', label: 'Abwehr' },
    { key: 'speed', label: 'Tempo' },
  ];
  protected readonly types: string[] = Object.values(ElementalTypes);
  protected readonly abilities: string[] = Object.values(CharacterAbilities);
  protected readonly images: string[] = CHARACTER_IMAGES;

  setField<K extends keyof CharacterInfo>(key: K, value: CharacterInfo[K]): void {
    this.draft.update((character) => ({ ...character, [key]: value }));
  }

  toggleAbility(ability: string): void {
    const abilities: string[] = this.draft().abilities;
    this.setField(
      'abilities',
      abilities.includes(ability)
        ? abilities.filter((a) => a !== ability)
        : [...abilities, ability],
    );
  }

  /** Nur im Neu-Modus: überschreibt die Arbeitskopie ohne Rückfrage, die ID bleibt. */
  randomize(): void {
    this.draft.set(createRandomCharacter(this.draft().id));
  }

  apply(): void {
    this.charactersDbService.writeCharacter(this.draft());
    this.dialogRef.close(this.draft());
  }

  cancel(): void {
    this.dialogRef.close();
  }

  /** Löscht anhand der ID; ungespeicherte Änderungen der Arbeitskopie werden nicht geschrieben. */
  async remove(): Promise<void> {
    if (!(await this.confirmRemoval())) return;
    this.charactersDbService.removeCharacter(this.draft());
    this.dialogRef.close();
  }

  private async confirmRemoval(): Promise<boolean> {
    const confirmation: MatDialogRef<ConfirmationDialog, boolean> = this.dialog.open<
      ConfirmationDialog,
      ConfirmationDialogData,
      boolean
    >(ConfirmationDialog, {
      data: {
        title: 'Charakter entfernen',
        message: `„${this.storedName}“ wirklich entfernen?`,
        confirmLabel: 'Entfernen',
      },
    });
    return (await firstValueFrom(confirmation.afterClosed())) === true;
  }
}
