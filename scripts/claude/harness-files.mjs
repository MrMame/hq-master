// Harness = alle Dateien, die beeinflussen, wie Claude arbeitet oder wie gemessen wird
// (siehe .claude/rules/work-statistics.md). Der Stand ist ein Hash über ihre Inhalte, nicht über
// Git-Commits, damit auch ungespeicherte Änderungen zählen.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export const HARNESS_PATHS = [
  '.claude/CLAUDE.md',
  '.claude/settings.json',
  '.claude/rules/',
  '.claude/skills/',
  '.claude/hooks/',
  'scripts/claude/',
  'scripts/git-hooks/',
  '.husky/',
  'vitest.config.ts',
  'playwright.config.ts',
];
// Änderungen hieran verändern die gemessenen Werte selbst → Messbruch.
export const MEASUREMENT_FILES = [
  'scripts/claude/work-statistics.mjs',
  'scripts/claude/activity-log.mjs',
  'scripts/claude/check-output.mjs',
  'scripts/claude/transcript-usage.mjs',
  'scripts/claude/transcript-model.mjs',
  'scripts/claude/git-files.mjs',
  'scripts/claude/format-statistics.mjs',
  '.claude/hooks/log-activity.mjs',
];
export const USER_SETTINGS = '~/.claude/settings.json';
export const MEMORY_PREFIX = '~/.claude/projects/<projekt>/memory/';

export function isHarnessFile(path) {
  if (path.endsWith('.test.mjs') || path.startsWith('scripts/claude/testing/')) return false;
  return HARNESS_PATHS.some((entry) =>
    entry.endsWith('/') ? path.startsWith(entry) : path === entry,
  );
}

export const hashContent = (text) =>
  createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex').slice(0, 12);

function readHashes(entries) {
  return Object.fromEntries(
    entries
      .filter(([, path]) => existsSync(path))
      .map(([key, path]) => [key, hashContent(readFileSync(path, 'utf8'))]),
  );
}

// Repo-Dateien (getrackt oder neu, nicht ignoriert) plus Nutzer-Settings und Projekt-Memory.
export function collectHarnessFiles({ cwd = process.cwd(), userSettings, memoryDir } = {}) {
  const listed = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
    cwd,
    encoding: 'utf8',
  });
  const repo = listed
    .split(/\r?\n/)
    .filter(isHarnessFile)
    .map((path) => [path, join(cwd, path)]);
  const external = userSettings ? [[USER_SETTINGS, userSettings]] : [];
  const memory =
    memoryDir && existsSync(memoryDir)
      ? readdirSync(memoryDir).map((name) => [`${MEMORY_PREFIX}${name}`, join(memoryDir, name)])
      : [];
  const files = readHashes([...repo, ...external, ...memory]);
  return Object.fromEntries(
    Object.entries(files).sort(([left], [right]) => left.localeCompare(right)),
  );
}

export function standHash({ files, model, version }) {
  const content = [...Object.entries(files).map((entry) => entry.join(' ')), model, version];
  return createHash('sha256').update(content.join('\n')).digest('hex').slice(0, 8);
}

export function diffHarness(previous = {}, next = {}) {
  const keys = [...new Set([...Object.keys(previous), ...Object.keys(next)])].sort();
  return {
    added: keys.filter((key) => !(key in previous)),
    changed: keys.filter((key) => key in previous && key in next && previous[key] !== next[key]),
    removed: keys.filter((key) => !(key in next)),
  };
}

export function isMeasurementBreak({ added, changed, removed }) {
  return [...added, ...changed, ...removed].some((path) => MEASUREMENT_FILES.includes(path));
}

// Aktueller Stand für das Statistiklog; das Memory liegt neben dem Sitzungsprotokoll.
export function currentHarness({ transcript, model, version, configDir = defaultConfigDir() }) {
  const files = collectHarnessFiles({
    userSettings: join(configDir, 'settings.json'),
    memoryDir: transcript ? join(dirname(transcript), 'memory') : undefined,
  });
  return { stand: standHash({ files, model, version }), model, version, files };
}

export const readSnapshot = (path) =>
  existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;

function defaultConfigDir() {
  return process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude');
}
