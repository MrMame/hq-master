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
import { CharacterInfo } from '../../../core/models/character-info.model';
import { AssignedCard } from '../../../core/models/deck-state.model';
import { CharacterStat } from '../../utils/character-stat.util';
import { StatBonusView, statBonusView } from '../../utils/stat-bonus.util';

/** Neuer Zahlenwert eines Felds. */
export interface StatChange {
  stat: CharacterStat;
  value: number;
}

interface StatRow {
  key: CharacterStat;
  label: string;
  bonus: StatBonusView | null;
}

const STATS: readonly { key: CharacterStat; label: string }[] = [
  { key: 'health', label: 'Leben' },
  { key: 'maxHealth', label: 'Max. Leben' },
  { key: 'armor', label: 'Rüstung' },
  { key: 'maxArmor', label: 'Max. Rüstung' },
  { key: 'attack', label: 'Angriff' },
  { key: 'defense', label: 'Abwehr' },
  { key: 'speed', label: 'Tempo' },
];

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
  /** Karten, die beim Übernehmen am Charakter bleiben. */
  readonly cards: InputSignal<readonly AssignedCard[]> = input<readonly AssignedCard[]>([]);
  readonly statChange: OutputEmitterRef<StatChange> = output<StatChange>();

  protected readonly rows: Signal<StatRow[]> = computed(() =>
    STATS.map((stat) => ({
      ...stat,
      bonus: statBonusView(this.character(), this.cards(), stat.key),
    })),
  );
}
