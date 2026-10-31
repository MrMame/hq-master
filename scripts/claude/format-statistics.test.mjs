import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatLogLine, formatTable } from './format-statistics.mjs';
import { EMPTY_USAGE } from './transcript-usage.mjs';

const tools = (total, byName = {}) => ({ total, byName });
const stats = (overrides = {}) => ({
  activity: {
    start: new Date('2026-10-31T07:48:00'),
    prompts: 3,
    questions: 2,
    main: tools(55, { Edit: 24, Read: 31 }),
    sub: tools(0),
    subagentCalls: 0,
    filesRead: 28,
    failures: { total: 3, byKind: { test: 2, edit: 1 } },
    ...overrides.activity,
  },
  files: { base: 'seit abc1234', added: 3, modified: 10, renamed: 1, deleted: 0 },
  usage: {
    main: { messages: 40, input: 20, cacheWrite: 30000, cacheRead: 600000, output: 10465 },
    sub: { ...EMPTY_USAGE },
    ...overrides.usage,
  },
  end: new Date('2026-10-31T08:30:20'),
});

describe('formatTable', () => {
  const table = formatTable(stats());

  it('renders a markdown table with one row per metric', () => {
    const lines = table.split('\n');
    assert.equal(lines[0], '| Kennzahl | Wert | Details |');
    assert.equal(lines.length, 9);
  });

  it('shows duration, rounds, files and tool counts sorted by frequency', () => {
    assert.match(table, /\| Dauer \| 42 min \| 07:48 – 08:30, inkl\. Wartezeit \|/);
    assert.match(table, /\| Runden \| 3 \| Rückfragen 2 \|/);
    assert.match(table, /\| Tool-Aufrufe \| 55 \| Read 31, Edit 24 \|/);
    assert.match(
      table,
      /\| Dateien \| 14 \| neu 3, geändert 10, verschoben 1, gelöscht 0, gelesen 28/,
    );
  });

  it('labels failures and formats token numbers in German', () => {
    assert.match(table, /\| Fehlschläge \| 3 \| Tests 2, Edit 1 \|/);
    assert.match(table, /\| Tokens \| 640\.485 \| Output 10\.465, Cache-Schreiben 30\.000/);
  });

  it('shows a dash for subagents and failures when there are none', () => {
    const quiet = formatTable(stats({ activity: { failures: { total: 0, byKind: {} } } }));
    assert.match(quiet, /\| Fehlschläge \| 0 \| – \|/);
    assert.match(quiet, /\| Subagenten \| 0 \| – \|/);
  });

  it('shows subagent calls, tools and tokens separately', () => {
    const delegated = formatTable(
      stats({
        activity: { subagentCalls: 2, sub: tools(9, { Grep: 6, Read: 3 }) },
        usage: { sub: { messages: 5, input: 0, cacheWrite: 0, cacheRead: 1000, output: 500 } },
      }),
    );
    assert.match(
      delegated,
      /\| Subagenten \| 2 Aufrufe \| Tools 9 \(Grep 6, Read 3\), Tokens 1\.500/,
    );
  });
});

describe('formatLogLine', () => {
  it('summarizes the run in one line for ai-implementations-log.md', () => {
    assert.equal(
      formatLogLine(stats()),
      '- **Statistik:** 42 min · 3 Runden · 2 Rückfragen · 55 Tools · ' +
        'Dateien 3 neu / 10 geändert · 3 Fehlschläge · Tokens 640.485 (Output 10.465)',
    );
  });

  it('mentions subagents only when some were used', () => {
    const line = formatLogLine(
      stats({
        activity: { subagentCalls: 1 },
        usage: { sub: { messages: 1, input: 0, cacheWrite: 0, cacheRead: 0, output: 42 } },
      }),
    );
    assert.match(line, / · Subagenten 1 \(Tokens 42\)$/);
  });
});
