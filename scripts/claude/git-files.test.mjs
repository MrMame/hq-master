import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  changedFiles,
  changedPaths,
  commitDiffLines,
  diffLines,
  lineCount,
  parseNameStatus,
  parseShortstat,
} from './git-files.mjs';

describe('parseNameStatus', () => {
  it('counts added, modified, renamed and deleted files including untracked ones', () => {
    const nameStatus = [
      'A\tsrc/neu.ts',
      'M\tsrc/app.ts',
      'M\tsrc/app.css',
      'R100\tdocs/a.md\tdocs/done/a.md',
      'D\tsrc/alt.ts',
      'T\tsrc/link.ts',
    ].join('\n');
    assert.deepEqual(parseNameStatus(nameStatus, 'scripts/x.mjs\nscripts/y.mjs\n'), {
      added: 3,
      modified: 3,
      renamed: 1,
      deleted: 1,
    });
  });

  it('returns zeros without changes', () => {
    assert.deepEqual(parseNameStatus('', ''), { added: 0, modified: 0, renamed: 0, deleted: 0 });
  });
});

describe('changedFiles', () => {
  it('reads the working tree of this repository', () => {
    const files = changedFiles();
    assert.match(files.base, /^(nicht committete Änderungen|seit [0-9a-f]{7})$/);
    assert.ok(files.added >= 0 && files.modified >= 0);
  });
});

describe('parseShortstat / lineCount', () => {
  it('reads insertions and deletions, also in singular or when missing', () => {
    assert.deepEqual(parseShortstat(' 5 files changed, 30 insertions(+), 22 deletions(-)'), {
      added: 30,
      removed: 22,
    });
    assert.deepEqual(parseShortstat(' 1 file changed, 1 insertion(+)'), { added: 1, removed: 0 });
    assert.deepEqual(parseShortstat(''), { added: 0, removed: 0 });
  });

  it('counts lines of new files including empty ones', () => {
    assert.equal(lineCount(''), 0);
    assert.equal(lineCount('a\n\nb\n'), 3);
    assert.equal(lineCount('a\r\nb'), 2);
  });
});

describe('changedPaths / diffLines / commitDiffLines', () => {
  it('reads paths and line counts of this repository', () => {
    assert.ok(Array.isArray(changedPaths()));
    const lines = diffLines();
    assert.ok(lines.added >= 0 && lines.removed >= 0);
  });

  it('excludes project logs from the diff of a commit', () => {
    assert.deepEqual(commitDiffLines('2ba0d85'), { added: 30, removed: 22 });
  });
});
