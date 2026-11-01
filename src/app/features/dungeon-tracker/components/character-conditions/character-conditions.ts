import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { ActiveCondition, ConditionId } from '../../../../core/models/character-condition.model';
import { conditionTemplate } from '../../../../core/models/condition-templates.model';
import { GameTimeService } from '../../../../core/services/game-time/game-time.service';
import { formatRemaining } from '../../../../shared/utils/condition-time.util';

/** Ort der Anzeige: Symbole am Token, Liste unter dem markierten Token, Zeile in der Legende. */
export type ConditionsVariant = 'token' | 'selected' | 'legend';

/** Am Token passen bei 60 px Zellgröße höchstens 3 Symbole; der Rest erscheint als „+n“. */
export const MAX_TOKEN_ICONS: number = 3;

interface ConditionView {
  id: ConditionId;
  label: string;
  icon: string;
  remaining: string;
  /** Name und Restdauer, z. B. „Gift – noch 7:30“ oder „Gift – unbegrenzt“. */
  title: string;
}

/** Aktive Zustände eines Charakters mit Restdauer, abgeleitet aus der Spielzeit. */
@Component({
  selector: 'app-character-conditions',
  host: { '[class]': '"character-conditions character-conditions--" + variant()' },
  templateUrl: './character-conditions.html',
  styleUrl: './character-conditions.css',
})
export class CharacterConditions {
  private readonly gameTimeService: GameTimeService = inject(GameTimeService);

  conditions: InputSignal<ActiveCondition[]> = input.required<ActiveCondition[]>();
  variant: InputSignal<ConditionsVariant> = input<ConditionsVariant>('token');

  private readonly views: Signal<ConditionView[]> = computed(() => {
    const now: Date = this.gameTimeService.gameTime();
    return this.conditions().map((condition) => {
      const { label, icon } = conditionTemplate(condition.id);
      const remaining: string = formatRemaining(condition, now);
      const suffix: string = remaining === 'unbegrenzt' ? remaining : `noch ${remaining}`;
      return { id: condition.id, label, icon, remaining, title: `${label} – ${suffix}` };
    });
  });

  /** Sichtbare Einträge; am Token höchstens `MAX_TOKEN_ICONS`. */
  protected readonly shown: Signal<ConditionView[]> = computed(() =>
    this.variant() === 'token' ? this.views().slice(0, MAX_TOKEN_ICONS) : this.views(),
  );

  /** Ausgeblendete Zustände am Token für „+n“ und dessen Tooltip. */
  protected readonly hidden: Signal<ConditionView[]> = computed(() =>
    this.variant() === 'token' ? this.views().slice(MAX_TOKEN_ICONS) : [],
  );

  protected readonly hiddenTitle: Signal<string> = computed(() =>
    this.hidden()
      .map((view) => view.title)
      .join(', '),
  );
}
