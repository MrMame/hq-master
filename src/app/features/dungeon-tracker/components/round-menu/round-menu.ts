import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { QuickAccessButton } from '../../../../shared/components/quick-access-button/quick-access-button';
import { RoundService } from '../../../../shared/services/round.service';

/**
 * Runden-Menü der Schnellzugriffsleiste: ⏳ klappt rechts neben der Leiste ein Flyout über dem Spielbrett
 * auf. Ein erneuter Klick auf ⏳, ein Klick außerhalb oder Escape schließt es; nach „Neue Runde“ bleibt
 * es offen. Ob es offen ist, ist reiner UI-Zustand und wird nicht gespeichert.
 */
@Component({
  selector: 'app-round-menu',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, QuickAccessButton],
  template: `
    <button
      appQuickAccessButton
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      variant="toggle"
      label="Runden-Menü"
      [active]="open()"
      (click)="open.set(!open())"
    >
      ⏳
    </button>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="open.set(false)"
      (detach)="open.set(false)"
    >
      <div class="round-menu" role="group" aria-label="Runden-Menü">
        <button type="button" class="round-menu__action" (click)="roundService.startNewRound()">
          Neue Runde
        </button>
      </div>
    </ng-template>
  `,
  styles: `
    /* Der Button steht direkt in der Leiste; das Flyout hängt im Overlay-Container. */
    :host {
      display: contents;
    }

    .round-menu {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      padding: var(--space-2);
      border-radius: var(--radius-md);
      background-color: var(--color-general-sidebar);
      box-shadow: 0 4px 6px -1px color-mix(in oklab, var(--color-black) 50%, transparent);
    }

    .round-menu__action {
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
      background-color: var(--color-yellow-500);
      color: var(--color-black);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
      font-weight: var(--font-weight-bold);
      white-space: nowrap;
      cursor: pointer;

      &:hover {
        background-color: var(--color-yellow-400);
      }
    }
  `,
})
export class RoundMenu {
  protected readonly roundService: RoundService = inject(RoundService);

  /** Flyout offen; startet bei jedem Aufruf der Seite geschlossen. */
  protected readonly open: WritableSignal<boolean> = signal<boolean>(false);

  /** Rechts neben dem ⏳-Button, oben bündig; Abstand wie zwischen Leiste und Spielbrett. */
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 8 },
  ];
}
