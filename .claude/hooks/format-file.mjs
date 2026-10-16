// PostToolUse (Edit|Write): formatiert die bearbeitete Datei mit Prettier.
import { readFileSync, writeFileSync } from 'node:fs';
import * as prettier from 'prettier';

const input = JSON.parse(readFileSync(0, 'utf8'));
const filePath = input.tool_response?.filePath ?? input.tool_input?.file_path;
if (!filePath) process.exit(0);

const info = await prettier.getFileInfo(filePath, { ignorePath: '.prettierignore' });
if (info.ignored || !info.inferredParser) process.exit(0);

const source = readFileSync(filePath, 'utf8');
const options = (await prettier.resolveConfig(filePath)) ?? {};
const formatted = await prettier.format(source, { ...options, filepath: filePath });
if (formatted !== source) writeFileSync(filePath, formatted);
