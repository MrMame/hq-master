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
import { Card } from '../../../../core/models/card.model';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';

/**
 * Zeigt die aktive Karte als schwebende Ebene mittig im Fenster über der ganzen Seite.
 * Nicht modal: ohne Backdrop, nur die Karte selbst nimmt Klicks an. Darüber steht der Name ihres Decks,
 * unter Ausrüstungskarten „Charakter zuweisen“.
 */
@Component({
  selector: 'app-active-card-overlay',
  imports: [CardDisplay],
  template: `
    <ng-template #floatingCard>
      @if (card(); as activeCard) {
        <div class="floating-card-stack">
          @if (deckName()) {
            <span class="floating-card__deck" data-testid="active-card-deck">{{ deckName() }}</span>
          }
          <app-card-display
            class="floating-card"
            [card]="activeCard"
            [backImagePath]="backImagePath()"
            (cardClick)="cardClick.emit()"
          />
          @if (activeCard.cardType === 'equipment') {
            <!-- Der Tooltip hängt am Wrapper, weil deaktivierte Buttons in manchen Browsern keinen zeigen. -->
            <span [title]="assignDisabledReason() ?? 'Karte einem Charakter zuweisen'">
              <button
                type="button"
                class="floating-card__assign"
                [disabled]="assignDisabledReason() !== null"
                (click)="assignClick.emit()"
              >
                Charakter zuweisen
              </button>
            </span>
          }
        </div>
      }
    </ng-template>
  `,
  styleUrl: './active-card-overlay.css',
})
export class ActiveCardOverlay {
  private readonly injector: Injector = inject(Injector);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly floatingCard: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('floatingCard');
  private overlayRef: OverlayRef | null = null;

  readonly card: InputSignal<Card | null> = input.required<Card | null>();
  readonly backImagePath: InputSignal<string> = input.required<string>();
  /** Name des Decks, aus dem die Karte stammt. */
  readonly deckName: InputSignal<string> = input<string>('');
  /** Grund, warum nicht zugewiesen werden kann (z. B. keine Charaktere); `null` = Button aktiv. */
  readonly assignDisabledReason: InputSignal<string | null> = input<string | null>(null);
  readonly cardClick: OutputEmitterRef<void> = output<void>();
  /** Nur bei Ausrüstungskarten: „Charakter zuweisen“ wurde geklickt. */
  readonly assignClick: OutputEmitterRef<void> = output<void>();

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
