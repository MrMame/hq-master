// Liest .claude/logs/activity.log (Format siehe .claude/hooks/log-activity.mjs) und
// zählt Runden, Rückfragen, Tool-Aufrufe, gelesene Dateien und Fehlschläge eines Laufs.
import { checkKind, isExpectedFailure } from './check-output.mjs';

const LINE = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) {2}(\S{8}) {2}(\[sub\] )?(\S+) *(.*)$/;
const NO_TOOL = new Set(['PROMPT', 'STOP']);

export function parseActivityLog(text, session) {
  const prefix = session.slice(0, 8);
  return text
    .split(/\r?\n/)
    .map((line) => LINE.exec(line))
    .filter((match) => match && match[2] === prefix)
    .map(([, stamp, , sub, kind, detail]) => ({
      time: new Date(stamp.replace(' ', 'T')),
      sub: Boolean(sub),
      kind,
      detail,
    }));
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Startet der Eintrag den Skill: „/skill“ irgendwo im Prompt oder ein Skill-Tool-Aufruf.
function invokesSkill(entry, skill) {
  if (entry.kind === 'PROMPT')
    return new RegExp(`(^|\\s)/${escapeRegExp(skill)}(\\s|$)`).test(entry.detail);
  return !entry.sub && entry.kind === 'Skill' && entry.detail.split(' ')[0] === skill;
}

// Einträge ab dem letzten Prompt, der den Skill aufruft („/implement-refactor …“, auch mitten im
// Text) oder in dessen Antwort Claude ihn per Skill-Tool startet; der Prompt gehört zum Lauf.
export function selectSkillRun(entries, skill) {
  const invocation = entries.findLastIndex((entry) => invokesSkill(entry, skill));
  if (invocation === -1) return [];
  const prompt = entries.findLastIndex(
    (entry, index) => index <= invocation && entry.kind === 'PROMPT',
  );
  return entries.slice(Math.max(prompt, 0));
}

export function selectSince(entries, since) {
  return entries.filter((entry) => entry.time >= since);
}

function toolName(entry) {
  return entry.kind === 'FAIL' ? entry.detail.split(' ')[0] : entry.kind;
}

function countBy(values) {
  const counts = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}

export function classifyFailure(entry) {
  const tool = toolName(entry);
  if (tool !== 'Bash') return ['Edit', 'Write', 'NotebookEdit'].includes(tool) ? 'edit' : 'other';
  return checkKind(entry.detail) ?? 'bash';
}

function summarizeFailures(entries) {
  const failures = entries.filter((entry) => entry.kind === 'FAIL');
  const unexpected = failures.filter((entry) => !isExpectedFailure(entry.detail));
  return {
    total: unexpected.length,
    byKind: countBy(unexpected.map(classifyFailure)),
    expected: failures.length - unexpected.length,
  };
}

function summarizeTools(entries) {
  const tools = entries.filter((entry) => !NO_TOOL.has(entry.kind));
  return { total: tools.length, byName: countBy(tools.map(toolName)) };
}

export function summarizeActivity(entries) {
  const main = entries.filter((entry) => !entry.sub);
  const reads = entries.filter((entry) => entry.kind === 'Read').map((entry) => entry.detail);
  return {
    start: entries[0]?.time,
    prompts: main.filter((entry) => entry.kind === 'PROMPT').length,
    questions: main.filter((entry) => entry.kind === 'AskUserQuestion').length,
    main: summarizeTools(main),
    sub: summarizeTools(entries.filter((entry) => entry.sub)),
    subagentCalls: main.filter((entry) => entry.kind === 'Agent').length,
    filesRead: new Set(reads).size,
    failures: summarizeFailures(entries),
  };
}
