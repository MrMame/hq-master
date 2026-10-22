import { expect, Locator, Page } from '@playwright/test';

/** Optionale Startwerte; ohne Angabe startet ein neuer Charakter mit 0 Leben und 0 Rüstung. */
export interface CharacterStartValues {
  health?: number;
  armor?: number;
}

/** Legt im Dungeon Tracker über „Character Neu“ einen Charakter mit Namen und erstem Bild an. */
export async function createCharacter(
  page: Page,
  name: string,
  values: CharacterStartValues = {},
): Promise<void> {
  await page.goto('/dungeontracker');
  await page.locator('aside').getByRole('button', { name: 'Character Neu' }).click();

  const editor: Locator = page.getByRole('dialog', { name: 'Neuer Charakter' });
  await editor.getByLabel('Name').fill(name);
  if (values.health !== undefined) await editor.getByLabel('Leben').fill(String(values.health));
  if (values.armor !== undefined) await editor.getByLabel('Rüstung').fill(String(values.armor));
  await editor.getByRole('button', { name: 'Bild 1', exact: true }).click();
  await editor.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(editor).toBeHidden();
}
