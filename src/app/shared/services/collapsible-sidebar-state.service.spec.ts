import { TestBed } from '@angular/core/testing';

import { describePersistedState } from '../../core/session-state/testing/describe-persisted-state';
import { TOOL_STATE_KEYS } from '../../core/session-state/tool-state-keys';
import { CollapsibleSidebarStateService } from './collapsible-sidebar-state.service';

function createService(): CollapsibleSidebarStateService {
  TestBed.resetTestingModule();
  return TestBed.inject(CollapsibleSidebarStateService);
}

describe('CollapsibleSidebarStateService', () => {
  let service: CollapsibleSidebarStateService;

  beforeEach(() => {
    service = createService();
  });

  describePersistedState<CollapsibleSidebarStateService, string[]>('collapsed sidebars', {
    key: TOOL_STATE_KEYS.collapsedSidebars,
    create: createService,
    read: (s) => s.collapsedIds(),
    fallback: [],
    stored: { raw: ['dungeon-tracker'], expected: ['dungeon-tracker'] },
    mutate: (s) => s.toggle('card-manager'),
  });

  it('should fall back to all expanded when the stored value is no list of ids', () => {
    localStorage.setItem(TOOL_STATE_KEYS.collapsedSidebars, JSON.stringify({ tracker: true }));
    expect(createService().collapsedIds()).toEqual([]);
  });

  it('should treat unknown sidebars as expanded and toggle one collapsed and expanded again', () => {
    expect(service.isCollapsed('dungeon-builder')).toBe(false);

    service.toggle('dungeon-builder');
    expect(service.isCollapsed('dungeon-builder')).toBe(true);

    service.toggle('dungeon-builder');
    expect(service.isCollapsed('dungeon-builder')).toBe(false);
  });

  it('should keep the sidebars of different features independent', () => {
    service.toggle('dungeon-tracker');

    expect(service.isCollapsed('dungeon-tracker')).toBe(true);
    expect(service.isCollapsed('card-manager')).toBe(false);
  });
});
