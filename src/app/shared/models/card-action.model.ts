import { InjectionToken, Signal } from '@angular/core';
import { Card } from '../../core/models/card.model';
import { CardLocation } from '../../core/models/card-location.model';
import { AssignedCard, CardRef, DeckInstance } from '../../core/models/deck-state.model';
import { EquipmentSlot } from '../../core/models/equipment.model';

/** `live` wirkt sofort auf die Session, `draft` nur auf den Entwurf des Charakter-Editors. */
export type CardViewerMode = 'live' | 'draft';

/** Ziel einer Karte im Entwurf: Ablagestapel ihres Decks, Inventar oder ein Slot des bearbeiteten Charakters. */
export type DraftTarget =
  { kind: 'discardPile' } | { kind: 'inventory' } | { kind: 'equipped'; slot: EquipmentSlot };

/** Eine vorgemerkte Bewegung; beim Übernehmen laufen sie in Reihenfolge. */
export interface DraftMove {
  ref: CardRef;
  target: DraftTarget;
}

/** Entwurf des Charakter-Editors: Änderungen an seinen Karten wirken erst mit „Übernehmen“. */
export interface CardDraft {
  /** Charakter, dessen Karten der Entwurf bearbeitet. */
  readonly characterId: string;
  /** Vorgemerkte Bewegungen, je Karte nur die letzte. */
  readonly moves: Signal<readonly DraftMove[]>;
  /** Slot-Karten des Charakters laut Entwurf. */
  readonly equipped: Signal<readonly AssignedCard[]>;
  move(ref: CardRef, target: DraftTarget): void;
}

/** Womit der Viewer geöffnet wurde; ohne Angabe `live`. */
export type CardViewerContext = { mode: 'live' } | { mode: 'draft'; draft: CardDraft };

/** Alles, was eine Aktion über die angesehene Karte weiß; der Ort wird bei jeder Anzeige neu bestimmt. */
export interface CardActionContext {
  card: Card;
  ref: CardRef;
  deck: DeckInstance;
  /** Im Modus `draft` der Ort laut Entwurf. */
  location: CardLocation;
  mode: CardViewerMode;
  /** Nur im Modus `draft` gesetzt. */
  draft: CardDraft | null;
}

/** Was ein Menüeintrag beim Wählen tut: ausführen oder ein Untermenü mit weiteren Einträgen öffnen. */
export type CardMenuStep<Args extends unknown[]> =
  | { run(...args: Args): void | Promise<void>; choices?: never }
  | { choices(...args: Args): readonly CardChoice[]; run?: never };

/** Eintrag eines Untermenüs, z. B. ein Charakter oder eine Hand; darf selbst ein Untermenü öffnen. */
export type CardChoice = {
  id: string;
  label: string;
  /** Grund für einen ausgegrauten Eintrag; fehlend oder `null` = wählbar. */
  disabledReason?: string | null;
} & CardMenuStep<[]>;

/** Beschreibung einer Aktion; was sie tut, legt `CardMenuStep` fest. */
export interface CardActionInfo {
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
}

/**
 * Eine Aktion im Menü des Card Viewers. Sie beschreibt sich selbst; der Viewer kennt keine einzelne Aktion.
 * Statt `run` kann sie mit `choices` ein Untermenü liefern. `isAvailable`, `disabledReason` und `choices`
 * dürfen Signale lesen, das Menü folgt ihnen dann von selbst.
 */
export type CardAction = CardActionInfo & CardMenuStep<[CardActionContext]>;

/** Alle registrierten Kartenaktionen; Registrierung nur über `provideCardActions(...)`. */
export const CARD_ACTIONS: InjectionToken<readonly CardAction[]> = new InjectionToken<
  readonly CardAction[]
>('CARD_ACTIONS');
