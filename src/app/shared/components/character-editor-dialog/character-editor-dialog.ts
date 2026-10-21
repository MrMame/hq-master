import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { ElementalTypes } from '../../../core/models/elemental-types.model';
import { CharacterAbilities } from '../../../core/models/character-abilities.model';
import { CHARACTER_IMAGES } from '../../../core/models/character-images.model';
import { createNewCharacter } from '../../utils/new-character.util';

/** Zahlenwerte eines Charakters, die der Editor als Eingabefeld anbietet. */
type CharacterStat = 'health' | 'armor' | 'attack' | 'defense' | 'speed';

/**
 * Systemweiter Charakter-Editor: Ohne Daten geöffnet legt er einen neuen Charakter an, sonst bearbeitet
 * er den übergebenen. „Übernehmen“ schreibt sofort in die Session, „Abbrechen“ verwirft die Arbeitskopie.
 */
@Component({
  selector: 'app-character-editor-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './character-editor-dialog.html',
  styleUrl: './character-editor-dialog.css',
})
export class CharacterEditorDialog {
  private readonly charactersDbService: CharactersDbService = inject(CharactersDbService);
  private readonly dialogRef: MatDialogRef<CharacterEditorDialog, CharacterInfo> = inject(
    MatDialogRef<CharacterEditorDialog, CharacterInfo>,
  );
  private readonly character: CharacterInfo | null = inject<CharacterInfo | null>(MAT_DIALOG_DATA);

  protected readonly title: string = this.character ? 'Charakter bearbeiten' : 'Neuer Charakter';
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

  apply(): void {
    this.charactersDbService.writeCharacter(this.draft());
    this.dialogRef.close(this.draft());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
