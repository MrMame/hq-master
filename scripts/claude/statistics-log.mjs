// Liest und schreibt docs/project-logs/harness-statistics.md (Abschnitte Übersicht, Läufe,
// Harness-Stände). Die Übersicht und die Spalten Nacharbeit/Index werden immer neu berechnet.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { analyze } from './efficiency-index.mjs';
import { formatOverview } from './format-overview.mjs';
import { formatNumber, parseNumber, parseTable, renderTable } from './markdown-table.mjs';

export const HARNESS_MARK = ' (ändert Harness)';
const RUN_HEADERS = [
  'Datum',
  'Skill',
  'Slug',
  'Punkte',
  'Diff (+/−)',
  'Dauer (min)',
  'Runden',
  'Rückfragen',
  'Tools',
  'Fehlschläge (erwartet)',
  'Output-Tokens',
  'Tokens gesamt',
  'Modell',
  'Harness-Stand',
  'Nacharbeit',
  'Index',
];
const STAND_HEADERS = [
  'Stand',
  'Seit',
  'Modell',
  'Claude Code',
  'Messbruch',
  'Einordnung',
  'Beschreibung',
  'Erwartete Wirkung',
  'Geänderte Dateien',
];
const INTRO =
  'Generiert von `node scripts/claude/work-statistics.mjs` – nicht von Hand bearbeiten. ' +
  'Wie die Zahlen entstehen und zu lesen sind, mit Beispielrechnungen: Abschnitt **Erläuterungen** am Ende.';
const GUIDE = readFileSync(new URL('./statistics-guide.md', import.meta.url), 'utf8').trim();

const diffCell = ({ added, removed }) => (added === null ? '–' : `+${added} / −${removed}`);
const failureCell = ({ failures, expected }) =>
  expected ? `${failures} (+${expected})` : `${failures}`;

function runFromCells(cells) {
  const [date, skill, slug, points, diff, minutes, prompts, questions, tools, failures] = cells;
  const [, added = null, removed = null] = /\+(\d+) \/ −(\d+)/.exec(diff) ?? [];
  const [, failed, expected = 0] = /(\d+)(?: \(\+(\d+)\))?/.exec(failures);
  const stand = cells[13];
  return {
    date,
    skill,
    slug,
    points: parseNumber(points),
    added: parseNumber(added),
    removed: parseNumber(removed),
    minutes: parseNumber(minutes),
    prompts: parseNumber(prompts),
    questions: parseNumber(questions),
    tools: parseNumber(tools),
    failures: Number(failed),
    expected: Number(expected),
    output: parseNumber(cells[10]),
    tokens: parseNumber(cells[11]),
    model: cells[12],
    stand: stand.replace(HARNESS_MARK, ''),
    changesHarness: stand.endsWith(HARNESS_MARK),
  };
}

function standFromCells([stand, since, model, version, breaks, impact, note, hypothesis, files]) {
  return { stand, since, model, version, breaks: breaks === 'ja', impact, note, hypothesis, files };
}

export function parseLog(text) {
  const [, runsPart = '', standsPart = ''] = text.split(
    /^## (?:Läufe|Harness-Stände|Erläuterungen)\s*$/m,
  );
  return {
    runs: parseTable(runsPart).map(runFromCells),
    stands: parseTable(standsPart).map(standFromCells),
  };
}

function runCells(run, analysis) {
  const n = formatNumber;
  return [
    run.date,
    run.skill,
    run.slug,
    n(run.points),
    diffCell(run),
    n(run.minutes),
    n(run.prompts),
    n(run.questions),
    n(run.tools),
    failureCell(run),
    n(run.output),
    n(run.tokens),
    run.model,
    `${run.stand}${run.changesHarness ? HARNESS_MARK : ''}`,
    analysis.reworkLabel(run),
    analysis.indexLabel(run),
  ];
}

function standCells(stand) {
  const { since, model, version, impact, note, hypothesis, files } = stand;
  const breaks = stand.breaks ? 'ja' : '–';
  return [stand.stand, since, model, version, breaks, impact, note, hypothesis, files];
}

export function renderLog({ runs, stands }) {
  const analysis = analyze(runs, stands);
  return [
    '# Harness-Statistik',
    INTRO,
    '## Übersicht',
    formatOverview(analysis),
    '## Läufe',
    renderTable(
      RUN_HEADERS,
      runs.map((run) => runCells(run, analysis)),
    ),
    '## Harness-Stände',
    renderTable(STAND_HEADERS, stands.map(standCells)),
    '## Erläuterungen',
    GUIDE,
  ].join('\n\n');
}

// Eine Lauf-Zeile mit Kopf für den Chat; Nacharbeit und Index im Kontext des ganzen Logs.
export const formatRunRow = (log, run) =>
  renderTable(RUN_HEADERS, [runCells(run, analyze(log.runs, log.stands))]);

export const readLog = (path) =>
  existsSync(path) ? parseLog(readFileSync(path, 'utf8')) : { runs: [], stands: [] };

// Prettier-formatiert schreiben, damit der pre-commit-Check die generierten Dateien akzeptiert.
export async function writeFormatted(path, text) {
  const prettier = await import('prettier');
  const options = (await prettier.resolveConfig(path)) ?? {};
  writeFileSync(path, await prettier.format(text, { ...options, filepath: path }));
}

export const writeLog = (path, log) => writeFormatted(path, `${renderLog(log)}\n`);
