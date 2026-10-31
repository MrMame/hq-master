// Neue, geänderte, verschobene und gelöschte Dateien seit dem Branch-Start
// (auf development: seit HEAD, also nur nicht committete Änderungen).
import { execFileSync } from 'node:child_process';

const MAIN_BRANCH = 'development';

export function parseNameStatus(nameStatus, untracked) {
  const files = { added: 0, modified: 0, renamed: 0, deleted: 0 };
  const keys = { A: 'added', M: 'modified', R: 'renamed', C: 'added', D: 'deleted', T: 'modified' };
  for (const line of nameStatus.split(/\r?\n/)) {
    const key = keys[line.charAt(0)];
    if (key) files[key] += 1;
  }
  files.added += untracked.split(/\r?\n/).filter(Boolean).length;
  return files;
}

export function changedFiles(cwd = process.cwd()) {
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  const base = branch === MAIN_BRANCH ? 'HEAD' : git('merge-base', MAIN_BRANCH, 'HEAD');
  return {
    base: branch === MAIN_BRANCH ? 'nicht committete Änderungen' : `seit ${base.slice(0, 7)}`,
    ...parseNameStatus(
      git('diff', '--name-status', '-M', base),
      git('ls-files', '--others', '--exclude-standard'),
    ),
  };
}
