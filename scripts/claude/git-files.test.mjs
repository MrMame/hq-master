import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { changedFiles, parseNameStatus } from './git-files.mjs';

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
