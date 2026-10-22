import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { BoardToken } from '../../models/board-token.model';
import { CharacterStatus } from '../character-status/character-status';

/**
 * Ein Eintrag der Charakter-Legende: Bild, Name, Zustandswerte und Spielfeld-Position.
 * Ein Klick auf Leben oder Rüstung meldet die Schadensart (Schnellschaden ohne Markierung).
 */
@Component({
  selector: 'app-dungeon-legend-entry',
  standalone: true,
  imports: [CharacterStatus],
  template: `
    <img
      [src]="token().character.image"
      [alt]="token().character.name"
      class="legend-entry__avatar"
    />
    <span class="legend-entry__name">{{ token().character.name }}</span>
    <app-character-status
      [character]="token().character"
      [damageable]="true"
      (damageRequested)="damageRequested.emit($event)"
      class="legend-entry__status"
    />
    <span class="legend-entry__position" data-testid="token-position">
      [{{ token().position.col }},{{ token().position.row }}]
    </span>
  `,
  styleUrl: './dungeon-legend-entry.css',
})
export class DungeonLegendEntry {
  token: InputSignal<BoardToken> = input.required<BoardToken>();

  damageRequested: OutputEmitterRef<DamageTypes> = output<DamageTypes>();
}
