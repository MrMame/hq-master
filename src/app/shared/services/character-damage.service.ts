import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CharacterInfo } from '../../core/models/character-info.model';
import { DamageTypes } from '../../core/models/damage-types.model';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { DamageTakenDialog } from '../components/damage-taken-dialog/damage-taken-dialog';
import { DamageDialogData } from '../models/damage-dialog-data.model';
import { GameLogService } from '../../core/services/game-log/game-log.service';
import { GameTimeService } from '../../core/services/game-time/game-time.service';
import { applyDamage } from '../utils/damage.util';
import { damageEntry } from '../utils/game-log-entries.util';

/** Breit genug für zehn Spalten; auf dem Tablet (1024×768) ist das Raster ohne Scrollen bedienbar. */
export const DAMAGE_DIALOG_CONFIG: MatDialogConfig = {
  width: '40rem',
  maxWidth: '95vw',
  autoFocus: 'dialog',
};

/** Fragt den Schadenswert im Dialog ab und schreibt den getroffenen Charakter in die Spielesession. */
@Injectable({
  providedIn: 'root',
})
export class CharacterDamageService {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly charactersDb: CharactersDbService = inject(CharactersDbService);
  private readonly gameLog: GameLogService = inject(GameLogService);
  private readonly gameTimeService: GameTimeService = inject(GameTimeService);

  requestDamage(character: CharacterInfo, damageType: DamageTypes): void {
    this.dialog
      .open<DamageTakenDialog, DamageDialogData, number>(DamageTakenDialog, {
        ...DAMAGE_DIALOG_CONFIG,
        data: { characterName: character.name, damageType },
      })
      .afterClosed()
      .subscribe((value) => {
        if (value !== undefined) {
          this.charactersDb.writeCharacter(applyDamage(character, damageType, value));
          this.gameLog.append(
            damageEntry(character, damageType, value, this.gameTimeService.gameTime()),
          );
        }
      });
  }
}
