/** Befehle, die am PC per Taste ausgelöst werden. */
export type BuilderShortcut = 'rotate' | 'remove' | 'escape' | 'undo' | 'redo';

/** Tastenkürzel greifen nicht, solange ein Eingabefeld (z. B. Layoutname) den Fokus hat. */
function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/** Befehl zu einem Tastendruck oder `null`, wenn die Taste nichts auslöst. */
export function shortcutFor(event: KeyboardEvent): BuilderShortcut | null {
  if (isTyping(event.target)) return null;
  const key: string = event.key.toLowerCase();
  if (event.ctrlKey || event.metaKey) {
    if (key === 'z') return event.shiftKey ? 'redo' : 'undo';
    return key === 'y' ? 'redo' : null;
  }
  if (event.altKey) return null;
  if (key === 'r') return 'rotate';
  if (key === 'delete' || key === 'backspace') return 'remove';
  return key === 'escape' ? 'escape' : null;
}
