import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { CharacterInfo } from '../../../../core/models/character-info.model';
import { MonsterCharacterCreatorService } from '../../services/character-creators/monster-character-creator.service';

@Component({
  selector: 'app-add-character-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './add-character-dialog.html',
  styleUrl: './add-character-dialog.css',
})
export class AddCharacterDialog {
  monstersService: MonsterCharacterCreatorService = inject(MonsterCharacterCreatorService);

  private readonly dialogRef: MatDialogRef<AddCharacterDialog, CharacterInfo> = inject(
    MatDialogRef<AddCharacterDialog, CharacterInfo>,
  );

  // Generiert das Array von 1 bis 100
  protected readonly damageOptions: number[] = Array.from({ length: 100 }, (_, i) => i + 1);

  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(): void {
    const newMonster: CharacterInfo = this.monstersService.CreateNewRandomMonster();
    this.dialogRef.close(newMonster);
  }
}
