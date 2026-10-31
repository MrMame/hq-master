import { HarnessLoader, TestElement } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness, MatMenuItemHarness } from '@angular/material/menu/testing';

import { MAIN_NAV_ITEMS, MainNavItem } from './main-nav-items';
import { MainNavTestContext, renderMainNav } from '../../testing/main-nav.fixtures';

describe('MainNav – menu', () => {
  let context: MainNavTestContext;
  let menu: MatMenuHarness;

  async function openMenu(url: string): Promise<MatMenuItemHarness[]> {
    context = await renderMainNav(url);
    const loader: HarnessLoader = TestbedHarnessEnvironment.loader(context.fixture);
    menu = await loader.getHarness(MatMenuHarness);
    await menu.open();
    return menu.getItems();
  }

  async function activeItemTexts(items: MatMenuItemHarness[]): Promise<string[]> {
    const texts: string[] = [];
    for (const item of items) {
      const host: TestElement = await item.host();
      if ((await host.getAttribute('aria-current')) === 'page') {
        texts.push(await item.getText());
      }
    }
    return texts;
  }

  it('is closed initially', async () => {
    context = await renderMainNav('/timetracker');
    const loader: HarnessLoader = TestbedHarnessEnvironment.loader(context.fixture);

    expect(await (await loader.getHarness(MatMenuHarness)).isOpen()).toBe(false);
  });

  it('opens with every item of MAIN_NAV_ITEMS in order', async () => {
    const items: MatMenuItemHarness[] = await openMenu('/timetracker');

    expect(await menu.isOpen()).toBe(true);
    expect(await Promise.all(items.map((item: MatMenuItemHarness) => item.getText()))).toEqual(
      MAIN_NAV_ITEMS.map((item: MainNavItem) => item.label),
    );
  });

  it('marks only the active page with aria-current="page"', async () => {
    const items: MatMenuItemHarness[] = await openMenu('/dungeontracker');

    expect(await activeItemTexts(items)).toEqual(['Dungeon Tracker']);
  });

  it('marks the active item visually', async () => {
    const items: MatMenuItemHarness[] = await openMenu('/timetracker');
    const host: TestElement = await items[2].host();

    expect(await host.hasClass('main-nav__menu-item--active')).toBe(true);
    expect(await (await items[0].host()).hasClass('main-nav__menu-item--active')).toBe(false);
  });

  it('navigates to the chosen page and closes the menu', async () => {
    const items: MatMenuItemHarness[] = await openMenu('/dungeontracker');

    await items[1].click();
    await context.fixture.whenStable();

    expect(context.router.url).toBe('/cardmanager');
    expect(await menu.isOpen()).toBe(false);
    expect(context.host.querySelector('.main-nav__page-name')?.textContent).toContain(
      'Card Manager',
    );
  });
});
