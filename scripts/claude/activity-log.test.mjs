import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  classifyFailure,
  parseActivityLog,
  selectSince,
  selectSkillRun,
  summarizeActivity,
} from './activity-log.mjs';

const SESSION = '3e280aae-1a26-4591-b9ed-99d5bd7e1eb4';
// Wie .claude/hooks/log-activity.mjs: Art auf 8 Zeichen aufgefüllt, dann ein Leerzeichen.
const line = (time, kind, detail = '', { session = '3e280aae', sub = false } = {}) =>
  `2026-10-31 ${time}  ${session}  ${sub ? '[sub] ' : ''}${kind.padEnd(8)} ${detail}`;

const LOG = [
  '2026-10-31 07:28:00  Edit    docs/alt-ohne-sitzung.md',
  line('08:00:00', 'PROMPT', '/implement-refactor responsive-app-header'),
  line('08:00:05', 'Read', 'src/app/app.ts'),
  line('08:00:06', 'Read', 'src/app/app.ts'),
  line('08:00:07', 'Read', 'src/app/app.css', { session: 'ffffffff' }),
  line('08:01:00', 'AskUserQuestion', 'Plan'),
  line('08:01:30', 'STOP', '── Antwort fertig ──'),
  line('08:02:00', 'PROMPT', 'ja, umsetzen'),
  line('08:02:10', 'Edit', 'src/app/app.css'),
  line('08:02:20', 'FAIL', 'Edit src/app/app.css'),
  line('08:03:00', 'FAIL', 'Bash (Run tests) npm run test -- --watch=false'),
  line('08:03:30', 'Agent', 'Explore: Find callers'),
  line('08:03:40', 'Grep', '"AppHeader"', { sub: true }),
  line('08:04:00', 'STOP', '── Antwort fertig ──'),
].join('\n');

describe('parseActivityLog', () => {
  it('keeps only lines of the given session and skips lines without session', () => {
    const entries = parseActivityLog(LOG, SESSION);
    assert.equal(entries.length, 12);
    assert.deepEqual(
      entries.filter((entry) => entry.kind === 'Read').map((entry) => entry.detail),
      ['src/app/app.ts', 'src/app/app.ts'],
    );
  });

  it('reads time, subagent flag and detail without padding', () => {
    const [prompt] = parseActivityLog(LOG, SESSION);
    assert.equal(prompt.time.getTime(), new Date('2026-10-31T08:00:00').getTime());
    assert.equal(prompt.detail, '/implement-refactor responsive-app-header');
    assert.equal(parseActivityLog(LOG, SESSION).at(-2).sub, true);
  });
});

describe('selectSkillRun / selectSince', () => {
  const entries = parseActivityLog(LOG, SESSION);

  it('starts at the last prompt that invokes the skill', () => {
    assert.equal(selectSkillRun(entries, 'implement-refactor').length, 12);
    const earlier = parseActivityLog(
      `${line('07:00:00', 'PROMPT', '/implement-refactor')}\n${line('07:00:01', 'Read', 'x')}\n${LOG}`,
      SESSION,
    );
    const run = selectSkillRun(earlier, 'implement-refactor');
    assert.equal(run.length, 12);
    assert.equal(run[0].time.getTime(), new Date('2026-10-31T08:00:00').getTime());
  });

  it('does not match a skill whose name only starts with the given name', () => {
    assert.deepEqual(selectSkillRun(entries, 'implement'), []);
  });

  it('returns nothing when the skill was not invoked', () => {
    assert.deepEqual(selectSkillRun(entries, 'interview-me'), []);
  });

  it('selects entries from a point in time', () => {
    assert.equal(selectSince(entries, new Date('2026-10-31T08:02:00')).length, 7);
  });
});

describe('summarizeActivity', () => {
  const summary = summarizeActivity(parseActivityLog(LOG, SESSION));

  it('counts rounds, questions and distinct read files of the main session', () => {
    assert.equal(summary.prompts, 2);
    assert.equal(summary.questions, 1);
    assert.equal(summary.filesRead, 1);
  });

  it('counts failed calls as tool calls of their tool and separates subagents', () => {
    assert.deepEqual(summary.main, {
      total: 7,
      byName: { Read: 2, AskUserQuestion: 1, Edit: 2, Bash: 1, Agent: 1 },
    });
    assert.deepEqual(summary.sub, { total: 1, byName: { Grep: 1 } });
    assert.equal(summary.subagentCalls, 1);
  });

  it('groups failures by kind', () => {
    assert.deepEqual(summary.failures, { total: 2, byKind: { edit: 1, test: 1 } });
  });

  it('handles an empty run', () => {
    const empty = summarizeActivity([]);
    assert.equal(empty.start, undefined);
    assert.equal(empty.main.total, 0);
  });
});

describe('classifyFailure', () => {
  const fail = (detail) => ({ kind: 'FAIL', detail });

  for (const [detail, kind] of [
    ['Bash (Lint) npm run lint', 'lint'],
    ['Bash (Build) npm run build', 'build'],
    ['Bash (E2E) npx playwright test --project=probe e2e/probe/x.spec.ts', 'e2e'],
    ['Bash (Status) git status', 'bash'],
    ['Write src/new.ts', 'edit'],
    ['WebFetch https://example.org', 'other'],
  ]) {
    it(`classifies "${detail}" as ${kind}`, () =>
      assert.equal(classifyFailure(fail(detail)), kind));
  }
});
