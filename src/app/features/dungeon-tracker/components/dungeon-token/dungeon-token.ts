import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  input,
  output,
  InputSignal,
  OutputEmitterRef,
  Signal,
  viewChild,
} from '@angular/core';
import { CdkDrag, CdkDragEnd, CdkDragHandle, Point } from '@angular/cdk/drag-drop';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DungeonPosition } from '../../models/dungeon-position.model';
import { scrollIntoViewIfNeeded } from '../../utils/scroll-into-view.util';
import { CharacterStatus } from '../character-status/character-status';
import { CharacterActionBar } from '../character-action-bar/character-action-bar';

/** Kantenlänge des runden Porträts; muss zu `--space-10` in `dungeon-token.css` passen. */
export const TOKEN_PORTRAIT_SIZE_PX: number = 40;

@Component({
  selector: 'app-dungeon-token',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, CharacterStatus, CharacterActionBar],
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
  /** Kam die Markierung aus der Legende, scrollt das markierte Token ins Bild. */
  reveal: InputSignal<boolean> = input<boolean>(false);
  /** Maßstab der Spielfläche: Bildschirm-Pixel je Einheit. */
  scale: InputSignal<number> = input<number>(1);

  tokenMoved: OutputEmitterRef<{ characterId: string; col: number; row: number }> = output<{
    characterId: string;
    col: number;
    row: number;
  }>();
  tokenDoubleClicked: OutputEmitterRef<string> = output<string>();
  tokenSelected: OutputEmitterRef<string> = output<string>();

  private readonly tokenElement: Signal<ElementRef<HTMLElement>> =
    viewChild.required('tokenElement');
  private readonly actionBar: Signal<ElementRef<HTMLElement> | undefined> = viewChild(
    CharacterActionBar,
    { read: ElementRef },
  );

  /**
   * Ob gerade gezogen wurde; der Klick, mit dem ein Maus-Drag endet, markiert dann nicht.
   * Kein `(pointerdown)` zum Zurücksetzen: die zusätzliche Change Detection verhindert den CDK-Drag.
   */
  protected dragged: boolean = false;

  /** Die Porträtmitte liegt in der Feldmitte; Werteleiste und Buttons hängen darunter. */
  tokenLeft: Signal<number> = computed(
    () =>
      this.offsetX() +
      this.position().col * this.cellSize() +
      (this.cellSize() - TOKEN_PORTRAIT_SIZE_PX) / 2,
  );
  tokenTop: Signal<number> = computed(
    () =>
      this.offsetY() +
      this.position().row * this.cellSize() +
      (this.cellSize() - TOKEN_PORTRAIT_SIZE_PX) / 2,
  );

  initials: Signal<string> = computed(() => this.character().name.slice(0, 2).toUpperCase());

  constructor() {
    // Erst nach dem Rendern, damit die Menüleiste schon steht. Das Token deckt die Höhe samt Leiste
    // ab, die breitere Leiste danach ihre volle Breite.
    afterRenderEffect(() => {
      if (!this.selected() || !this.reveal()) return;
      const actionBar: HTMLElement | undefined = this.actionBar()?.nativeElement;
      scrollIntoViewIfNeeded(this.tokenElement().nativeElement, ...(actionBar ? [actionBar] : []));
    });
  }

  /** Der Klick erreicht das Spielbrett nicht, sonst höbe es die Markierung gleich wieder auf. */
  onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.dragged) this.tokenSelected.emit(this.position().characterId);
  }

  onDragEnd(event: CdkDragEnd): void {
    // Die CDK liefert die Drag-Strecke in Bildschirm-Pixeln, das Token rechnet in Einheiten.
    const dragOffset: Point = event.source.getFreeDragPosition();
    const col: number = this.fieldAt(
      this.tokenLeft() + dragOffset.x / this.scale(),
      this.offsetX(),
    );
    const row: number = this.fieldAt(this.tokenTop() + dragOffset.y / this.scale(), this.offsetY());

    event.source.reset();
    // Der abschließende Maus-Klick folgt noch in derselben Task; nach Touch kommt keiner.
    setTimeout(() => (this.dragged = false));

    this.tokenMoved.emit({ characterId: this.position().characterId, col, row });
  }

  /** Feld (Spalte bzw. Zeile), über dem die Porträtmitte liegt; nie negativ. */
  private fieldAt(portraitStart: number, gridOffset: number): number {
    const portraitCenter: number = portraitStart + TOKEN_PORTRAIT_SIZE_PX / 2;
    return Math.max(0, Math.floor((portraitCenter - gridOffset) / this.cellSize()));
  }
}
