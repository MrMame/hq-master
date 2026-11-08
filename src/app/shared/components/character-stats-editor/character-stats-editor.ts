import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import {
  CharacterInfo,
  FIXED_PROPERTIES,
  FixedProperty,
} from '../../../core/models/character-info.model';
import { Card } from '../../../core/models/card.model';
import { StatField, statField, storedValue } from '../../utils/stat-bonus.util';

/** Neuer gespeicherter Zahlenwert eines Felds (bei Leben/Ruestung Grundwert plus Kartenbonus). */
export interface StatChange {
  stat: FixedProperty;
  value: number;
}

/**
 * Zahlenwerte des Charakter-Editors: eingebbar ist immer der Grundwert (blau); verändern wirkende Karten den Wert,
 * stehen darunter Bonus (grün, negativ orange) und Endwert (rot), z. B. `+30 = 50`, Quellen im Tooltip.
 * Leben/Ruestung speichern den Endwert, das Feld zeigt ihn ohne Karten. Die Felder hängen über
 * `viewProviders` am Formular des Editors, damit ungültige Werte „Übernehmen“ sperren.
 */
@Component({
  selector: 'app-character-stats-editor',
  imports: [FormsModule],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  templateUrl: './character-stats-editor.html',
  styleUrl: './character-stats-editor.css',
})
export class CharacterStatsEditor {
  /** Arbeitskopie des Editors (Leben/Ruestung laut Kartenentwurf). */
  readonly character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  /** Karten, die nach dem Übernehmen beim Charakter wirken. */
  readonly cards: InputSignal<readonly Card[]> = input<readonly Card[]>([]);
  readonly statChange: OutputEmitterRef<StatChange> = output<StatChange>();

  protected readonly fields: Signal<StatField[]> = computed(() =>
    FIXED_PROPERTIES.map((key) => statField(this.character(), this.cards(), key)),
  );

  protected change(field: StatField, value: number): void {
    this.statChange.emit({ stat: field.key, value: storedValue(field, value) });
  }
}
