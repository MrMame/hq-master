import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Card } from '../../../core/models/card.model';

export type CardSide = 'front' | 'back';

/**
 * Eine Karte ist genau ihre Grafik der gewählten Seite (Format 63 : 88, randlos); die App zeichnet nichts auf
 * sie. Besitzer und Herkunftsdeck stehen als Beschriftung darunter. Lässt sich die Grafik nicht laden, zeigt die
 * Karte eine neutrale Fläche, vorne mit dem Kartennamen.
 */
@Component({
  selector: 'app-card-display',
  imports: [],
  host: { '[class.card-display--captioned]': 'captioned()' },
  templateUrl: './card-display.html',
  styleUrl: './card-display.css',
})
export class CardDisplay {
  card: InputSignal<Card> = input.required<Card>();
  side: InputSignal<CardSide> = input<CardSide>('front');
  /** Name des Charakters, dem die Karte zugewiesen ist; `null` = frei. */
  owner: InputSignal<string | null> = input<string | null>(null);
  /** Name des Herkunftsdecks, z. B. im Bereich „Ausgerüstet“; `null` = ohne Hinweis. */
  origin: InputSignal<string | null> = input<string | null>(null);
  cardClick: OutputEmitterRef<string> = output<string>();

  showFront: Signal<boolean> = computed(() => this.side() === 'front');
  protected readonly src: Signal<string> = computed(() =>
    this.showFront() ? this.card().imagePath : this.card().backImagePath,
  );
  protected readonly alt: Signal<string> = computed(() =>
    this.showFront() ? this.card().name : 'Kartenrückseite',
  );
  protected readonly captioned: Signal<boolean> = computed(() => !!(this.owner() || this.origin()));

  /** Pfad, dessen Laden fehlschlug; ein neuer Pfad versucht es erneut. */
  private readonly failedSrc: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly failed: Signal<boolean> = computed(
    () => !this.src() || this.failedSrc() === this.src(),
  );

  protected markFailed(): void {
    this.failedSrc.set(this.src());
  }
}
