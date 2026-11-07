import { InjectionToken, Signal } from '@angular/core';
import { Card } from '../../core/models/card.model';
import { CardLocation } from '../../core/models/card-location.model';
import { CardRef, DeckInstance } from '../../core/models/deck-state.model';

/** `live` wirkt sofort auf die Session, `draft` nur auf den Entwurf des Charakter-Editors. */
export type CardViewerMode = 'live' | 'draft';

/** Entwurf des Charakter-Editors: Änderungen an seinen Karten wirken erst mit „Übernehmen“. */
export interface CardDraft {
  /** Charakter, dessen Karten der Entwurf bearbeitet. */
  readonly characterId: string;
  /** Karten, die beim Übernehmen in den Ablagestapel kommen. */
  readonly discarded: Signal<readonly CardRef[]>;
  discard(ref: CardRef): void;
}

/** Womit der Viewer geöffnet wurde; ohne Angabe `live`. */
export type CardViewerContext = { mode: 'live' } | { mode: 'draft'; draft: CardDraft };

/** Alles, was eine Aktion über die angesehene Karte weiß; der Ort wird bei jeder Anzeige neu bestimmt. */
export interface CardActionContext {
  card: Card;
  ref: CardRef;
  deck: DeckInstance;
  location: CardLocation;
  mode: CardViewerMode;
  /** Nur im Modus `draft` gesetzt. */
  draft: CardDraft | null;
}

/**
 * Eine Aktion im Menü des Card Viewers. Sie beschreibt sich selbst; der Viewer kennt keine einzelne Aktion.
 * `isAvailable` und `disabledReason` dürfen Signale lesen, das Menü folgt ihnen dann von selbst.
 */
export interface CardAction {
  id: string;
  label: string;
  /** Aktionen verschiedener Gruppen trennt eine Linie. */
  group: string;
  /** Kleinere Zahl steht weiter oben. */
  order: number;
  /** Modi, in denen die Aktion angeboten wird. */
  modes: readonly CardViewerMode[];
  /** Nicht verfügbar → ausgeblendet. */
  isAvailable(context: CardActionContext): boolean;
  /** Grund für eine ausgegraute Aktion (Tooltip); `null` oder fehlend = ausführbar. */
  disabledReason?(context: CardActionContext): string | null;
  run(context: CardActionContext): void | Promise<void>;
}

/** Alle registrierten Kartenaktionen; Registrierung nur über `provideCardActions(...)`. */
export const CARD_ACTIONS: InjectionToken<readonly CardAction[]> = new InjectionToken<
  readonly CardAction[]
>('CARD_ACTIONS');
