import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import {
  collectHarnessFiles,
  currentHarness,
  diffHarness,
  hashContent,
  isHarnessFile,
  isMeasurementBreak,
  MEMORY_PREFIX,
  readSnapshot,
  standHash,
  USER_SETTINGS,
} from './harness-files.mjs';

describe('isHarnessFile', () => {
  it('accepts rules, skills, hooks, scripts and configs', () => {
    for (const path of [
      '.claude/CLAUDE.md',
      '.claude/skills/implement-refactor/SKILL.md',
      'scripts/claude/work-statistics.mjs',
      '.husky/pre-commit',
      'vitest.config.ts',
    ]) {
      assert.ok(isHarnessFile(path), path);
    }
  });

  it('rejects app code, logs, tests and test fixtures', () => {
    for (const path of [
      'src/app/app.ts',
      '.claude/logs/activity.log',
      'scripts/claude/git-files.test.mjs',
      'scripts/claude/testing/statistics.fixtures.mjs',
      'docs/project-logs/harness-statistics.md',
    ]) {
      assert.equal(isHarnessFile(path), false, path);
    }
  });
});

describe('hashContent / standHash', () => {
  it('ignores line endings so a CRLF checkout keeps the stand', () => {
    assert.equal(hashContent('a\r\nb\r\n'), hashContent('a\nb\n'));
    assert.notEqual(hashContent('a'), hashContent('b'));
  });

  it('changes with file contents, model and version', () => {
    const base = { files: { 'a.md': '111' }, model: 'm', version: '1' };
    const hash = standHash(base);
    assert.match(hash, /^[0-9a-f]{8}$/);
    assert.notEqual(standHash({ ...base, files: { 'a.md': '222' } }), hash);
    assert.notEqual(standHash({ ...base, model: 'n' }), hash);
    assert.notEqual(standHash({ ...base, version: '2' }), hash);
  });
});

describe('diffHarness / isMeasurementBreak', () => {
  const diff = diffHarness({ a: '1', b: '1', c: '1' }, { a: '1', b: '2', d: '1' });

  it('lists added, changed and removed files', () => {
    assert.deepEqual(diff, { added: ['d'], changed: ['b'], removed: ['c'] });
    assert.deepEqual(diffHarness(undefined, { a: '1' }).added, ['a']);
  });

  it('flags changes to measurement files only', () => {
    assert.equal(isMeasurementBreak(diff), false);
    const measured = diffHarness({}, { 'scripts/claude/activity-log.mjs': '1' });
    assert.equal(isMeasurementBreak(measured), true);
    assert.equal(
      isMeasurementBreak({ added: [], changed: [], removed: ['.claude/hooks/log-activity.mjs'] }),
      true,
    );
  });
});

describe('collectHarnessFiles / currentHarness', () => {
  const home = mkdtempSync(join(tmpdir(), 'harness-home-'));
  const project = join(home, '.claude', 'projects', 'p');
  mkdirSync(join(project, 'memory'), { recursive: true });
  writeFileSync(join(home, '.claude', 'settings.json'), '{}');
  writeFileSync(join(project, 'memory', 'MEMORY.md'), '# Memory');

  it('hashes repository harness files plus user settings and project memory', () => {
    const files = collectHarnessFiles({
      userSettings: join(home, '.claude', 'settings.json'),
      memoryDir: join(project, 'memory'),
    });
    assert.ok(files['scripts/claude/work-statistics.mjs']);
    assert.ok(files[USER_SETTINGS]);
    assert.ok(files[`${MEMORY_PREFIX}MEMORY.md`]);
    assert.equal(files['src/main.ts'], undefined);
    assert.deepEqual(
      Object.keys(files),
      Object.keys(files).sort((l, r) => l.localeCompare(r)),
    );
  });

  it('builds the current stand from files, model and version', () => {
    const current = currentHarness({
      transcript: join(project, 'session.jsonl'),
      model: 'm',
      version: '1',
      configDir: join(home, '.claude'),
    });
    assert.equal(current.stand, standHash(current));
    assert.ok(current.files[`${MEMORY_PREFIX}MEMORY.md`]);
    assert.equal(
      currentHarness({ model: 'm', version: '1', configDir: join(home, '.claude') }).files[
        USER_SETTINGS
      ],
      hashContent('{}'),
    );
  });

  it('reads a stored snapshot or null without one', () => {
    const path = join(home, 'state.json');
    assert.equal(readSnapshot(path), null);
    writeFileSync(path, JSON.stringify({ stand: 'abc' }));
    assert.deepEqual(readSnapshot(path), { stand: 'abc' });
  });
});
