import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CharacterInfo } from '../../core/models/character-info.model';
import { CharacterEditorDialog } from '../components/character-editor-dialog/character-editor-dialog';

/**
 * Größe des Editors. `autoFocus: 'dialog'` fokussiert den Dialog statt des ersten Felds,
 * damit auf dem Tablet beim Öffnen keine Bildschirmtastatur aufspringt.
 */
export const CHARACTER_EDITOR_DIALOG_CONFIG: MatDialogConfig = {
  width: '36rem',
  maxWidth: '95vw',
  autoFocus: 'dialog',
};

/**
 * Öffnet den systemweiten Charakter-Editor. Der Dialog speichert und löscht selbst; das Ergebnis
 * (gespeicherter Charakter, `undefined` bei Abbruch oder Entfernen) muss nicht abonniert werden.
 */
@Injectable({
  providedIn: 'root',
})
export class CharacterEditorService {
  private readonly dialog: MatDialog = inject(MatDialog);

  openCreate(): Observable<CharacterInfo | undefined> {
    return this.open(null);
  }

  openEdit(character: CharacterInfo): Observable<CharacterInfo | undefined> {
    return this.open(character);
  }

  private open(character: CharacterInfo | null): Observable<CharacterInfo | undefined> {
    return this.dialog
      .open<CharacterEditorDialog, CharacterInfo | null, CharacterInfo>(CharacterEditorDialog, {
        ...CHARACTER_EDITOR_DIALOG_CONFIG,
        data: character,
      })
      .afterClosed();
  }
}
