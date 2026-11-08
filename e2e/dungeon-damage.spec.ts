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

/** Menüleiste unter dem markierten Token. */
function tokenActionBar(page: Page): Locator {
  return token(page).getByRole('toolbar', { name: 'Aktionen für Ork' });
}

function legendEntry(page: Page): Locator {
  return page.locator('aside app-dungeon-legend-entry');
}

/** Legende und – solange markiert – das Token zeigen dieselben aktuellen Werte. */
async function expectValues(
  page: Page,
  Leben: string,
  Ruestung: string,
  tokenSelected: boolean = true,
): Promise<void> {
  if (!tokenSelected) await expect(token(page).getByLabel('Leben', { exact: true })).toHaveCount(0);
  for (const scope of tokenSelected ? [token(page), legendEntry(page)] : [legendEntry(page)]) {
    await expect(scope.getByLabel('Leben', { exact: true })).toHaveText(Leben);
    await expect(scope.getByLabel('Rüstung', { exact: true })).toHaveText(Ruestung);
  }
}

/** Öffnet über einen Button (Menüleiste am Token oder Wert in der Legende) den Dialog und wählt den Wert. */
async function hit(
  page: Page,
  press: Press,
  button: string,
  value: number,
  scope: Locator = tokenActionBar(page),
): Promise<void> {
  await press(scope.getByRole('button', { name: button }));
  const dialog: Locator = page.getByRole('dialog', { name: `${button}: Ork` });
  await press(dialog.getByRole('button', { name: String(value), exact: true }));
  await expect(dialog).toBeHidden();
}

for (const device of INPUT_DEVICES) {
  test.describe(`damage on ${device.name}`, () => {
    test.use(device.touch ? { viewport: { width: 1024, height: 768 }, hasTouch: true } : {});

    test('damage via the action bar at the token changes token and legend and survives a reload', async ({
      page,
    }) => {
      await createCharacter(page, 'Ork', { Leben: 20, Ruestung: 5 });
      await expectValues(page, '20', '5', false);
      await expect(token(page).getByRole('button')).toHaveCount(0);

      await device.press(token(page).getByRole('img', { name: 'Ork' }));

      await hit(page, device.press, 'Schaden auf Leben', 7);
      await expectValues(page, '13', '5');

      await hit(page, device.press, 'Schaden auf Rüstung', 7);
      await expectValues(page, '11', '0');

      await page.reload();

      // Die Markierung ist UI-Zustand und nach dem Reload weg.
      await expectValues(page, '11', '0', false);
    });

    test('a click on a legend value applies damage without selecting the token', async ({
      page,
    }) => {
      await createCharacter(page, 'Ork', { Leben: 20, Ruestung: 5 });

      await hit(page, device.press, 'Schaden auf Leben', 4, legendEntry(page));
      await expectValues(page, '16', '5', false);

      await hit(page, device.press, 'Schaden auf Rüstung', 7, legendEntry(page));
      await expectValues(page, '14', '0', false);
      await expect(token(page).getByRole('button')).toHaveCount(0);
      await expect(page.getByRole('toolbar')).toHaveCount(0);
    });
  });
}
