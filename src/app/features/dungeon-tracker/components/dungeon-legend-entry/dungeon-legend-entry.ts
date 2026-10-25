import {
  afterRenderEffect,
  Component,
  ElementRef,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { BoardToken } from '../../models/board-token.model';
import { scrollIntoViewIfNeeded } from '../../utils/scroll-into-view.util';
import { CharacterStatus } from '../character-status/character-status';
import { CharacterActionBar } from '../character-action-bar/character-action-bar';

/**
 * Ein Eintrag der Charakter-Legende: Bild, Name, Zustandswerte und Spielfeld-Position.
 * Ein Klick auf die Zeile schaltet die Markierung um; der markierte Eintrag zeigt die Menüleiste.
 * Ein Klick auf Leben oder Rüstung meldet die Schadensart (Schnellschaden ohne Markierung).
 */
@Component({
  selector: 'app-dungeon-legend-entry',
  standalone: true,
  imports: [CharacterStatus, CharacterActionBar],
  host: {
    '[class.legend-entry--selected]': 'selected()',
    '[attr.aria-current]': 'selected() ? "true" : null',
    '(click)': 'selectionToggled.emit()',
  },
  template: `
    <div class="legend-entry__row">
      <img
        [src]="token().character.image"
        [alt]="token().character.name"
        class="legend-entry__avatar"
      />
      <span class="legend-entry__name">{{ token().character.name }}</span>
      <!-- Schnellschaden: der Klick auf einen Wert schaltet die Markierung nicht um. -->
      <app-character-status
        [character]="token().character"
        [damageable]="true"
        (damageRequested)="damageRequested.emit($event)"
        (click)="$event.stopPropagation()"
        class="legend-entry__status"
      />
      <span class="legend-entry__position" data-testid="token-position">
        [{{ token().position.col }},{{ token().position.row }}]
      </span>
    </div>
    @if (selected()) {
      <app-character-action-bar [character]="token().character" class="legend-entry__actions" />
    }
  `,
  styleUrl: './dungeon-legend-entry.css',
})
export class DungeonLegendEntry {
  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  token: InputSignal<BoardToken> = input.required<BoardToken>();
  selected: InputSignal<boolean> = input<boolean>(false);
  /** Kam die Markierung vom Spielbrett, scrollt der markierte Eintrag in der Seitenleiste ins Bild. */
  reveal: InputSignal<boolean> = input<boolean>(false);

  damageRequested: OutputEmitterRef<DamageTypes> = output<DamageTypes>();
  selectionToggled: OutputEmitterRef<void> = output<void>();

  constructor() {
    // Erst nach dem Rendern, damit die Menüleiste schon steht und mit ins Bild scrollt.
    afterRenderEffect(() => {
      if (this.selected() && this.reveal()) scrollIntoViewIfNeeded(this.host);
    });
  }
}
