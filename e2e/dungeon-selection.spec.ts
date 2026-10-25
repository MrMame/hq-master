import { expect, Locator, Page, test } from '@playwright/test';
import { createCharacter } from './support/create-character';

/** Klick am PC oder Tippen auf dem Tablet. */
type Press = (target: Locator) => Promise<void>;

const INPUT_DEVICES: { name: string; touch: boolean; press: Press }[] = [
  { name: 'PC', touch: false, press: (target) => target.click() },
  { name: 'Tablet', touch: true, press: (target) => target.tap() },
];

function token(page: Page): Locator {
  return page.locator('app-dungeon-token');
}

function legendEntry(page: Page): Locator {
  return page.locator('aside app-dungeon-legend-entry');
}

function actionBar(scope: Locator): Locator {
  return scope.getByRole('toolbar', { name: 'Aktionen für Ork' });
}

function editor(page: Page): Locator {
  return page.getByRole('dialog', { name: 'Charakter bearbeiten' });
}

/** „Charakter editieren“ öffnet den Editor mit dem markierten Charakter; „Abbrechen“ schließt ihn. */
async function editAndCancel(page: Page, press: Press, scope: Locator): Promise<void> {
  await press(actionBar(scope).getByRole('button', { name: 'Charakter editieren' }));
  await expect(editor(page).getByLabel('Name')).toHaveValue('Ork');
  await press(editor(page).getByRole('button', { name: 'Abbrechen' }));
  await expect(editor(page)).toBeHidden();
}

for (const device of INPUT_DEVICES) {
  test.describe(`selection on ${device.name}`, () => {
    test.use(device.touch ? { viewport: { width: 1024, height: 768 }, hasTouch: true } : {});

    test('a legend entry selects the token; its action bar opens the editor', async ({ page }) => {
      await createCharacter(page, 'Ork');
      await expect(page.getByRole('toolbar')).toHaveCount(0);

      await device.press(legendEntry(page).getByText('Ork'));
      await expect(legendEntry(page)).toHaveAttribute('aria-current', 'true');
      await expect(actionBar(token(page))).toBeVisible();
      await expect(actionBar(legendEntry(page))).toBeVisible();

      await editAndCancel(page, device.press, legendEntry(page));
      await expect(legendEntry(page)).toHaveAttribute('aria-current', 'true');

      await device.press(legendEntry(page).getByText('Ork'));
      await expect(legendEntry(page)).not.toHaveAttribute('aria-current', 'true');
      await expect(page.getByRole('toolbar')).toHaveCount(0);
    });

    test('a token selects the legend entry; its action bar opens the editor', async ({ page }) => {
      await createCharacter(page, 'Ork');

      await device.press(token(page).getByRole('img', { name: 'Ork' }));
      await expect(legendEntry(page)).toHaveAttribute('aria-current', 'true');
      await expect(actionBar(legendEntry(page))).toBeVisible();

      await editAndCancel(page, device.press, token(page));
      await expect(actionBar(token(page))).toBeVisible();
    });
  });
}
