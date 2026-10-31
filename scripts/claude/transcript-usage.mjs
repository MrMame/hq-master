// Summiert den Tokenverbrauch aus Claude-Code-Sitzungsprotokollen (*.jsonl). Eine Antwort
// steht dort über mehrere Zeilen verteilt mit gleicher message.id und gleichem usage.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const EMPTY_USAGE = Object.freeze({
  messages: 0,
  input: 0,
  cacheWrite: 0,
  cacheRead: 0,
  output: 0,
});

function parseJsonLine(line) {
  try {
    return JSON.parse(line);
  } catch {
    return undefined;
  }
}

export function sumUsage(jsonlText, since) {
  const byMessage = new Map();
  for (const line of jsonlText.split(/\r?\n/)) {
    const entry = parseJsonLine(line);
    const message = entry?.message;
    if (!message?.id || !message.usage || new Date(entry.timestamp) < since) continue;
    byMessage.set(message.id, message.usage);
  }
  const total = { ...EMPTY_USAGE, messages: byMessage.size };
  for (const usage of byMessage.values()) {
    total.input += usage.input_tokens ?? 0;
    total.cacheWrite += usage.cache_creation_input_tokens ?? 0;
    total.cacheRead += usage.cache_read_input_tokens ?? 0;
    total.output += usage.output_tokens ?? 0;
  }
  return total;
}

export function addUsage(left, right) {
  return Object.fromEntries(Object.keys(EMPTY_USAGE).map((key) => [key, left[key] + right[key]]));
}

export function totalTokens(usage) {
  return usage.input + usage.cacheWrite + usage.cacheRead + usage.output;
}

// Sucht <sitzung>.jsonl in allen Projektordnern; Subagenten liegen unter <sitzung>/subagents/.
export function findTranscripts(sessionId, projectsDir = defaultProjectsDir()) {
  if (!existsSync(projectsDir)) return { main: [], sub: [] };
  for (const project of readdirSync(projectsDir)) {
    const main = join(projectsDir, project, `${sessionId}.jsonl`);
    if (!existsSync(main)) continue;
    const subDir = join(projectsDir, project, sessionId, 'subagents');
    const sub = existsSync(subDir)
      ? readdirSync(subDir)
          .filter((name) => name.endsWith('.jsonl'))
          .map((name) => join(subDir, name))
      : [];
    return { main: [main], sub };
  }
  return { main: [], sub: [] };
}

export function usageOfFiles(paths, since) {
  return paths
    .map((path) => sumUsage(readFileSync(path, 'utf8'), since))
    .reduce(addUsage, { ...EMPTY_USAGE });
}

function defaultProjectsDir() {
  return join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude'), 'projects');
}
