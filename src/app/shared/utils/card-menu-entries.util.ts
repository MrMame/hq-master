import { CardAction, CardActionContext, CardChoice } from '../models/card-action.model';

/** Was das Wählen eines ausführbaren Eintrags auslöst. */
export type CardMenuRun = () => void | Promise<void>;

/** Ein Eintrag im Menü des Card Viewers oder in einem seiner Untermenüs. */
export interface CardMenuEntry {
  id: string;
  label: string;
  /** Grund für einen ausgegrauten Eintrag; `null` = wählbar. */
  disabledReason: string | null;
  /** Erster Eintrag einer neuen Gruppe: Trennlinie davor. */
  dividerBefore: boolean;
  /** Führt aus; `null` bei einem Untermenü. */
  run: CardMenuRun | null;
  /** Einträge des Untermenüs, erst beim Öffnen bestimmt; `null` bei einem ausführbaren Eintrag. */
  choices: (() => CardMenuEntry[]) | null;
}

/**
 * Menü für eine Karte: nur Aktionen des Modus, die verfügbar sind, nach `order` sortiert; eine Trennlinie
 * steht dort, wo die Gruppe wechselt. Ausführen und Untermenüs beziehen sich auf `context`.
 */
export function cardMenuEntries(
  actions: readonly CardAction[],
  context: CardActionContext,
): CardMenuEntry[] {
  const visible: CardAction[] = actions
    .filter((action) => action.modes.includes(context.mode) && action.isAvailable(context))
    .sort((a, b) => a.order - b.order);
  return visible.map((action, index) => ({
    id: action.id,
    label: action.label,
    disabledReason: action.disabledReason?.(context) ?? null,
    dividerBefore: index > 0 && visible[index - 1].group !== action.group,
    ...(action.choices
      ? { run: null, choices: () => choiceEntries(action.choices(context)) }
      : { run: () => action.run(context), choices: null }),
  }));
}

/** Einträge eines Untermenüs in der gelieferten Reihenfolge, ohne Trennlinien. */
export function choiceEntries(choices: readonly CardChoice[]): CardMenuEntry[] {
  return choices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    disabledReason: choice.disabledReason ?? null,
    dividerBefore: false,
    ...(choice.choices
      ? { run: null, choices: () => choiceEntries(choice.choices()) }
      : { run: () => choice.run(), choices: null }),
  }));
}
