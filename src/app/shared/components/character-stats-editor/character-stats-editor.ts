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
import { StatBonusView, statBonusView } from '../../utils/stat-bonus.util';

/** Neuer Zahlenwert eines Felds. */
export interface StatChange {
  stat: FixedProperty;
  value: number;
}

/** Ein Eingabefeld; der Name des festen Werts ist zugleich seine Beschriftung. */
interface StatRow {
  key: FixedProperty;
  bonus: StatBonusView | null;
}

/**
 * Zahlenwerte des Charakter-Editors: eingebbar ist immer der Grundwert; verändert Ausrüstung ihn, stehen
 * darunter Bonus und wirksamer Wert (`+2 = 6`, Quellen im Tooltip). Die Felder hängen über
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
  /** Arbeitskopie des Editors. */
  readonly character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  /** Karten, die nach dem Übernehmen beim Charakter wirken. */
  readonly cards: InputSignal<readonly Card[]> = input<readonly Card[]>([]);
  readonly statChange: OutputEmitterRef<StatChange> = output<StatChange>();

  protected readonly rows: Signal<StatRow[]> = computed(() =>
    FIXED_PROPERTIES.map((key) => ({
      key,
      bonus: statBonusView(this.character(), this.cards(), key),
    })),
  );
}
