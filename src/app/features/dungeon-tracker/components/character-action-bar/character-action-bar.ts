import { Component, inject, input, InputSignal } from '@angular/core';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { CharacterDamageService } from '../../../../shared/services/character-damage.service';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';

/**
 * Menüleiste des markierten Charakters, gleich an Token und Legende. Die Buttons lösen ihre Befehle
 * selbst aus; ein neuer Befehl ist ein weiterer Button hier. Klicks erreichen Token und Legende nicht,
 * damit die Markierung bleibt und am Token kein Doppelklick den Editor ein zweites Mal öffnet.
 */
@Component({
  selector: 'app-character-action-bar',
  host: {
    role: 'toolbar',
    '[attr.aria-label]': '"Aktionen für " + character().name',
    '(click)': '$event.stopPropagation()',
    '(dblclick)': '$event.stopPropagation()',
  },
  template: `
    <button
      type="button"
      aria-label="Charakter editieren"
      title="Charakter editieren"
      class="character-action-bar__button character-action-bar__button--edit"
      (click)="onEdit()"
    >
      <img src="./img/edit.svg" alt="" class="character-action-bar__icon" />
    </button>
    <button
      type="button"
      aria-label="Schaden auf Leben"
      title="Schaden auf Leben"
      class="character-action-bar__button character-action-bar__button--health"
      (click)="onDamage(damageTypes.Critical)"
    >
      <img src="./img/hit-critical.svg" alt="" class="character-action-bar__icon" />
    </button>
    <button
      type="button"
      aria-label="Schaden auf Rüstung"
      title="Schaden auf Rüstung"
      class="character-action-bar__button character-action-bar__button--armor"
      (click)="onDamage(damageTypes.Normal)"
    >
      <img src="./img/hit-normal.svg" alt="" class="character-action-bar__icon" />
    </button>
  `,
  styleUrl: './character-action-bar.css',
})
export class CharacterActionBar {
  private readonly characterEditor: CharacterEditorService = inject(CharacterEditorService);
  private readonly characterDamage: CharacterDamageService = inject(CharacterDamageService);

  character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();

  protected readonly damageTypes: typeof DamageTypes = DamageTypes;

  /** Der Editor speichert selbst; Token und Legende folgen über `tokens` sofort. */
  onEdit(): void {
    this.characterEditor.openEdit(this.character());
  }

  /** Der Service schreibt den Treffer; Token und Legende folgen über `tokens` sofort. */
  onDamage(damageType: DamageTypes): void {
    this.characterDamage.requestDamage(this.character(), damageType);
  }
}
