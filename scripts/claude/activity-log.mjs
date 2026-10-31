// Liest .claude/logs/activity.log (Format siehe .claude/hooks/log-activity.mjs) und
// zählt Runden, Rückfragen, Tool-Aufrufe, gelesene Dateien und Fehlschläge eines Laufs.
const LINE = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) {2}(\S{8}) {2}(\[sub\] )?(\S+) *(.*)$/;
const NO_TOOL = new Set(['PROMPT', 'STOP']);
const FAILURE_KINDS = [
  ['test', /npm run test|ng test|vitest/],
  ['lint', /npm run lint|ng lint|eslint/],
  ['build', /npm run build|ng build/],
  ['e2e', /npm run e2e|playwright/],
];

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

// Einträge ab dem letzten Prompt, der den Skill aufruft (z. B. „/implement-refactor …“).
export function selectSkillRun(entries, skill) {
  const command = `/${skill}`;
  const start = entries.findLastIndex(
    (entry) =>
      entry.kind === 'PROMPT' &&
      (entry.detail === command || entry.detail.startsWith(`${command} `)),
  );
  return start === -1 ? [] : entries.slice(start);
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
  return FAILURE_KINDS.find(([, pattern]) => pattern.test(entry.detail))?.[0] ?? 'bash';
}

function summarizeTools(entries) {
  const tools = entries.filter((entry) => !NO_TOOL.has(entry.kind));
  return { total: tools.length, byName: countBy(tools.map(toolName)) };
}

export function summarizeActivity(entries) {
  const main = entries.filter((entry) => !entry.sub);
  const failures = entries.filter((entry) => entry.kind === 'FAIL');
  const reads = entries.filter((entry) => entry.kind === 'Read').map((entry) => entry.detail);
  return {
    start: entries[0]?.time,
    prompts: main.filter((entry) => entry.kind === 'PROMPT').length,
    questions: main.filter((entry) => entry.kind === 'AskUserQuestion').length,
    main: summarizeTools(main),
    sub: summarizeTools(entries.filter((entry) => entry.sub)),
    subagentCalls: main.filter((entry) => entry.kind === 'Agent').length,
    filesRead: new Set(reads).size,
    failures: { total: failures.length, byKind: countBy(failures.map(classifyFailure)) },
  };
}
