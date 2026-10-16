// UserPromptSubmit / PostToolUse / Stop: schreibt pro Ereignis eine kompakte
// Zeile nach .claude/logs/activity.log. Kostet keine Tokens und blockiert nie.
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const MAX = 120;
const oneLine = (text) =>
  String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
const cut = (text) =>
  oneLine(text).length > MAX ? `${oneLine(text).slice(0, MAX)}…` : oneLine(text);

try {
  const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const rel = (path) => (path ? relative(projectDir, path).replace(/\\/g, '/') || path : '');

  const describeTool = (name, args = {}) => {
    switch (name) {
      case 'Read':
      case 'Edit':
      case 'Write':
      case 'NotebookEdit':
        return rel(args.file_path ?? args.notebook_path);
      case 'Bash':
        return `${args.description ? `(${oneLine(args.description)}) ` : ''}${cut(args.command)}`;
      case 'Grep':
        return `"${args.pattern}"${args.path ? ` in ${rel(args.path)}` : ''}`;
      case 'Glob':
        return args.pattern;
      case 'Agent':
        return `${args.subagent_type ?? 'general-purpose'}: ${cut(args.description)}`;
      case 'Skill':
        return `${args.skill}${args.args ? ` ${cut(args.args)}` : ''}`;
      case 'WebFetch':
        return args.url;
      case 'WebSearch':
        return cut(args.query);
      default: {
        const firstText = Object.values(args).find((value) => typeof value === 'string');
        return cut(firstText);
      }
    }
  };

  const events = {
    UserPromptSubmit: () => ['PROMPT', cut(input.prompt)],
    PostToolUse: () => [input.tool_name, describeTool(input.tool_name, input.tool_input)],
    Stop: () => ['STOP', '── Antwort fertig ──'],
  };
  const build = events[input.hook_event_name];
  if (build) {
    const [kind, detail] = build();
    const stamp = new Date().toLocaleString('sv-SE');
    const prefix = input.agent_id ? '[sub] ' : '';
    const logDir = join(projectDir, '.claude', 'logs');
    mkdirSync(logDir, { recursive: true });
    appendFileSync(join(logDir, 'activity.log'), `${stamp}  ${prefix}${kind.padEnd(8)}${detail}\n`);
  }
} catch {
  // Logging darf die Sitzung nie stören.
}
process.exit(0);
