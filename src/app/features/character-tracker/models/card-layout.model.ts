/** Position und Ansicht einer Charakterkarte im Character Tracker. */
export interface CardLayout {
  x: number;
  y: number;
  isMinimised: boolean;
}

/** Layout aller Karten, Schlüssel ist `CharacterInfo.id`. */
export interface CardLayoutState {
  cards: Record<string, CardLayout>;
  /** Zuletzt angeklickte Karte, die über allen anderen liegt. */
  topCardId: string | null;
}

export const DEFAULT_CARD_LAYOUT: CardLayout = { x: 50, y: 50, isMinimised: true };

export const DEFAULT_CARD_LAYOUT_STATE: CardLayoutState = { cards: {}, topCardId: null };
