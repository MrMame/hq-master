import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { describeHarnessChange, newStandRow } from './run-record.mjs';
import { createStand } from './testing/statistics.fixtures.mjs';

const snapshot = { stand: 'aaaa1111', model: 'm', version: '1', files: { a: '1', b: '1' } };
const current = { stand: 'bbbb2222', model: 'm', version: '1', files: { a: '1', b: '2' } };

describe('describeHarnessChange', () => {
  it('describes the first stand, file changes, model and version', () => {
    assert.equal(describeHarnessChange(null, current), 'erster Stand (2 Dateien)');
    assert.equal(
      describeHarnessChange(
        { ...snapshot, files: { a: '1', c: '1' } },
        { ...current, version: '2', model: 'n' },
      ),
      '+ b, − c, Modell m → n, Claude Code 1 → 2',
    );
  });

  it('shortens long file lists', () => {
    const files = Object.fromEntries([...Array(15).keys()].map((key) => [`f${key}`, '1']));
    assert.match(
      describeHarnessChange({ ...snapshot, files: {} }, { ...current, files }),
      /… \(\+3\)$/,
    );
  });
});

describe('newStandRow', () => {
  it('marks measurement breaks and defaults to an open classification', () => {
    const row = newStandRow(snapshot, current, '2026-11-01 10:25');
    assert.deepEqual(row, {
      ...createStand({ stand: 'bbbb2222', model: 'm', version: '1', since: '2026-11-01 10:25' }),
      impact: 'offen',
      files: '~ b',
    });
    const measured = {
      ...current,
      files: { ...current.files, 'scripts/claude/git-files.mjs': '1' },
    };
    assert.equal(newStandRow(snapshot, measured, '').breaks, true);
    assert.equal(newStandRow(null, current, '').breaks, true);
  });
});
