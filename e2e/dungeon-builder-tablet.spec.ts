import { expect, test } from '@playwright/test';
import { actionBar, main, planToScreen, PlanSpot, storedLayout } from './support/builder-plan';

test.use({ viewport: { width: 1024, height: 768 }, hasTouch: true });

test('dungeon builder on Tablet: places, selects, turns and removes an element by tapping', async ({
  page,
}) => {
  await page.goto('/dungeonbuilder');
  await main(page).getByRole('button', { name: 'Truhe (1 × 1)', exact: true }).tap();
  const spot: PlanSpot = await planToScreen(page, { x: 3.5, y: 3.5 });
  await page.touchscreen.tap(spot.x, spot.y);
  expect((await storedLayout(page)).pieces).toHaveLength(1);

  await main(page).getByRole('button', { name: 'Auswahl' }).tap();
  await page.touchscreen.tap(spot.x, spot.y);
  await actionBar(page).getByRole('button', { name: 'Drehen' }).tap();
  expect((await storedLayout(page)).pieces[0].rotation).toBe(90);

  await actionBar(page).getByRole('button', { name: 'Löschen' }).tap();
  expect((await storedLayout(page)).pieces).toEqual([]);
});
