import { MAIN_NAV_ITEMS, MainNavItem } from './main-nav-items';
import { MainNavTestContext, renderMainNav } from '../../testing/main-nav.fixtures';

describe('MainNav', () => {
  function linkBar(host: HTMLElement): HTMLAnchorElement[] {
    return Array.from(host.querySelectorAll<HTMLAnchorElement>('nav.app-nav a'));
  }

  function pageName(host: HTMLElement): string | undefined {
    return host.querySelector('.main-nav__page-name')?.textContent?.trim();
  }

  it('renders every item of MAIN_NAV_ITEMS in the link bar with its route', async () => {
    const { host }: MainNavTestContext = await renderMainNav('/timetracker');

    expect(
      linkBar(host).map((a: HTMLAnchorElement) => [a.getAttribute('href'), a.textContent?.trim()]),
    ).toEqual(MAIN_NAV_ITEMS.map((item: MainNavItem) => [item.route, item.label]));
  });

  it('marks only the link of the active page', async () => {
    const { host }: MainNavTestContext = await renderMainNav('/cardmanager');

    const active: HTMLAnchorElement[] = linkBar(host).filter((a: HTMLAnchorElement) =>
      a.classList.contains('app-nav__link--active'),
    );
    expect(active.map((a: HTMLAnchorElement) => a.textContent?.trim())).toEqual(['Card Manager']);
    expect(active[0].getAttribute('aria-current')).toBe('page');
  });

  it('renders the logo and a menu button labelled "Hauptmenü"', async () => {
    const { host }: MainNavTestContext = await renderMainNav('/timetracker');

    expect(host.querySelector('.main-nav__logo')?.textContent).toContain('HQ-Master');
    expect(host.querySelector('button[aria-label="Hauptmenü"]')).not.toBeNull();
  });

  it('shows the name of the current page behind the logo', async () => {
    const { host }: MainNavTestContext = await renderMainNav('/dungeonbuilder');

    expect(pageName(host)).toBe('· Dungeon Builder');
  });

  it('updates the page name when the route changes', async () => {
    const context: MainNavTestContext = await renderMainNav('/dungeonbuilder');

    await context.navigate('/gamesession');

    expect(pageName(context.host)).toBe('· Game Session');
  });

  it('shows the target page after a redirect from the empty path', async () => {
    const { host }: MainNavTestContext = await renderMainNav('');

    expect(pageName(host)).toBe('· Dungeon Tracker');
  });

  it('shows the target page after a redirect from an unknown path', async () => {
    const { host }: MainNavTestContext = await renderMainNav('/gibt-es-nicht');

    expect(pageName(host)).toBe('· Dungeon Tracker');
  });
});
