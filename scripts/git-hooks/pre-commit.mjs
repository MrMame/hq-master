// Git pre-commit (husky): blockiert den Commit, wenn gestagte Dateien nicht
// Prettier-formatiert sind oder Lint-Fehler bestehen (Exit 1). Geprüft wird
// der gestagte Inhalt (Index), nicht die Working Copy – sonst lösen
// CRLF-Zeilenenden (core.autocrlf) Fehlalarme aus. Build und Tests laufen
// erst im pre-push, damit der Commit schnell bleibt.
import { execFileSync, execSync, spawnSync } from 'node:child_process';
import * as prettier from 'prettier';

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
  process.exit(1);
}

const lint = spawnSync('npm run lint', { shell: true, encoding: 'utf8' });
if (lint.status !== 0) {
  console.error(`Commit blockiert – npm run lint schlägt fehl:\n${lint.stdout}\n${lint.stderr}`);
  process.exit(1);
}
