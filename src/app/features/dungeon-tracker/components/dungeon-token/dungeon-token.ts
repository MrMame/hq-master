import {
  Component,
  computed,
  input,
  output,
  InputSignal,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { CdkDrag, CdkDragEnd, Point } from '@angular/cdk/drag-drop';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DungeonPosition } from '../../models/dungeon-position.model';

@Component({
  selector: 'app-dungeon-token',
  standalone: true,
  imports: [CdkDrag],
  template: `
    <div
      cdkDrag
      [cdkDragFreeDragPosition]="{ x: 0, y: 0 }"
      (cdkDragEnded)="onDragEnd($event)"
      (dblclick)="tokenDoubleClicked.emit(position().characterId)"
      [style.left.px]="tokenLeft()"
      [style.top.px]="tokenTop()"
      [title]="character().name"
      class="dungeon-token"
    >
      @if (character().image) {
        <img [src]="character().image" [alt]="character().name" class="dungeon-token__image" />
      } @else {
        <div class="dungeon-token__initials">
          {{ initials() }}
        </div>
      }
    </div>
  `,
  styleUrl: './dungeon-token.css',
})
export class DungeonToken {
  position: InputSignal<DungeonPosition> = input.required<DungeonPosition>();
  character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  cellSize: InputSignal<number> = input.required<number>();
  offsetX: InputSignal<number> = input<number>(0);
  offsetY: InputSignal<number> = input<number>(0);

  tokenMoved: OutputEmitterRef<{ characterId: string; col: number; row: number }> = output<{
    characterId: string;
    col: number;
    row: number;
  }>();
  tokenDoubleClicked: OutputEmitterRef<string> = output<string>();

  tokenLeft: Signal<number> = computed(
    () => this.offsetX() + this.position().col * this.cellSize() + 2,
  );
  tokenTop: Signal<number> = computed(
    () => this.offsetY() + this.position().row * this.cellSize() + 2,
  );

  initials: Signal<string> = computed(() => this.character().name.slice(0, 2).toUpperCase());

  onDragEnd(event: CdkDragEnd): void {
    const dragOffset: Point = event.source.getFreeDragPosition();
    const newPixelX: number = this.tokenLeft() + dragOffset.x;
    const newPixelY: number = this.tokenTop() + dragOffset.y;

    const col: number = Math.max(0, Math.round((newPixelX - this.offsetX()) / this.cellSize()));
    const row: number = Math.max(0, Math.round((newPixelY - this.offsetY()) / this.cellSize()));

    event.source.reset();

    this.tokenMoved.emit({ characterId: this.position().characterId, col, row });
  }
}
