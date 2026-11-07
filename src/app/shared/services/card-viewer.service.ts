import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CardRef } from '../../core/models/deck-state.model';
import { CardViewerContext } from '../models/card-action.model';

/** Die angesehene Karte: nur ihre Adresse und womit der Viewer geöffnet wurde, nie ihr Ort. */
export interface ViewedCard {
  ref: CardRef;
  context: CardViewerContext;
}

/**
 * Steuert den app-weiten Card Viewer. Ansehen bewegt nichts; der Viewer ist UI-Zustand ohne Speicherung und
 * gehört nicht zur Spielesession.
 */
@Injectable({
  providedIn: 'root',
})
export class CardViewerService {
  private readonly _viewed: WritableSignal<ViewedCard | null> = signal<ViewedCard | null>(null);
  readonly viewed: Signal<ViewedCard | null> = this._viewed.asReadonly();

  /** Zeigt die Karte; eine bisher angesehene wird ersetzt. */
  open(ref: CardRef, context: CardViewerContext = { mode: 'live' }): void {
    this._viewed.set({ ref, context });
  }

  close(): void {
    this._viewed.set(null);
  }
}
