// Modell, Effort-Stufe und Claude-Code-Version eines Laufs aus den Sitzungsprotokollen (*.jsonl).
import { readFileSync } from 'node:fs';

export const UNKNOWN_MODEL = Object.freeze({
  model: 'unbekannt',
  effort: null,
  version: 'unbekannt',
});
const SYNTHETIC = '<synthetic>';

function parseJsonLine(line) {
  try {
    return JSON.parse(line);
  } catch {
    return undefined;
  }
}

// Häufigstes Modell der Antworten ab `since`; Effort und Version aus der letzten Angabe.
export function sessionModel(jsonlTexts, since) {
  const counts = new Map();
  let { effort, version } = UNKNOWN_MODEL;
  for (const line of jsonlTexts.join('\n').split(/\r?\n/)) {
    const entry = parseJsonLine(line);
    if (!entry?.timestamp || new Date(entry.timestamp) < since) continue;
    const model = entry.message?.model;
    if (model && model !== SYNTHETIC) counts.set(model, (counts.get(model) ?? 0) + 1);
    if (typeof entry.effort === 'string') effort = entry.effort;
    if (typeof entry.version === 'string') version = entry.version;
  }
  const [model] = [...counts].sort(([, left], [, right]) => right - left)[0] ?? [
    UNKNOWN_MODEL.model,
  ];
  return { model, effort, version };
}

export const modelOfFiles = (paths, since) =>
  sessionModel(
    paths.map((path) => readFileSync(path, 'utf8')),
    since,
  );

export const formatModel = ({ model, effort }) => (effort ? `${model} (${effort})` : model);
