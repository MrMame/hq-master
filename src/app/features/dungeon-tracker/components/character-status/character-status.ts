import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';

/**
 * Zustandswerte eines Charakters als `aktuell/max` (Leben rot, Rüstung blau) für Token und Legende.
 * Mit `damageable` werden die Werte zu Buttons, die die passende Schadensart melden.
 * Hintergrund und Position legt der Einbettende fest; Zustände zeigt `CharacterConditions`.
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
        <span class="character-status__health" aria-label="Leben">{{ health() }}</span>
      </button>
      <button
        type="button"
        class="character-status__button"
        aria-label="Schaden auf Rüstung"
        title="Schaden auf Rüstung"
        (click)="damageRequested.emit(damageTypes.Normal)"
      >
        <span class="character-status__armor" aria-label="Rüstung">{{ armor() }}</span>
      </button>
    } @else {
      <span class="character-status__health" aria-label="Leben" title="Leben">{{ health() }}</span>
      <span class="character-status__armor" aria-label="Rüstung" title="Rüstung">{{
        armor()
      }}</span>
    }
  `,
  styleUrl: './character-status.css',
})
export class CharacterStatus {
  character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  damageable: InputSignal<boolean> = input<boolean>(false);

  damageRequested: OutputEmitterRef<DamageTypes> = output<DamageTypes>();

  protected readonly health: Signal<string> = computed(
    () => `${this.character().health}/${this.character().maxHealth}`,
  );
  protected readonly armor: Signal<string> = computed(
    () => `${this.character().armor}/${this.character().maxArmor}`,
  );

  protected readonly damageTypes: typeof DamageTypes = DamageTypes;
}
