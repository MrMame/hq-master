import {
  Component,
  computed,
  input,
  output,
  InputSignal,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { CdkDrag, CdkDragEnd, CdkDragHandle, Point } from '@angular/cdk/drag-drop';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { DungeonPosition } from '../../models/dungeon-position.model';
import { CharacterStatus } from '../character-status/character-status';

@Component({
  selector: 'app-dungeon-token',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, CharacterStatus],
  templateUrl: './dungeon-token.html',
  styleUrl: './dungeon-token.css',
})
export class DungeonToken {
  position: InputSignal<DungeonPosition> = input.required<DungeonPosition>();
  character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  cellSize: InputSignal<number> = input.required<number>();
  offsetX: InputSignal<number> = input<number>(0);
  offsetY: InputSignal<number> = input<number>(0);
  selected: InputSignal<boolean> = input<boolean>(false);

  tokenMoved: OutputEmitterRef<{ characterId: string; col: number; row: number }> = output<{
    characterId: string;
    col: number;
    row: number;
  }>();
  tokenDoubleClicked: OutputEmitterRef<string> = output<string>();
  tokenSelected: OutputEmitterRef<string> = output<string>();
  damageRequested: OutputEmitterRef<DamageTypes> = output<DamageTypes>();

  protected readonly damageTypes: typeof DamageTypes = DamageTypes;

  /**
   * Ob gerade gezogen wurde; der Klick, mit dem ein Maus-Drag endet, markiert dann nicht.
   * Kein `(pointerdown)` zum Zurücksetzen: die zusätzliche Change Detection verhindert den CDK-Drag.
   */
  protected dragged: boolean = false;

  tokenLeft: Signal<number> = computed(
    () => this.offsetX() + this.position().col * this.cellSize() + 2,
  );
  tokenTop: Signal<number> = computed(
    () => this.offsetY() + this.position().row * this.cellSize() + 2,
  );

  initials: Signal<string> = computed(() => this.character().name.slice(0, 2).toUpperCase());

  /** Der Klick erreicht das Spielbrett nicht, sonst höbe es die Markierung gleich wieder auf. */
  onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.dragged) this.tokenSelected.emit(this.position().characterId);
  }

  onDragEnd(event: CdkDragEnd): void {
    const dragOffset: Point = event.source.getFreeDragPosition();
    const newPixelX: number = this.tokenLeft() + dragOffset.x;
    const newPixelY: number = this.tokenTop() + dragOffset.y;

    const col: number = Math.max(0, Math.round((newPixelX - this.offsetX()) / this.cellSize()));
    const row: number = Math.max(0, Math.round((newPixelY - this.offsetY()) / this.cellSize()));

    event.source.reset();
    // Der abschließende Maus-Klick folgt noch in derselben Task; nach Touch kommt keiner.
    setTimeout(() => (this.dragged = false));

    this.tokenMoved.emit({ characterId: this.position().characterId, col, row });
  }
}
