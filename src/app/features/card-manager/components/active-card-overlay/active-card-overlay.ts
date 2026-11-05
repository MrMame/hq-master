import {
  Component,
  DestroyRef,
  effect,
  EffectRef,
  inject,
  Injector,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { createGlobalPositionStrategy, createOverlayRef, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Card } from '../../models/card.model';
import { CardDisplay } from '../card-display/card-display';

/**
 * Zeigt die aktive Karte als schwebende Ebene mittig im Fenster über der ganzen Seite.
 * Nicht modal: ohne Backdrop, nur die Karte selbst nimmt Klicks an.
 */
@Component({
  selector: 'app-active-card-overlay',
  imports: [CardDisplay],
  template: `
    <ng-template #floatingCard>
      @if (card(); as activeCard) {
        <app-card-display
          class="floating-card"
          [card]="activeCard"
          [backImagePath]="backImagePath()"
          (cardClick)="cardClick.emit()"
        />
      }
    </ng-template>
  `,
  styles: `
    :host {
      display: contents;
    }

    /* Größe nur aus dem Fenster; die Breite folgt aus aspect-ratio von card-display. */
    .floating-card {
      --floating-card-max-height: 60dvh;
      --floating-card-max-width: 30vw;
      --card-shadow: var(--shadow-card-floating);
      height: min(
        var(--floating-card-max-height),
        calc(var(--floating-card-max-width) / (var(--card-aspect-ratio)))
      );
      width: auto;
      animation: floating-card-in var(--transition-duration) var(--transition-ease);
    }

    @keyframes floating-card-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .floating-card {
        animation: none;
      }
    }
  `,
})
export class ActiveCardOverlay {
  private readonly injector: Injector = inject(Injector);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly floatingCard: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('floatingCard');
  private overlayRef: OverlayRef | null = null;

  readonly card: InputSignal<Card | null> = input.required<Card | null>();
  readonly backImagePath: InputSignal<string> = input.required<string>();
  readonly cardClick: OutputEmitterRef<void> = output<void>();

  private readonly syncOverlay: EffectRef = effect(() => {
    if (this.card()) {
      this.open();
    } else {
      this.close();
    }
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.close());
  }

  private open(): void {
    if (this.overlayRef) return;
    this.overlayRef = createOverlayRef(this.injector, {
      hasBackdrop: false,
      positionStrategy: createGlobalPositionStrategy(this.injector)
        .centerHorizontally()
        .centerVertically(),
    });
    this.overlayRef.attach(new TemplatePortal(this.floatingCard(), this.viewContainerRef));
  }

  private close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
