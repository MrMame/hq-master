import { expect, Locator, Page, test } from '@playwright/test';

/** Klick am PC oder Tippen auf dem Tablet. */
type Press = (target: Locator) => Promise<void>;

/** Die Rückfrage vor dem Entfernen erscheint mit Maus wie mit Touch. */
const INPUT_DEVICES: { name: string; touch: boolean; press: Press }[] = [
  { name: 'PC', touch: false, press: (target) => target.click() },
  { name: 'Tablet', touch: true, press: (target) => target.tap() },
];

/** Der geöffnete Charakter-Editor (Material-Dialog), nicht die Rückfrage darüber. */
function editor(page: Page): Locator {
  return page.getByRole('dialog', { name: /^(Charakter bearbeiten|Neuer Charakter)$/ });
}

/** Rückfrage (`ConfirmationDialog`) vor dem Entfernen. */
function confirmation(page: Page): Locator {
  return page.getByRole('dialog', { name: 'Charakter entfernen' });
}

/** Seitenleiste des Dungeon Trackers mit der Charakter-Legende. */
function sidebar(page: Page): Locator {
  return page.locator('aside');
}

/** Legt im Character Tracker ein Monster an und öffnet es im Dungeon Tracker per Doppelklick. */
async function editNewMonster(page: Page): Promise<void> {
  await page.goto('/charactertracker');
  await page.getByRole('button', { name: 'Add Monster' }).click();
  await page.goto('/dungeontracker');

  await page.locator('app-dungeon-token > div').dblclick();
  await expect(editor(page).getByRole('heading', { name: 'Charakter bearbeiten' })).toBeVisible();
}

/** Drückt „Entfernen“; die Rückfrage nennt den Charakter, und „Abbrechen“ hat den Fokus. */
async function askToRemove(page: Page, press: Press): Promise<void> {
  const name: string = await editor(page).getByLabel('Name').inputValue();
  await press(editor(page).getByRole('button', { name: 'Entfernen' }));

  await expect(confirmation(page)).toContainText(`„${name}“ wirklich entfernen?`);
  await expect(confirmation(page).getByRole('button', { name: 'Abbrechen' })).toBeFocused();
}

test('a character edited via double click keeps its new name after a reload', async ({ page }) => {
  await editNewMonster(page);
  await editor(page).getByLabel('Name').fill('Grimgor');
  await editor(page).getByRole('button', { name: 'Übernehmen' }).click();

  await expect(editor(page)).toBeHidden();
  await expect(page).toHaveURL(/\/dungeontracker$/);
  await expect(sidebar(page).getByText('Grimgor')).toBeVisible();

  await page.reload();

  await expect(sidebar(page).getByText('Grimgor')).toBeVisible();
});

test('"Character Neu" adds a character as token and legend entry', async ({ page }) => {
  await page.goto('/dungeontracker');
  await expect(page.locator('app-dungeon-token')).toHaveCount(0);

  await sidebar(page).getByRole('button', { name: 'Character Neu' }).click();
  await expect(editor(page).getByRole('heading', { name: 'Neuer Charakter' })).toBeVisible();
  await editor(page).getByLabel('Name').fill('Neuling');
  await editor(page).getByRole('button', { name: 'Bild 1', exact: true }).click();
  await editor(page).getByRole('button', { name: 'Übernehmen' }).click();

  await expect(editor(page)).toBeHidden();
  await expect(sidebar(page).getByText('Charaktere (1)')).toBeVisible();
  await expect(sidebar(page).getByText('Neuling')).toBeVisible();
  await expect(page.locator('app-dungeon-token')).toHaveCount(1);
});

for (const device of INPUT_DEVICES) {
  test.describe(`"Entfernen" on ${device.name}`, () => {
    test.use(device.touch ? { viewport: { width: 1024, height: 768 }, hasTouch: true } : {});

    test('removes the character after confirmation', async ({ page }) => {
      await editNewMonster(page);
      await askToRemove(page, device.press);
      await device.press(confirmation(page).getByRole('button', { name: 'Entfernen' }));

      await expect(editor(page)).toBeHidden();
      await expect(page.locator('app-dungeon-token')).toHaveCount(0);
      await expect(sidebar(page).getByText('Charaktere (0)')).toBeVisible();

      await page.reload();

      await expect(sidebar(page).getByText('Charaktere (0)')).toBeVisible();
    });

    test('keeps the character when the confirmation is cancelled', async ({ page }) => {
      await editNewMonster(page);
      await askToRemove(page, device.press);
      await device.press(confirmation(page).getByRole('button', { name: 'Abbrechen' }));

      await expect(confirmation(page)).toBeHidden();
      await expect(editor(page)).toBeVisible();
      await device.press(editor(page).getByRole('button', { name: 'Abbrechen' }));

      await expect(editor(page)).toBeHidden();
      await expect(page.locator('app-dungeon-token')).toHaveCount(1);
      await expect(sidebar(page).getByText('Charaktere (1)')).toBeVisible();
    });
  });
}
