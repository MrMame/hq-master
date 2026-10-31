// Arbeitsstatistik eines Skill-Laufs (siehe .claude/rules/work-statistics.md).
// Aufruf: node scripts/claude/work-statistics.mjs --skill <name> | --since "YYYY-MM-DD HH:MM"
//         [--session <id>] [--log <pfad>]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import {
  parseActivityLog,
  selectSince,
  selectSkillRun,
  summarizeActivity,
} from './activity-log.mjs';
import { formatLogLine, formatTable } from './format-statistics.mjs';
import { changedFiles } from './git-files.mjs';
import { findTranscripts, usageOfFiles } from './transcript-usage.mjs';

const { values } = parseArgs({
  options: {
    skill: { type: 'string' },
    since: { type: 'string' },
    session: { type: 'string', default: process.env.CLAUDE_CODE_SESSION_ID },
    log: { type: 'string', default: join('.claude', 'logs', 'activity.log') },
  },
});

function fail(message) {
  console.error(`work-statistics: ${message}`);
  process.exit(1);
}

if (!values.session) fail('Keine Sitzung: --session angeben oder in Claude Code ausführen.');
if (!values.skill && !values.since) fail('--skill <name> oder --since "YYYY-MM-DD HH:MM" angeben.');

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

console.log(`${formatTable(stats)}\n\nLog-Eintrag:\n\n${formatLogLine(stats)}`);
