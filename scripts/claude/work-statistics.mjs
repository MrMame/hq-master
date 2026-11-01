// Arbeitsstatistik eines Skill-Laufs und Statistiklog (siehe .claude/rules/work-statistics.md).
// Aufruf: node scripts/claude/work-statistics.mjs --skill <name> | --since "YYYY-MM-DD HH:MM"
//         [--session <id>] [--log <pfad>]
//         [--append --slug <slug> [--points <n>]] [--harness-impact … --harness-note "…"
//         --harness-hypothesis "…"] | --overview | --import-legacy
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import {
  parseActivityLog,
  selectSince,
  selectSkillRun,
  summarizeActivity,
} from './activity-log.mjs';
import { formatLogLine, formatTable } from './format-statistics.mjs';
import { changedFiles, changedPaths, diffLines } from './git-files.mjs';
import { currentHarness, isHarnessFile, readSnapshot } from './harness-files.mjs';
import { gitDiffOf, importLegacyRuns, LEGACY_STANDS } from './legacy-import.mjs';
import { buildRun, classifyLatest, IMPACTS, newStandRow, recordRun } from './run-record.mjs';
import { formatRunRow, readLog, writeFormatted, writeLog } from './statistics-log.mjs';
import { formatModel, modelOfFiles } from './transcript-model.mjs';
import { findTranscripts, usageOfFiles } from './transcript-usage.mjs';

const LOGS = join('docs', 'project-logs');
const { values } = parseArgs({
  options: {
    skill: { type: 'string' },
    since: { type: 'string' },
    session: { type: 'string', default: process.env.CLAUDE_CODE_SESSION_ID },
    log: { type: 'string', default: join('.claude', 'logs', 'activity.log') },
    slug: { type: 'string' },
    points: { type: 'string' },
    append: { type: 'boolean', default: false },
    overview: { type: 'boolean', default: false },
    'import-legacy': { type: 'boolean', default: false },
    'harness-impact': { type: 'string' },
    'harness-note': { type: 'string' },
    'harness-hypothesis': { type: 'string' },
    statistics: { type: 'string', default: join(LOGS, 'harness-statistics.md') },
    state: { type: 'string', default: join(LOGS, 'harness-statistics.state.json') },
  },
});

function fail(message) {
  console.error(`work-statistics: ${message}`);
  process.exit(1);
}

const classification = {
  impact: values['harness-impact'],
  note: values['harness-note'],
  hypothesis: values['harness-hypothesis'],
};
const classifies = Object.values(classification).some((value) => value !== undefined);
if (classification.impact && !IMPACTS.includes(classification.impact)) {
  fail(`--harness-impact muss ${IMPACTS.join(' oder ')} sein.`);
}

async function importLegacy() {
  if (existsSync(values.statistics)) fail(`${values.statistics} existiert bereits.`);
  const aiLog = readFileSync(join(LOGS, 'ai-implementations-log.md'), 'utf8');
  const runs = importLegacyRuns(aiLog, (heading) => gitDiffOf(heading));
  await writeLog(values.statistics, { runs, stands: LEGACY_STANDS });
  console.log(`Statistiklog angelegt: ${runs.length} Läufe übernommen.`);
}

function harnessHint(snapshot, current, changesHarness) {
  if (snapshot?.stand === current.stand) return `Harness-Stand: ${current.stand} (unverändert)`;
  const row = newStandRow(snapshot, current, '');
  return [
    `Harness-Stand: neu ${current.stand}${row.breaks ? ' – Messbruch' : ''}: ${row.files}`,
    changesHarness ? 'Der Lauf ändert den Harness selbst; er zählt zum vorigen Stand.' : '',
    'Einordnung mit --append übergeben: --harness-impact, --harness-note, --harness-hypothesis.',
  ]
    .filter(Boolean)
    .join('\n');
}

async function reportRun() {
  if (!values.session) fail('Keine Sitzung: --session angeben oder in Claude Code ausführen.');
  if (!values.skill && !values.since)
    fail('--skill <name> oder --since "YYYY-MM-DD HH:MM" angeben.');
  if (values.append && !(values.skill && values.slug)) fail('--append braucht --skill und --slug.');
  if (values.points !== undefined && !/^\d+$/.test(values.points))
    fail('--points muss eine Zahl sein.');

  const entries = parseActivityLog(readFileSync(values.log, 'utf8'), values.session);
  const run = values.skill
    ? selectSkillRun(entries, values.skill)
    : selectSince(entries, new Date(values.since.replace(' ', 'T')));
  if (run.length === 0) fail(`Kein Lauf im Log gefunden (Sitzung ${values.session.slice(0, 8)}).`);

  const activity = summarizeActivity(run);
  const transcripts = findTranscripts(values.session);
  const stats = {
    activity,
    files: changedFiles(),
    usage: {
      main: usageOfFiles(transcripts.main, activity.start),
      sub: usageOfFiles(transcripts.sub, activity.start),
    },
    end: new Date(),
  };
  const model = modelOfFiles(transcripts.main, activity.start);
  const current = currentHarness({
    transcript: transcripts.main[0],
    model: formatModel(model),
    version: model.version,
  });
  const snapshot = readSnapshot(values.state);
  const changesHarness = changedPaths().some(isHarnessFile);

  // Ohne --append dieselbe Zeile als Vorschau, damit sie schon im Abschlussbericht steht.
  const points = values.points === undefined ? null : Number(values.points);
  const { skill = '–', slug = '–' } = values;
  const row = buildRun({ stats, skill, slug, points, diff: diffLines(), model });
  const result = recordRun(readLog(values.statistics), {
    run: row,
    snapshot,
    current,
    changesHarness,
    classification,
  });
  const runRow = formatRunRow(result.log, result.log.runs.at(-1));

  console.log(`${formatTable(stats)}\n\nLog-Eintrag:\n\n${formatLogLine(stats)}`);
  console.log(`\n${harnessHint(snapshot, current, changesHarness)}`);
  const rowTitle = values.append
    ? 'Zeile im Statistiklog'
    : 'Zeile für das Statistiklog (Vorschau)';
  console.log(`\n${rowTitle}:\n\n${runRow}`);
  if (!values.append) return;

  await writeLog(values.statistics, result.log);
  await writeFormatted(values.state, JSON.stringify(result.snapshot, null, 2));
  console.log(
    `\nStatistiklog ergänzt: ${values.statistics} (Stand ${result.log.runs.at(-1).stand}).`,
  );
}

if (values['import-legacy']) await importLegacy();
else if (values.overview) await writeLog(values.statistics, readLog(values.statistics));
else if (classifies && !values.append) {
  await writeLog(values.statistics, classifyLatest(readLog(values.statistics), classification));
} else await reportRun();
