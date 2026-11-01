// Baut die Lauf-Zeile des Statistiklogs und ordnet sie einem Harness-Stand zu. Hat der Lauf den
// Harness selbst geändert, zählt er zum vorigen Stand; der neue gilt ab dem nächsten Lauf.
import { minutes } from './format-statistics.mjs';
import { diffHarness, isMeasurementBreak } from './harness-files.mjs';
import { formatModel } from './transcript-model.mjs';
import { totalTokens } from './transcript-usage.mjs';

export const IMPACTS = ['wirkungsrelevant', 'nicht wirkungsrelevant'];
export const OPEN_IMPACT = 'offen';
const MAX_LISTED = 12;

const pad = (value) => String(value).padStart(2, '0');
export const stamp = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export function buildRun({ stats, skill, slug, points, diff, model }) {
  const { activity, usage, end } = stats;
  return {
    date: stamp(end),
    skill,
    slug,
    points: points ?? null,
    added: diff.added,
    removed: diff.removed,
    minutes: minutes(stats),
    prompts: activity.prompts,
    questions: activity.questions,
    tools: activity.main.total,
    failures: activity.failures.total,
    expected: activity.failures.expected ?? 0,
    output: usage.main.output + usage.sub.output,
    tokens: totalTokens(usage.main) + totalTokens(usage.sub),
    model: formatModel(model),
    stand: '',
    changesHarness: false,
  };
}

export function describeHarnessChange(previous, current) {
  if (!previous) return `erster Stand (${Object.keys(current.files).length} Dateien)`;
  const { added, changed, removed } = diffHarness(previous.files, current.files);
  const listed = [
    ...added.map((path) => `+ ${path}`),
    ...changed.map((path) => `~ ${path}`),
    ...removed.map((path) => `− ${path}`),
  ];
  const parts =
    listed.length > MAX_LISTED
      ? [...listed.slice(0, MAX_LISTED), `… (+${listed.length - MAX_LISTED})`]
      : listed;
  if (previous.model !== current.model) parts.push(`Modell ${previous.model} → ${current.model}`);
  if (previous.version !== current.version) {
    parts.push(`Claude Code ${previous.version} → ${current.version}`);
  }
  return parts.join(', ');
}

export function newStandRow(previous, current, since, classification = {}) {
  const breaks = !previous || isMeasurementBreak(diffHarness(previous.files, current.files));
  return {
    stand: current.stand,
    since,
    model: current.model,
    version: current.version,
    breaks,
    impact: classification.impact ?? OPEN_IMPACT,
    note: classification.note ?? '–',
    hypothesis: classification.hypothesis ?? '–',
    files: describeHarnessChange(previous, current),
  };
}

// snapshot = zuletzt gespeicherter Stand ({ stand, model, version, files }) oder null.
export function recordRun(log, { run, snapshot, current, changesHarness, classification }) {
  const isNew = snapshot?.stand !== current.stand;
  const newStand = isNew ? newStandRow(snapshot, current, run.date, classification) : null;
  const previousStand = log.stands.at(-1)?.stand;
  const attributeToPrevious = isNew && changesHarness && previousStand;
  const recorded = {
    ...run,
    stand: attributeToPrevious ? previousStand : current.stand,
    changesHarness: Boolean(isNew && changesHarness),
  };
  return {
    log: {
      runs: [...log.runs, recorded],
      stands: newStand ? [...log.stands, newStand] : log.stands,
    },
    snapshot: current,
    newStand,
  };
}

// Einordnung (#4) nachträglich am letzten Stand ergänzen.
export function classifyLatest(log, { impact, note, hypothesis }) {
  const latest = log.stands.at(-1);
  if (!latest) throw new Error('Kein Harness-Stand im Statistiklog.');
  const updated = {
    ...latest,
    impact: impact ?? latest.impact,
    note: note ?? latest.note,
    hypothesis: hypothesis ?? latest.hypothesis,
  };
  return { ...log, stands: [...log.stands.slice(0, -1), updated] };
}
