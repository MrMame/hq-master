import { Component, computed, inject, model, ModelSignal, Signal } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import {
  ActiveCondition,
  ConditionId,
  ConditionTemplate,
} from '../../../core/models/character-condition.model';
import { CONDITION_TEMPLATES } from '../../../core/models/condition-templates.model';
import { GameTimeService } from '../../../core/services/game-time/game-time.service';
import {
  ConditionDuration,
  conditionFromTemplate,
  isWholeNumber,
  minutesOf,
  secondsOf,
  withMinutes,
  withSeconds,
} from '../../utils/condition-draft.util';
import { formatRemaining } from '../../utils/condition-time.util';

/**
 * Abschnitt „Zustände“ des Charakter-Editors: je Vorlage eine Checkbox, beim aktiven Zustand die Werte.
 * Die Felder hängen über `viewProviders` am Formular des Editors, damit ungültige Werte „Übernehmen“
 * sperren. Ungültige Eingaben bleiben sichtbar, werden aber nicht in die Arbeitskopie geschrieben.
 */
@Component({
  selector: 'app-character-conditions-editor',
  imports: [FormsModule],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  templateUrl: './character-conditions-editor.html',
  styleUrl: './character-conditions-editor.css',
})
export class CharacterConditionsEditor {
  private readonly gameTimeService: GameTimeService = inject(GameTimeService);

  /** Zustände der Arbeitskopie. */
  conditions: ModelSignal<ActiveCondition[]> = model.required<ActiveCondition[]>();

  protected readonly templates: readonly ConditionTemplate[] = CONDITION_TEMPLATES;
  protected readonly minutesOf: (total: number) => number = minutesOf;
  protected readonly secondsOf: (total: number) => number = secondsOf;
  /** Dauer 0 = unbegrenzt, Intervall 0 = keine Wirkmomente. */
  protected readonly durationFields: { key: ConditionDuration; label: string }[] = [
    { key: 'intervalSeconds', label: 'Intervall' },
    { key: 'durationSeconds', label: 'Dauer' },
  ];

  /** Restdauer der schon gestarteten Zustände, z. B. „7:30“ oder „unbegrenzt“. */
  protected readonly remaining: Signal<Partial<Record<ConditionId, string>>> = computed(() => {
    const now: Date = this.gameTimeService.gameTime();
    return Object.fromEntries(
      this.conditions()
        .filter((condition) => condition.startedAt)
        .map((condition) => [condition.id, formatRemaining(condition, now)]),
    );
  });

  protected active(id: ConditionId): ActiveCondition | undefined {
    return this.conditions().find((condition) => condition.id === id);
  }

  /** Erneutes Ankreuzen startet mit den Werten der Vorlage neu. */
  protected toggle(template: ConditionTemplate): void {
    this.conditions.update((conditions) =>
      conditions.some((condition) => condition.id === template.id)
        ? conditions.filter((condition) => condition.id !== template.id)
        : [...conditions, conditionFromTemplate(template)],
    );
  }

  protected setMinutes(id: ConditionId, key: ConditionDuration, value: number | null): void {
    if (isWholeNumber(value)) this.patch(id, (c) => ({ [key]: withMinutes(c[key], value) }));
  }

  protected setSeconds(id: ConditionId, key: ConditionDuration, value: number | null): void {
    if (isWholeNumber(value, 59)) this.patch(id, (c) => ({ [key]: withSeconds(c[key], value) }));
  }

  protected setDamage(id: ConditionId, value: number | null): void {
    if (isWholeNumber(value)) this.patch(id, () => ({ damagePerTick: value }));
  }

  protected setDescription(id: ConditionId, description: string): void {
    this.patch(id, () => ({ description }));
  }

  private patch(
    id: ConditionId,
    change: (condition: ActiveCondition) => Partial<ActiveCondition>,
  ): void {
    this.conditions.update((conditions) =>
      conditions.map((c) => (c.id === id ? { ...c, ...change(c) } : c)),
    );
  }
}
