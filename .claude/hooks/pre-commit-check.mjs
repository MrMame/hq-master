// PreToolUse (Bash: git commit): blockiert den Commit, wenn gestagte Dateien
// nicht Prettier-formatiert sind, Lint-Fehler bestehen oder der Build
// fehlschlägt (Exit-Code 2). Geprüft wird der gestagte Inhalt (Index), nicht
// die Working Copy – sonst lösen CRLF-Zeilenenden (core.autocrlf) Fehlalarme aus.
import { readFileSync } from 'node:fs';
import { execFileSync, execSync, spawnSync } from 'node:child_process';
import * as prettier from 'prettier';

// Die `if`-Bedingung in settings.json greift auch bei zusammengesetzten Befehlen
// ohne Commit (&&-Ketten, Heredocs, $(…)) – daher den Befehl selbst prüfen.
const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
if (!/\bgit\s+commit\b/.test(input.tool_input?.command ?? '')) process.exit(0);

const staged = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const unformatted = [];
for (const file of staged) {
  const info = await prettier.getFileInfo(file, { ignorePath: '.prettierignore' });
  if (info.ignored || !info.inferredParser) continue;
  const options = (await prettier.resolveConfig(file)) ?? {};
  const source = execFileSync('git', ['show', `:${file}`], { encoding: 'utf8' });
  if (!(await prettier.check(source, { ...options, filepath: file }))) unformatted.push(file);
}

if (unformatted.length > 0) {
  console.error(`Commit blockiert – nicht Prettier-formatiert:\n${unformatted.join('\n')}`);
  process.exit(2);
}

for (const script of ['lint', 'build']) {
  const run = spawnSync(`npm run ${script}`, { shell: true, encoding: 'utf8' });
  if (run.status !== 0) {
    console.error(
      `Commit blockiert – npm run ${script} schlägt fehl:\n${run.stdout}\n${run.stderr}`,
    );
    process.exit(2);
  }
}
