import { Component, computed, input, output } from '@angular/core';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CharacterInfo } from '../../../character-tracker/models/CharacterInfo';
import { DungeonPosition } from '../../models/DungeonPosition';

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
      [title]="character()?.name ?? ''"
      class="absolute w-10 h-10 rounded-full border-2 cursor-grab active:cursor-grabbing overflow-hidden select-none z-10"
      [class]="tokenBorderClass()"
    >
      @if (character()?.image) {
        <img
          [src]="character()!.image"
          [alt]="character()!.name"
          class="w-full h-full object-cover pointer-events-none"
        >
      } @else {
        <div class="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-gray-600">
          {{ initials() }}
        </div>
      }
    </div>
  `
})
export class DungeonToken {
  position = input.required<DungeonPosition>();
  character = input<CharacterInfo | undefined>(undefined);
  cellSize = input.required<number>();
  offsetX = input<number>(0);
  offsetY = input<number>(0);

  tokenMoved = output<{ characterId: string; col: number; row: number }>();
  tokenDoubleClicked = output<string>();

  tokenLeft = computed(() => this.offsetX() + this.position().col * this.cellSize() + 2);
  tokenTop = computed(() => this.offsetY() + this.position().row * this.cellSize() + 2);

  initials = computed(() => {
    const name = this.character()?.name ?? '?';
    return name.slice(0, 2).toUpperCase();
  });

  tokenBorderClass = computed(() => {
    const name = this.character()?.name ?? '';
    // Heroes haben goldene Umrandung, Monster rote
    const isHero = name.toLowerCase().startsWith('hero');
    return isHero ? 'border-yellow-400 shadow-yellow-400/50 shadow-md' : 'border-red-500 shadow-red-500/50 shadow-md';
  });

  onDragEnd(event: CdkDragEnd): void {
    const dragOffset = event.source.getFreeDragPosition();
    const newPixelX = this.tokenLeft() + dragOffset.x;
    const newPixelY = this.tokenTop() + dragOffset.y;

    const col = Math.max(0, Math.round((newPixelX - this.offsetX()) / this.cellSize()));
    const row = Math.max(0, Math.round((newPixelY - this.offsetY()) / this.cellSize()));

    event.source.reset();

    this.tokenMoved.emit({ characterId: this.position().characterId, col, row });
  }
}
