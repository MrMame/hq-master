import { Component, computed, inject, model, ModelSignal, Signal } from '@angular/core';
import { BoardZoomControl } from '../../../../shared/components/board-zoom-control/board-zoom-control';
import { QuickAccessBar } from '../../../../shared/components/quick-access-bar/quick-access-bar';
import { QuickAccessButton } from '../../../../shared/components/quick-access-button/quick-access-button';
import { QuickAccessDivider } from '../../../../shared/components/quick-access-divider/quick-access-divider';
import { STRIP_TOOLS, StripToolKind } from '../../models/builder-tool.model';
import { BuilderUiService } from '../../services/builder-ui.service';
import { DungeonLayoutService } from '../../services/dungeon-layout.service';

/** Werkzeugstreifen links neben dem Plan: Werkzeuge, Rückgängig/Wiederholen und Zoom. */
@Component({
  selector: 'app-builder-tool-strip',
  imports: [BoardZoomControl, QuickAccessBar, QuickAccessButton, QuickAccessDivider],
  template: `
    <app-quick-access-bar>
      @for (tool of tools; track tool.kind) {
        <button
          appQuickAccessButton
          variant="toggle"
          [label]="tool.label"
          [title]="tool.label"
          [icon]="tool.icon"
          [active]="activeKind() === tool.kind"
          (click)="ui.selectTool(tool.kind)"
        ></button>
      }
      <app-quick-access-divider />
      <button
        appQuickAccessButton
        variant="toggle"
        label="Rückgängig"
        title="Rückgängig (Strg+Z)"
        icon="./img/undo.svg"
        [disabled]="!layoutService.canUndo()"
        (click)="layoutService.undo()"
      ></button>
      <button
        appQuickAccessButton
        variant="toggle"
        label="Wiederholen"
        title="Wiederholen (Strg+Y)"
        icon="./img/redo.svg"
        [disabled]="!layoutService.canRedo()"
        (click)="layoutService.redo()"
      ></button>
      <app-board-zoom-control [(zoom)]="zoom" />
    </app-quick-access-bar>
  `,
  styles: `
    /* Die Leiste selbst ist das Flex-Kind neben dem Plan */
    :host {
      display: contents;
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
