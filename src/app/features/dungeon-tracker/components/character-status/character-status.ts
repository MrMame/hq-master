import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { CharacterCards } from '../character-cards/character-cards';

/**
 * Aktuelle Zustandswerte eines Charakters (Leben rot, Rüstung blau) für Token und Legende. Dahinter stehen
 * die Karten des Charakters (`CharacterCards`).
 * Mit `damageable` werden die Werte zu Buttons, die die passende Schadensart melden.
 * Hintergrund und Position legt der Einbettende fest; Zustände zeigt `CharacterConditions`.
 */
@Component({
  selector: 'app-character-status',
  standalone: true,
  imports: [CharacterCards],
  template: `
    @if (damageable()) {
      <button
        type="button"
        class="character-status__button"
        aria-label="Schaden auf Leben"
        title="Schaden auf Leben"
        (click)="damageRequested.emit(damageTypes.Critical)"
      >
        <span class="character-status__leben" aria-label="Leben">{{ character().Leben }}</span>
      </button>
      <button
        type="button"
        class="character-status__button"
        aria-label="Schaden auf Rüstung"
        title="Schaden auf Rüstung"
        (click)="damageRequested.emit(damageTypes.Normal)"
      >
        <span class="character-status__ruestung" aria-label="Rüstung">{{
          character().Ruestung
        }}</span>
      </button>
    } @else {
      <span class="character-status__leben" aria-label="Leben" title="Leben">{{
        character().Leben
      }}</span>
      <span class="character-status__ruestung" aria-label="Rüstung" title="Rüstung">{{
        character().Ruestung
      }}</span>
    }
    <app-character-cards [character]="character()" />
  `,
  styleUrl: './character-status.css',
})
export class CharacterStatus {
  character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  damageable: InputSignal<boolean> = input<boolean>(false);

  damageRequested: OutputEmitterRef<DamageTypes> = output<DamageTypes>();

  protected readonly damageTypes: typeof DamageTypes = DamageTypes;
}
