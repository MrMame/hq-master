import {
  Component,
  computed,
  input,
  InputSignal,
  linkedSignal,
  output,
  OutputEmitterRef,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CardMenuEntry, CardMenuRun } from '../../utils/card-menu-entries.util';

/** Eine Ebene des Menüs: oben ohne Überschrift, im Untermenü mit dem Namen des geöffneten Eintrags. */
interface MenuLevel {
  label: string | null;
  entries: CardMenuEntry[];
}

/**
 * Aktionsmenü des Card Viewers: Einträge mit Trennlinien zwischen Gruppen, ausgegraute mit Tooltip.
 * Ein Eintrag mit Untermenü ersetzt die Liste durch seine Einträge, „Zurück“ führt eine Ebene hinauf.
 * Die geöffneten Ebenen stehen als IDs fest und werden gegen die aktuellen Einträge aufgelöst; ein anderer
 * `cardKey` oder ein ausgeführter Eintrag führt zurück nach oben.
 */
@Component({
  selector: 'app-card-action-menu',
  imports: [],
  templateUrl: './card-action-menu.html',
  styleUrl: './card-action-menu.css',
})
export class CardActionMenu {
  readonly entries: InputSignal<readonly CardMenuEntry[]> =
    input.required<readonly CardMenuEntry[]>();
  /** Angesehene Karte; wechselt sie, schließen offene Untermenüs. */
  readonly cardKey: InputSignal<string> = input<string>('');
  /** Ein ausführbarer Eintrag wurde gewählt; ausgeführt wird im Viewer. */
  readonly run: OutputEmitterRef<CardMenuRun> = output<CardMenuRun>();

  private readonly path: WritableSignal<string[]> = linkedSignal<string, string[]>({
    source: this.cardKey,
    computation: () => [],
  });

  /** Alle Ebenen bis zur geöffneten, soweit ihre Einträge noch existieren und wählbar sind. */
  private readonly levels: Signal<MenuLevel[]> = computed(() => {
    const levels: MenuLevel[] = [{ label: null, entries: [...this.entries()] }];
    for (const id of this.path()) {
      const parent: CardMenuEntry | undefined = levels
        .at(-1)!
        .entries.find((entry) => entry.id === id && entry.disabledReason === null);
      if (!parent?.choices) break;
      levels.push({ label: parent.label, entries: parent.choices() });
    }
    return levels;
  });

  protected readonly level: Signal<MenuLevel> = computed(() => this.levels().at(-1)!);

  protected select(entry: CardMenuEntry): void {
    const open: string[] = this.path().slice(0, this.levels().length - 1);
    if (entry.choices) {
      this.path.set([...open, entry.id]);
      return;
    }
    this.path.set([]);
    if (entry.run) this.run.emit(entry.run);
  }

  protected back(): void {
    this.path.set(this.path().slice(0, this.levels().length - 2));
  }
}
