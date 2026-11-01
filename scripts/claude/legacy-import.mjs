// Einmalige Übernahme der `**Statistik:**`-Kurzzeilen aus docs/project-logs/ai-implementations-log.md
// als Läufe mit Harness-Stand „unbekannt“ (alt-1 vor, alt-2 ab dem Messbruch).
import { execFileSync } from 'node:child_process';
import { commitDiffLines } from './git-files.mjs';
import { parseNumber } from './markdown-table.mjs';

// Refactoring work-statistics-failure-detection: Fehlschläge werden seitdem anders erkannt.
export const LEGACY_BREAK = '2026-10-31 20:56';
const HEADING =
  /^### \((\d{4}-\d{2}-\d{2} \d{2}:\d{2})\) - (\w+)[^\n]*\(([a-z0-9-]+) ([^()]*)\)\s*$/;
const STATISTICS = /^- \*\*Statistik:\*\* (.*)$/;
const LOG_PATHS = ['docs/project-logs/ai-implementations-log.md', 'ai-implementations-log.md'];

export const LEGACY_STANDS = [
  {
    stand: 'alt-1',
    since: '–',
    model: 'unbekannt',
    version: 'unbekannt',
    breaks: false,
    impact: 'wirkungsrelevant',
    note: 'Harness-Stand unbekannt (übernommen aus ai-implementations-log.md)',
    hypothesis: '–',
    files: '–',
  },
  {
    stand: 'alt-2',
    since: LEGACY_BREAK,
    model: 'unbekannt',
    version: 'unbekannt',
    breaks: true,
    impact: 'wirkungsrelevant',
    note: 'Harness-Stand unbekannt; Fehlschläge aus Prüfausgaben (work-statistics-failure-detection)',
    hypothesis: '–',
    files:
      'scripts/claude/activity-log.mjs, scripts/claude/check-output.mjs, .claude/hooks/log-activity.mjs',
  },
];

// „#1–#6, #8, #9“ → 8; „#2“ → 1; „#10 Teil 1“ → 1.
export function countPoints(text) {
  return text.split(',').reduce((total, part) => {
    const range = /#(\d+)\s*[–-]\s*#(\d+)/.exec(part);
    if (range) return total + Number(range[2]) - Number(range[1]) + 1;
    return /#\d+/.test(part) ? total + 1 : total;
  }, 0);
}

const pick = (text, pattern) => parseNumber(pattern.exec(text)?.[1]);

export function parseStatistics(text) {
  const failures = /(\d+) Fehlschläge(?: \(\+(\d+) erwartet\))?/.exec(text);
  return {
    minutes: pick(text, /(\d+) min/),
    prompts: pick(text, /(\d+) Runden/),
    questions: pick(text, /(\d+) Rückfragen/),
    tools: pick(text, /(\d+) Tools/),
    failures: Number(failures?.[1] ?? 0),
    expected: Number(failures?.[2] ?? 0),
    output: pick(text, /Tokens [\d.]+ \(Output ([\d.]+)\)/),
    tokens:
      pick(text, /Tokens ([\d.]+) \(Output/) +
      (pick(text, /Subagenten \d+ \(Tokens ([\d.]+)\)/) ?? 0),
  };
}

// diffOf(überschrift) → { added, removed } oder null, falls kein Commit ermittelbar ist.
export function importLegacyRuns(logText, diffOf) {
  const runs = [];
  let heading;
  for (const line of logText.split(/\r?\n/)) {
    const match = HEADING.exec(line);
    if (match) heading = { line, match };
    const statistics = STATISTICS.exec(line);
    if (!statistics || !heading) continue;
    const [, date, kind, slug, points] = heading.match;
    const diff = diffOf(heading.line) ?? { added: null, removed: null };
    runs.push({
      date,
      skill: kind === 'Feature' ? 'implement-feature' : 'implement-refactor',
      slug,
      points: countPoints(points) || null,
      ...diff,
      ...parseStatistics(statistics[1]),
      model: 'unbekannt',
      stand: date < LEGACY_BREAK ? 'alt-1' : 'alt-2',
      changesHarness: false,
    });
  }
  return runs.sort((left, right) => left.date.localeCompare(right.date));
}

// Ältester Commit, der die Überschrift ins Log geschrieben hat = Commit der Umsetzung.
export function gitDiffOf(heading, cwd = process.cwd()) {
  const commits = execFileSync('git', ['log', '--format=%H', `-S${heading}`, '--', ...LOG_PATHS], {
    cwd,
    encoding: 'utf8',
  })
    .split(/\r?\n/)
    .filter(Boolean);
  return commits.length ? commitDiffLines(commits.at(-1), cwd) : null;
}
