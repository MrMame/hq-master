// Neue, geänderte, verschobene und gelöschte Dateien seit dem Branch-Start
// (auf development: seit HEAD, also nur nicht committete Änderungen) und der Umfang in Zeilen.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const MAIN_BRANCH = 'development';
// Nicht zum Umfang zählen: generierte Logs und Lockfiles.
export const SCOPE_EXCLUDES = [
  ':(exclude)docs/project-logs/**',
  ':(exclude)ai-implementations-log.md',
  ':(exclude)**/package-lock.json',
  ':(exclude)**/yarn.lock',
  ':(exclude)**/pnpm-lock.yaml',
];

const gitIn =
  (cwd) =>
  (...args) =>
    execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const lines = (text) => text.split(/\r?\n/).filter(Boolean);
export const lineCount = (text) =>
  text === '' ? 0 : text.replace(/\r?\n$/, '').split(/\n/).length;

function baseOf(git) {
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  return branch === MAIN_BRANCH ? 'HEAD' : git('merge-base', MAIN_BRANCH, 'HEAD');
}

export function parseNameStatus(nameStatus, untracked) {
  const files = { added: 0, modified: 0, renamed: 0, deleted: 0 };
  const keys = { A: 'added', M: 'modified', R: 'renamed', C: 'added', D: 'deleted', T: 'modified' };
  for (const line of nameStatus.split(/\r?\n/)) {
    const key = keys[line.charAt(0)];
    if (key) files[key] += 1;
  }
  files.added += lines(untracked).length;
  return files;
}

export function changedFiles(cwd = process.cwd()) {
  const git = gitIn(cwd);
  const base = baseOf(git);
  return {
    base: base === 'HEAD' ? 'nicht committete Änderungen' : `seit ${base.slice(0, 7)}`,
    ...parseNameStatus(
      git('diff', '--name-status', '-M', base),
      git('ls-files', '--others', '--exclude-standard'),
    ),
  };
}

// Pfade aller Änderungen seit der Basis inkl. neuer Dateien (für „Lauf ändert den Harness“).
export function changedPaths(cwd = process.cwd()) {
  const git = gitIn(cwd);
  return [
    ...lines(git('diff', '--name-only', baseOf(git))),
    ...lines(git('ls-files', '--others', '--exclude-standard')),
  ];
}

export function parseShortstat(text) {
  return {
    added: Number(/(\d+) insertions?/.exec(text)?.[1] ?? 0),
    removed: Number(/(\d+) deletions?/.exec(text)?.[1] ?? 0),
  };
}

// Geänderte Zeilen seit der Basis; neue, noch nicht getrackte Dateien zählen voll als hinzugefügt.
export function diffLines(cwd = process.cwd()) {
  const git = gitIn(cwd);
  const tracked = parseShortstat(
    git('diff', '--shortstat', baseOf(git), '--', '.', ...SCOPE_EXCLUDES),
  );
  const untracked = lines(
    git('ls-files', '--others', '--exclude-standard', '--', '.', ...SCOPE_EXCLUDES),
  );
  const newLines = untracked.reduce(
    (total, path) => total + lineCount(readFileSync(join(cwd, path), 'utf8')),
    0,
  );
  return { added: tracked.added + newLines, removed: tracked.removed };
}

export function commitDiffLines(commit, cwd = process.cwd()) {
  const git = gitIn(cwd);
  return parseShortstat(
    git('diff', '--shortstat', `${commit}^`, commit, '--', '.', ...SCOPE_EXCLUDES),
  );
}
