// Markdown-Ausgabe der Arbeitsstatistik: Tabelle für den Chat, Kurzzeile für
// ai-implementations-log.md (Format siehe .claude/rules/work-statistics.md).
import { totalTokens } from './transcript-usage.mjs';

const FAILURE_LABELS = {
  edit: 'Edit',
  test: 'Tests',
  lint: 'Lint',
  build: 'Build',
  e2e: 'E2E',
  bash: 'Bash',
  other: 'Sonstige',
};

const number = (value) => value.toLocaleString('de-DE');
const clock = (date) =>
  date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });

function listCounts(counts, labels = {}) {
  const parts = Object.entries(counts)
    .sort(([, left], [, right]) => right - left)
    .map(([key, count]) => `${labels[key] ?? key} ${count}`);
  return parts.length ? parts.join(', ') : '–';
}

function minutes({ activity, end }) {
  return Math.max(0, Math.round((end - activity.start) / 60000));
}

function fileCount({ files }) {
  return files.added + files.modified + files.renamed + files.deleted;
}

function tokenDetails(usage) {
  return (
    `Output ${number(usage.output)}, Cache-Schreiben ${number(usage.cacheWrite)}, ` +
    `Cache-Lesen ${number(usage.cacheRead)}, Input ${number(usage.input)} ` +
    `(${usage.messages} Antworten)`
  );
}

function subagentRow({ activity, usage }) {
  if (activity.subagentCalls === 0 && activity.sub.total === 0) return ['0', '–'];
  return [
    `${activity.subagentCalls} Aufrufe`,
    `Tools ${activity.sub.total} (${listCounts(activity.sub.byName)}), ` +
      `Tokens ${number(totalTokens(usage.sub))} (Output ${number(usage.sub.output)})`,
  ];
}

export function formatTable(stats) {
  const { activity, files, usage, end } = stats;
  const rows = [
    ['Dauer', `${minutes(stats)} min`, `${clock(activity.start)} – ${clock(end)}, inkl. Wartezeit`],
    ['Runden', `${activity.prompts}`, `Rückfragen ${activity.questions}`],
    ['Tool-Aufrufe', `${activity.main.total}`, listCounts(activity.main.byName)],
    [
      'Dateien',
      `${fileCount(stats)}`,
      `neu ${files.added}, geändert ${files.modified}, verschoben ${files.renamed}, ` +
        `gelöscht ${files.deleted}, gelesen ${activity.filesRead} (${files.base})`,
    ],
    [
      'Fehlschläge',
      `${activity.failures.total}`,
      listCounts(activity.failures.byKind, FAILURE_LABELS),
    ],
    ['Tokens', number(totalTokens(usage.main)), tokenDetails(usage.main)],
    ['Subagenten', ...subagentRow(stats)],
  ];
  return [
    '| Kennzahl | Wert | Details |',
    '| --- | --- | --- |',
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n');
}

export function formatLogLine(stats) {
  const { activity, files, usage } = stats;
  const parts = [
    `${minutes(stats)} min`,
    `${activity.prompts} Runden`,
    `${activity.questions} Rückfragen`,
    `${activity.main.total} Tools`,
    `Dateien ${files.added} neu / ${files.modified} geändert`,
    `${activity.failures.total} Fehlschläge`,
    `Tokens ${number(totalTokens(usage.main))} (Output ${number(usage.main.output)})`,
  ];
  if (activity.subagentCalls > 0) {
    parts.push(`Subagenten ${activity.subagentCalls} (Tokens ${number(totalTokens(usage.sub))})`);
  }
  return `- **Statistik:** ${parts.join(' · ')}`;
}
