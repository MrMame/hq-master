import { findNavItem } from './active-nav-item.util';
import { MAIN_NAV_ITEMS } from './main-nav-items';

describe('findNavItem', () => {
  it('finds the item whose route equals the path', () => {
    expect(findNavItem(MAIN_NAV_ITEMS, '/timetracker')?.label).toBe('Time Tracker');
  });

  it('ignores query and fragment', () => {
    expect(findNavItem(MAIN_NAV_ITEMS, '/cardmanager?deck=a#top')?.label).toBe('Card Manager');
  });

  it('matches nested paths below a route', () => {
    expect(findNavItem(MAIN_NAV_ITEMS, '/gamesession/details')?.label).toBe('Game Session');
  });

  it('does not match a route that is only a prefix of another segment', () => {
    expect(findNavItem(MAIN_NAV_ITEMS, '/dungeontrackerx')).toBeUndefined();
  });

  it('returns undefined for unknown paths', () => {
    expect(findNavItem(MAIN_NAV_ITEMS, '/')).toBeUndefined();
  });
});
