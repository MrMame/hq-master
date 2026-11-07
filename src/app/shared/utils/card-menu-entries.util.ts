import { CardAction, CardActionContext } from '../models/card-action.model';

/** Ein Eintrag im Menü des Card Viewers. */
export interface CardMenuEntry {
  action: CardAction;
  /** Grund für einen ausgegrauten Eintrag; `null` = ausführbar. */
  disabledReason: string | null;
  /** Erster Eintrag einer neuen Gruppe: Trennlinie davor. */
  dividerBefore: boolean;
}

/**
 * Menü für eine Karte: nur Aktionen des Modus, die verfügbar sind, nach `order` sortiert; eine Trennlinie
 * steht dort, wo die Gruppe wechselt.
 */
export function cardMenuEntries(
  actions: readonly CardAction[],
  context: CardActionContext,
): CardMenuEntry[] {
  const visible: CardAction[] = actions
    .filter((action) => action.modes.includes(context.mode) && action.isAvailable(context))
    .sort((a, b) => a.order - b.order);
  return visible.map((action, index) => ({
    action,
    disabledReason: action.disabledReason?.(context) ?? null,
    dividerBefore: index > 0 && visible[index - 1].group !== action.group,
  }));
}
