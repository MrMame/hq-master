import { EditorField } from './character-editor-dialog.fixtures';

/** Checkbox des Zustands mit dieser Beschriftung, z. B. „Gift“. */
export function conditionCheckbox(host: HTMLElement, label: string): HTMLInputElement {
  const checkbox: HTMLInputElement | null | undefined = Array.from(
    host.querySelectorAll('.conditions-editor__toggle'),
  )
    .find((toggle) => toggle.textContent?.trim().startsWith(label))
    ?.querySelector('input');
  if (!checkbox) throw new Error(`Zustand "${label}" nicht gefunden`);
  return checkbox;
}

/** Feld eines Zustands über sein `aria-label`, z. B. „Gift Dauer Minuten“; `null`, wenn es fehlt. */
export function conditionField(host: HTMLElement, label: string): EditorField | null {
  return host.querySelector<EditorField>(`[aria-label="${label}"]`);
}

/** Wie `conditionField`, wirft aber, wenn das Feld fehlt. */
export function requireConditionField(host: HTMLElement, label: string): EditorField {
  const field: EditorField | null = conditionField(host, label);
  if (!field) throw new Error(`Feld "${label}" nicht gefunden`);
  return field;
}
