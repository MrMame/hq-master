import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterInfo } from '../../../../core/models/character-info.model';

/** Vollansicht eines Charakters; Änderungen werden nur ausgegeben, gespeichert wird beim Aufrufer. */
@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './character-card.html',
  styleUrl: './character-card.css',
})
export class CharacterCard {
  readonly character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  readonly characterChange: OutputEmitterRef<CharacterInfo> = output<CharacterInfo>();

  updateField(key: keyof CharacterInfo, value: number): void {
    this.characterChange.emit({ ...this.character(), [key]: value });
  }
}
