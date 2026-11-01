import { isGameLogEntry } from '../../../core/services/game-log/game-log-codec.util';
import { GameLogEntry } from '../../../core/models/game-log-entry.model';
import { childElements, setAttributes, textOf } from '../../../shared/utils/xml.util';

const OPTIONAL_TEXTS: readonly (keyof GameLogEntry)[] = [
  'characterId',
  'characterName',
  'conditionId',
  'damageType',
];

export function writeGameLog(doc: XMLDocument, entries: GameLogEntry[]): Element {
  const root: Element = doc.createElement('gameLog');
  for (const entry of entries) {
    const el: Element = doc.createElement('entry');
    setAttributes(el, {
      id: entry.id,
      type: entry.type,
      gameTime: entry.gameTime,
      characterId: entry.characterId ?? null,
      characterName: entry.characterName ?? null,
      conditionId: entry.conditionId ?? null,
      value: entry.value ?? null,
      damageType: entry.damageType ?? null,
    });
    el.textContent = entry.text;
    root.appendChild(el);
  }
  return root;
}

/** Ältere Spielstände ohne `<gameLog>` ergeben ein leeres Log; ungültige Einträge werden übersprungen. */
export function readGameLog(root: Element | null): GameLogEntry[] {
  if (!root) return [];
  return childElements(root, 'entry')
    .map(readEntry)
    .filter((entry): entry is GameLogEntry => isGameLogEntry(entry));
}

function readEntry(el: Element): unknown {
  const entry: Record<string, unknown> = {
    id: el.getAttribute('id'),
    type: el.getAttribute('type'),
    gameTime: el.getAttribute('gameTime'),
    text: textOf(el),
  };
  for (const key of OPTIONAL_TEXTS) {
    const value: string | null = el.getAttribute(key);
    if (value !== null) entry[key] = value;
  }
  const value: string | null = el.getAttribute('value');
  if (value !== null) entry['value'] = Number(value);
  return entry;
}
