import { Locator, Page } from '@playwright/test';

/** Bildschirmposition auf dem Plan des Dungeon Builders, in Kacheln (Nachkommastellen erlaubt). */
export interface PlanSpot {
  x: number;
  y: number;
}

export function main(page: Page): Locator {
  return page.getByRole('main');
}

/** Menüleiste am markierten Element des Plans. */
export function actionBar(page: Page): Locator {
  return main(page).getByRole('toolbar', { name: 'Aktionen für das markierte Element' });
}

/** Plan-Koordinaten in Kacheln → Bildschirm-Pixel; der Startplan hat 26 Spalten. */
export async function planToScreen(page: Page, spot: PlanSpot): Promise<PlanSpot> {
  const surface: Locator = page.getByTestId('plan-surface');
  const box: { x: number; y: number; width: number } = (await surface.boundingBox())!;
  const columns: number = Number(await page.getByTestId('layout-columns').inputValue());
  const tile: number = box.width / columns;
  return { x: box.x + spot.x * tile, y: box.y + spot.y * tile };
}

/** Zieht mit der Maus über den Plan (Pinsel, Rechteck, Wand, Verschieben). */
export async function dragOnPlan(page: Page, from: PlanSpot, to: PlanSpot): Promise<void> {
  const start: PlanSpot = await planToScreen(page, from);
  const end: PlanSpot = await planToScreen(page, to);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 8 });
  await page.mouse.up();
}

/** Zieht einen Bibliothekseintrag mit der Maus auf den Plan. */
export async function dragFromLibrary(page: Page, entry: Locator, to: PlanSpot): Promise<void> {
  // Die Bibliothek scrollt in der Seitenleiste; Mausbefehle scrollen nicht von selbst.
  await entry.scrollIntoViewIfNeeded();
  const box: { x: number; y: number; width: number; height: number } = (await entry.boundingBox())!;
  const end: PlanSpot = await planToScreen(page, to);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 15 });
  await page.mouse.up();
}

/** Gespeichertes Layout aus dem localStorage (Key `TOOL_STATE_KEYS.dungeonBuilderLayout`). */
export function storedLayout(page: Page): Promise<{
  floor: Record<string, string>;
  pieces: { catalogId: string; rotation: number }[];
  walls: unknown[];
  doors: unknown[];
}> {
  return page.evaluate(() => JSON.parse(localStorage.getItem('dungeon_builder_layout') ?? 'null'));
}
