import { expect, Locator, Page } from '@playwright/test';

/** Optionale Startwerte; ohne Angabe startet ein neuer Charakter mit 0 Leben und 0 Rüstung. */
export interface CharacterStartValues {
  Leben?: number;
  Ruestung?: number;
}

/** Legt im Dungeon Tracker über „Neuer Charakter“ einen Charakter mit Namen und erstem Bild an. */
export async function createCharacter(
  page: Page,
  name: string,
  values: CharacterStartValues = {},
): Promise<void> {
  await page.goto('/dungeontracker');
  await page.getByRole('button', { name: 'Neuer Charakter' }).click();

  const editor: Locator = page.getByRole('dialog', { name: 'Neuer Charakter' });
  await editor.getByLabel('Name').fill(name);
  if (values.Leben !== undefined)
    await editor.getByLabel('Leben', { exact: true }).fill(String(values.Leben));
  if (values.Ruestung !== undefined)
    await editor.getByLabel('Ruestung', { exact: true }).fill(String(values.Ruestung));
  await editor.getByRole('button', { name: 'Bild 1', exact: true }).click();
  await editor.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(editor).toBeHidden();
}
