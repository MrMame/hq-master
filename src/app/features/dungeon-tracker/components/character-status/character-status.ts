import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { Card } from '../../../../core/models/card.model';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { activeCardsOf } from '../../../../core/services/equipment/effective-stats.util';
import { statBreakdownOf } from '../../../../shared/utils/stat-bonus.util';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { CharacterCards } from '../character-cards/character-cards';

/**
 * Aktuelle Zustandswerte eines Charakters (Leben rot, Rüstung blau) für Token und Legende. Dahinter stehen
 * die Karten des Charakters (`CharacterCards`).
 * Mit `damageable` werden die Werte zu Buttons, die die passende Schadensart melden. Verändern wirkende Karten
 * einen Wert, nennt der Tooltip die Zusammensetzung, z. B. „Leben: 20 +30 = 50 (Kettenhemd +30)“.
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
        [title]="damageTitle('Schaden auf Leben', breakdown().Leben)"
        (click)="damageRequested.emit(damageTypes.Critical)"
      >
        <span class="character-status__leben" aria-label="Leben">{{ character().Leben }}</span>
      </button>
      <button
        type="button"
        class="character-status__button"
        aria-label="Schaden auf Rüstung"
        [title]="damageTitle('Schaden auf Rüstung', breakdown().Ruestung)"
        (click)="damageRequested.emit(damageTypes.Normal)"
      >
        <span class="character-status__ruestung" aria-label="Rüstung">{{
          character().Ruestung
        }}</span>
      </button>
    } @else {
      <span
        class="character-status__leben"
        aria-label="Leben"
        [title]="breakdown().Leben ?? 'Leben'"
        >{{ character().Leben }}</span
      >
      <span
        class="character-status__ruestung"
        aria-label="Rüstung"
        [title]="breakdown().Ruestung ?? 'Rüstung'"
        >{{ character().Ruestung }}</span
      >
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

  private readonly cardManager: CardManagerService = inject(CardManagerService);

  /** Zusammensetzung von Leben und Ruestung aus den wirkenden Karten; `null` ohne Kartenbonus. */
  protected readonly breakdown: Signal<Record<'Leben' | 'Ruestung', string | null>> = computed(
    () => {
      const character: CharacterInfo = this.character();
      const cards: Card[] = activeCardsOf(this.cardManager.state(), character.id);
      return {
        Leben: statBreakdownOf(character, cards, 'Leben'),
        Ruestung: statBreakdownOf(character, cards, 'Ruestung'),
      };
    },
  );

  protected damageTitle(action: string, breakdown: string | null): string {
    return breakdown ? `${action} – ${breakdown}` : action;
  }
}
