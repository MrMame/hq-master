import { Download, expect, Locator, Page, test } from '@playwright/test';
import {
  actionBar,
  dragFromLibrary,
  dragOnPlan,
  main,
  planToScreen,
  PlanSpot,
  storedLayout,
} from './support/builder-plan';

async function clickPlan(page: Page, spot: PlanSpot): Promise<void> {
  const target: PlanSpot = await planToScreen(page, spot);
  await page.mouse.click(target.x, target.y);
}

/**
 * Gibt die heruntergeladene Datei über ein Datei-Feld an die Seite und liefert, ob sie mit der
 * JPEG-Signatur beginnt, sowie ihre Bildgröße in Pixeln.
 */
async function inspectImage(page: Page, download: Download): Promise<[boolean, number, number]> {
  await page.evaluate(() => {
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.id = 'e2e-downloaded-image';
    document.body.append(input);
  });
  await page.locator('#e2e-downloaded-image').setInputFiles(await download.path());
  return page.evaluate(async () => {
    const input: HTMLInputElement = document.querySelector('#e2e-downloaded-image')!;
    const file: File = input.files![0];
    const head: Uint8Array = new Uint8Array(await file.slice(0, 3).arrayBuffer());
    const bitmap: ImageBitmap = await createImageBitmap(file);
    return [head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff, bitmap.width, bitmap.height];
  });
}

test.describe('dungeon builder on PC', () => {
  test.use({ viewport: { width: 1400, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/dungeontracker');
    await page.getByRole('link', { name: 'Dungeon Builder' }).click();
    await expect(
      main(page).getByRole('button', { name: 'Tisch (3 × 2)', exact: true }),
    ).toBeVisible();
  });

  test('builds a room with walls and furniture, edits it and keeps it after a reload', async ({
    page,
  }) => {
    await main(page).getByRole('button', { name: 'Rechteck' }).click();
    await dragOnPlan(page, { x: 2.5, y: 2.5 }, { x: 9.5, y: 7.5 });
    await main(page).getByRole('button', { name: 'Wand' }).click();
    await dragOnPlan(page, { x: 2, y: 2 }, { x: 10, y: 2 });

    await dragFromLibrary(
      page,
      main(page).getByRole('button', { name: 'Tisch (3 × 2)', exact: true }),
      {
        x: 5.5,
        y: 4.5,
      },
    );
    await main(page).getByRole('button', { name: 'Truhe (1 × 1)', exact: true }).click();
    await clickPlan(page, { x: 8.5, y: 6.5 });
    await page.keyboard.press('Escape');

    await main(page).getByRole('button', { name: 'Auswahl' }).click();
    await clickPlan(page, { x: 5.5, y: 4.5 });
    await actionBar(page).getByRole('button', { name: 'Drehen' }).click();
    await actionBar(page).getByRole('button', { name: 'Löschen' }).click();
    await expect(actionBar(page)).toHaveCount(0);
    await main(page).getByRole('button', { name: 'Rückgängig' }).click();

    const before: Awaited<ReturnType<typeof storedLayout>> = await storedLayout(page);
    expect(Object.keys(before.floor)).toHaveLength(48);
    expect(before.walls).toHaveLength(1);
    expect(before.pieces.map((p) => [p.catalogId, p.rotation])).toEqual([
      ['chest', 0],
      ['table', 90],
    ]);

    await page.reload();
    await expect(main(page).getByTestId('plan-surface')).toBeVisible();
    expect(await storedLayout(page)).toEqual(before);
  });

  test('shows every entry of the start catalog with a loaded graphic', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'warning') warnings.push(message.text());
    });
    await page.reload();

    // 2 Böden, 3 Türen, 18 Möbel/Treppen/Hindernisse; „Fels“ ist ein Farbfeld ohne Grafik.
    const images: Locator = main(page).locator('app-element-library img');
    await expect(images).toHaveCount(23);
    await expect
      .poll(() =>
        images.evaluateAll((all) =>
          all.every(
            (img) =>
              (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
      )
      .toBe(true);
    expect(warnings.filter((text) => text.startsWith('Katalog'))).toEqual([]);
  });

  test('saves the layout as XML, starts anew and loads the file again', async ({ page }) => {
    await main(page).getByRole('button', { name: 'Pinsel' }).click();
    await dragOnPlan(page, { x: 1.5, y: 1.5 }, { x: 6.5, y: 1.5 });
    const saved: Awaited<ReturnType<typeof storedLayout>> = await storedLayout(page);

    const downloadPromise: Promise<Download> = page.waitForEvent('download');
    await main(page).getByRole('button', { name: 'Als XML speichern' }).click();
    const download: Download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('neues-layout.xml');

    await main(page).getByRole('button', { name: 'Neu' }).click();
    await page.getByRole('button', { name: 'Verwerfen' }).click();
    await expect.poll(async () => (await storedLayout(page)).floor).toEqual({});

    await main(page)
      .getByTestId('load-layout')
      .setInputFiles(await download.path());
    await expect.poll(async () => (await storedLayout(page)).floor).toEqual(saved.floor);
  });

  test('exports a JPEG without border at 64 px per tile', async ({ page }) => {
    await main(page).getByRole('button', { name: 'Tür', exact: true }).click();
    await clickPlan(page, { x: 4.5, y: 3.05 });

    const downloadPromise: Promise<Download> = page.waitForEvent('download');
    await main(page).getByRole('button', { name: 'Als JPEG exportieren' }).click();
    const download: Download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('neues-layout.jpg');
    expect(await inspectImage(page, download)).toEqual([true, 1664, 1216]);
  });
});
