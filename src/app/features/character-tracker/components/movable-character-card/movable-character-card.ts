import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CdkDragEnd, DragDropModule, Point } from '@angular/cdk/drag-drop';
import { CharacterCard } from '../character-card/character-card';
import { CharacterCardMinimised } from '../character-card-minimised/character-card-minimised';
import { CardLayout } from '../../models/card-layout.model';
import { CharacterInfo } from '../../models/character-info.model';
import { DamageTypes } from '../../models/damage-types.model';

/** Verschiebbare Karte mit Griffleiste; zeigt je nach Layout die kompakte oder volle Ansicht. */
@Component({
  selector: 'app-movable-character-card',
  imports: [DragDropModule, CharacterCard, CharacterCardMinimised],
  templateUrl: './movable-character-card.html',
  styleUrl: './movable-character-card.css',
})
export class MovableCharacterCard {
  readonly character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  readonly layout: InputSignal<CardLayout> = input.required<CardLayout>();
  readonly onTop: InputSignal<boolean> = input<boolean>(false);

  readonly moved: OutputEmitterRef<Point> = output<Point>();
  readonly focused: OutputEmitterRef<void> = output<void>();
  readonly minimiseToggled: OutputEmitterRef<void> = output<void>();
  readonly damageRequested: OutputEmitterRef<DamageTypes> = output<DamageTypes>();
  readonly removeRequested: OutputEmitterRef<void> = output<void>();
  readonly characterChange: OutputEmitterRef<CharacterInfo> = output<CharacterInfo>();

  protected onDragEnded(event: CdkDragEnd): void {
    this.moved.emit(event.source.getFreeDragPosition());
    // Die Position kommt danach wieder über das Layout, nicht über den CDK-Offset.
    event.source.reset();
  }
}
