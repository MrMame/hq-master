import { expect, Locator, Page } from '@playwright/test';

/** Legt im Dungeon Tracker über „Character Neu“ einen Charakter mit Namen und erstem Bild an. */
export async function createCharacter(page: Page, name: string): Promise<void> {
  await page.goto('/dungeontracker');
  await page.locator('aside').getByRole('button', { name: 'Character Neu' }).click();

  const editor: Locator = page.getByRole('dialog', { name: 'Neuer Charakter' });
  await editor.getByLabel('Name').fill(name);
  await editor.getByRole('button', { name: 'Bild 1', exact: true }).click();
  await editor.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(editor).toBeHidden();
}
