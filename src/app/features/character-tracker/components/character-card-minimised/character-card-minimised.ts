import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CharacterInfo } from '../../models/character-info.model';
import { DamageTypes } from '../../models/damage-types.model';

/** Kompakte Kartenansicht: Bild, Treffer-Buttons sowie Health und Armor. */
@Component({
  selector: 'app-character-card-minimised',
  imports: [],
  templateUrl: './character-card-minimised.html',
  styleUrl: './character-card-minimised.scss',
})
export class CharacterCardMinimised {
  readonly character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  readonly damageRequested: OutputEmitterRef<DamageTypes> = output<DamageTypes>();

  protected readonly DamageTypes: typeof DamageTypes = DamageTypes;
}
