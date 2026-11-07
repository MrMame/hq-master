import {
  Component,
  computed,
  DestroyRef,
  effect,
  EffectRef,
  inject,
  Injector,
  Signal,
  TemplateRef,
  untracked,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { createGlobalPositionStrategy, createOverlayRef, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { CardActionContext } from '../../models/card-action.model';
import { CardViewerService, ViewedCard } from '../../services/card-viewer.service';
import { viewerContext } from '../../utils/card-viewer-context.util';
import { CardViewerPanel } from '../card-viewer-panel/card-viewer-panel';

/**
 * App-weiter Card Viewer, einmal im App-Template: zeigt die angesehene Karte im `CardViewerPanel` mit
 * abgedunkeltem Hintergrund über allem, auch über offenen Dialogen. Klick daneben, „Schließen“ oder Escape
 * schließen ihn, ohne die Karte zu bewegen. Den Ort bestimmt er bei jeder Änderung neu; verschwindet die Karte,
 * schließt er sich.
 */
@Component({
  selector: 'app-card-viewer',
  imports: [CardViewerPanel],
  template: `
    <ng-template #viewerTemplate>
      @if (context(); as viewed) {
        <app-card-viewer-panel [context]="viewed" (closed)="close()" />
      }
    </ng-template>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class CardViewer {
  private readonly viewer: CardViewerService = inject(CardViewerService);
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly injector: Injector = inject(Injector);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly viewerTemplate: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('viewerTemplate');
  private overlayRef: OverlayRef | null = null;

  /** Karte an ihrem aktuellen Ort; `null` ohne angesehene oder nicht mehr vorhandene Karte. */
  protected readonly context: Signal<CardActionContext | null> = computed(() => {
    const viewed: ViewedCard | null = this.viewer.viewed();
    return viewed ? viewerContext(this.cardManager.state(), viewed.ref, viewed.context) : null;
  });

  private readonly syncOverlay: EffectRef = effect(() => {
    // Auch `viewed` lesen: Eine unbekannte Karte ergibt vor und nach dem Öffnen `context` = `null`.
    const viewed: ViewedCard | null = this.viewer.viewed();
    const visible: boolean = this.context() !== null;
    untracked(() => {
      if (visible) {
        this.attach();
        return;
      }
      this.detach();
      // Karte verschwunden (Deck entfernt, Spielstand geladen) oder unbekannt: der Viewer schließt.
      if (viewed) this.viewer.close();
    });
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.detach());
  }

  protected close(): void {
    this.viewer.close();
  }

  private attach(): void {
    if (this.overlayRef) return;
    const overlayRef: OverlayRef = createOverlayRef(this.injector, {
      hasBackdrop: true,
      positionStrategy: createGlobalPositionStrategy(this.injector)
        .centerHorizontally()
        .centerVertically(),
    });
    overlayRef.backdropClick().subscribe(() => this.close());
    overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      this.close();
    });
    overlayRef.attach(new TemplatePortal(this.viewerTemplate(), this.viewContainerRef));
    this.overlayRef = overlayRef;
  }

  private detach(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
