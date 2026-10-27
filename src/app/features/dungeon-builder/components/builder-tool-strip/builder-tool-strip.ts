import { Component, computed, inject, model, ModelSignal, Signal } from '@angular/core';
import { BoardZoomControl } from '../../../../shared/components/board-zoom-control/board-zoom-control';
import { STRIP_TOOLS, StripToolKind } from '../../models/builder-tool.model';
import { BuilderUiService } from '../../services/builder-ui.service';
import { DungeonLayoutService } from '../../services/dungeon-layout.service';

/** Werkzeugstreifen links neben dem Plan: Werkzeuge, Rückgängig/Wiederholen und Zoom. */
@Component({
  selector: 'app-builder-tool-strip',
  imports: [BoardZoomControl],
  host: { class: 'general-quick-access' },
  template: `
    @for (tool of tools; track tool.kind) {
      <button
        type="button"
        class="general-quick-access__button tool-strip__button"
        [class.tool-strip__button--active]="activeKind() === tool.kind"
        [attr.aria-pressed]="activeKind() === tool.kind"
        [attr.aria-label]="tool.label"
        [title]="tool.label"
        (click)="ui.selectTool(tool.kind)"
      >
        <img [src]="tool.icon" alt="" class="tool-strip__icon" />
      </button>
    }
    <span class="tool-strip__divider" role="separator"></span>
    <button
      type="button"
      class="general-quick-access__button tool-strip__button"
      aria-label="Rückgängig"
      title="Rückgängig (Strg+Z)"
      [disabled]="!layoutService.canUndo()"
      (click)="layoutService.undo()"
    >
      <img src="./img/undo.svg" alt="" class="tool-strip__icon" />
    </button>
    <button
      type="button"
      class="general-quick-access__button tool-strip__button"
      aria-label="Wiederholen"
      title="Wiederholen (Strg+Y)"
      [disabled]="!layoutService.canRedo()"
      (click)="layoutService.redo()"
    >
      <img src="./img/redo.svg" alt="" class="tool-strip__icon" />
    </button>
    <app-board-zoom-control [(zoom)]="zoom" />
  `,
  styles: `
    :host {
      overflow-y: auto;
    }

    /* Inaktive Werkzeuge grau, das aktive gelb wie der „+“-Button im Tracker */
    .tool-strip__button {
      background-color: var(--color-gray-700);

      &:hover:not(:disabled) {
        background-color: var(--color-gray-600);
      }

      &:disabled {
        opacity: 0.4;
        cursor: default;
      }
    }

    .tool-strip__button--active {
      background-color: var(--color-yellow-500);

      &:hover:not(:disabled) {
        background-color: var(--color-yellow-400);
      }

      .tool-strip__icon {
        filter: invert(1);
      }
    }

    .tool-strip__icon {
      width: var(--space-6);
      height: var(--space-6);
    }

    .tool-strip__divider {
      width: var(--space-8);
      border-top: 1px solid var(--color-gray-600);
    }
  `,
})
export class BuilderToolStrip {
  protected readonly ui: BuilderUiService = inject(BuilderUiService);
  protected readonly layoutService: DungeonLayoutService = inject(DungeonLayoutService);
  protected readonly tools: typeof STRIP_TOOLS = STRIP_TOOLS;

  /** Zoomstufe des Plans; 1 = der ganze Plan ist sichtbar. */
  readonly zoom: ModelSignal<number> = model<number>(1);

  /** Ein Stempel zählt nicht als Werkzeug des Streifens. */
  protected readonly activeKind: Signal<StripToolKind | null> = computed(() => {
    const kind: string = this.ui.tool().kind;
    return this.tools.some((tool) => tool.kind === kind) ? (kind as StripToolKind) : null;
  });
}
