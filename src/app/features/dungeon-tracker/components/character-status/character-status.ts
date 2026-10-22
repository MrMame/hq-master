import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';

/**
 * Zustandswerte eines Charakters (Leben rot, Rüstung blau) für Token und Legende.
 * Mit `damageable` werden die Werte zu Buttons, die die passende Schadensart melden.
 * Hintergrund und Position legt der Einbettende fest; später kommen hier die Statuseffekte hinzu.
 */
@Component({
  selector: 'app-character-status',
  standalone: true,
  template: `
    @if (damageable()) {
      <button
        type="button"
        class="character-status__button"
        aria-label="Schaden auf Leben"
        title="Schaden auf Leben"
        (click)="damageRequested.emit(damageTypes.Critical)"
      >
        <span class="character-status__health" aria-label="Leben">{{ character().health }}</span>
      </button>
      <button
        type="button"
        class="character-status__button"
        aria-label="Schaden auf Rüstung"
        title="Schaden auf Rüstung"
        (click)="damageRequested.emit(damageTypes.Normal)"
      >
        <span class="character-status__armor" aria-label="Rüstung">{{ character().armor }}</span>
      </button>
    } @else {
      <span class="character-status__health" aria-label="Leben" title="Leben">
        {{ character().health }}
      </span>
      <span class="character-status__armor" aria-label="Rüstung" title="Rüstung">
        {{ character().armor }}
      </span>
    }
  `,
  styleUrl: './character-status.css',
})
export class CharacterStatus {
  character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  damageable: InputSignal<boolean> = input<boolean>(false);

  damageRequested: OutputEmitterRef<DamageTypes> = output<DamageTypes>();

  protected readonly damageTypes: typeof DamageTypes = DamageTypes;
}
