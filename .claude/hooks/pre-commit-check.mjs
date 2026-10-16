// PreToolUse (Bash: git commit): blockiert den Commit, wenn gestagte Dateien
// nicht Prettier-formatiert sind oder der Build fehlschlägt (Exit-Code 2).
import { readFileSync } from 'node:fs';
import { execSync, spawnSync } from 'node:child_process';
import * as prettier from 'prettier';

const staged = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const unformatted = [];
for (const file of staged) {
  const info = await prettier.getFileInfo(file, { ignorePath: '.prettierignore' });
  if (info.ignored || !info.inferredParser) continue;
  const options = (await prettier.resolveConfig(file)) ?? {};
  const source = readFileSync(file, 'utf8');
  if (!(await prettier.check(source, { ...options, filepath: file }))) unformatted.push(file);
}

if (unformatted.length > 0) {
  console.error(`Commit blockiert – nicht Prettier-formatiert:\n${unformatted.join('\n')}`);
  process.exit(2);
}

const build = spawnSync('npm run build', { shell: true, encoding: 'utf8' });
if (build.status !== 0) {
  console.error(`Commit blockiert – npm run build schlägt fehl:\n${build.stdout}\n${build.stderr}`);
  process.exit(2);
}
