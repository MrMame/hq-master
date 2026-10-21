import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { AddCharacterDialog } from '../components/add-character-dialog/add-character-dialog';
import { DamageTakenDialog } from '../components/damage-taken-dialog/damage-taken-dialog';

/** Gemeinsame Größe aller Dialoge des Character Trackers. */
export const CHARACTER_DIALOG_CONFIG: MatDialogConfig = {
  width: '80vw',
  maxWidth: '80vw',
  height: '80vh',
  maxHeight: '80vh',
};

/** Öffnet die Dialoge des Character Trackers; `undefined` bedeutet Abbruch. */
@Injectable({
  providedIn: 'root',
})
export class CharacterDialogsService {
  private readonly dialog: MatDialog = inject(MatDialog);

  openAddCharacter(): Observable<CharacterInfo | undefined> {
    return this.dialog
      .open<AddCharacterDialog, void, CharacterInfo>(AddCharacterDialog, CHARACTER_DIALOG_CONFIG)
      .afterClosed();
  }

  openDamageTaken(): Observable<number | undefined> {
    return this.dialog
      .open<DamageTakenDialog, void, number>(DamageTakenDialog, CHARACTER_DIALOG_CONFIG)
      .afterClosed();
  }
}
