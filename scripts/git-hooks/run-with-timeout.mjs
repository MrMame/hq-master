// Gemeinsame Prozess-Logik für Git-Hooks und Claude-Stop-Hook: Befehl mit
// eigenem Timeout ausführen und bei Überschreitung den gesamten Prozessbaum
// beenden, damit keine verwaisten node-Prozesse (npm → ng test → vitest)
// zurückbleiben (z. B. bei einer synchronen Endlosschleife im Test).
import { spawn, spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';

// Vitest findet unter Windows seinen Runner nicht, wenn der Laufwerksbuchstabe klein ist (f:\…).
export function projectCwd() {
  return process.cwd().replace(/^[a-z]:/, (drive) => drive.toUpperCase());
}

export function runCommand(command, { timeoutS, cwd = projectCwd(), echo = false }) {
  return new Promise((resolve) => {
    const child = spawn(command, { shell: true, cwd, detached: !isWindows });
    let collected = '';
    const collect = (chunk) => {
      if (echo) process.stdout.write(chunk);
      collected = (collected + chunk).slice(-16000);
    };
    child.stdout.setEncoding('utf8').on('data', collect);
    child.stderr.setEncoding('utf8').on('data', collect);
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      killProcessTree(child.pid);
    }, timeoutS * 1000);
    child.on('close', (status) => {
      clearTimeout(timer);
      resolve({ status, output: collected, timedOut });
    });
  });
}

export function lastLines(text, count) {
  return text.trimEnd().split(/\r?\n/).slice(-count).join('\n');
}

function killProcessTree(pid) {
  if (isWindows) {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F']);
    return;
  }
  try {
    process.kill(-pid, 'SIGKILL');
  } catch {
    // Prozessgruppe bereits beendet
  }
}
