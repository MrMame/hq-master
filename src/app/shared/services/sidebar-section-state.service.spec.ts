import { TestBed } from '@angular/core/testing';

import { describePersistedState } from '../../core/session-state/testing/describe-persisted-state';
import { TOOL_STATE_KEYS } from '../../core/session-state/tool-state-keys';
import { SidebarSectionStateService } from './sidebar-section-state.service';

function createService(): SidebarSectionStateService {
  TestBed.resetTestingModule();
  return TestBed.inject(SidebarSectionStateService);
}

describe('SidebarSectionStateService', () => {
  let service: SidebarSectionStateService;

  beforeEach(() => {
    service = createService();
  });

  describePersistedState<SidebarSectionStateService, string[]>('collapsed sections', {
    key: TOOL_STATE_KEYS.sidebarSections,
    create: createService,
    read: (s) => s.collapsedIds(),
    fallback: [],
    stored: { raw: ['dungeon-builder.layout'], expected: ['dungeon-builder.layout'] },
    mutate: (s) => s.toggle('dungeon-tracker.grid'),
  });

  it('should fall back to all open when the stored value is no list of ids', () => {
    localStorage.setItem(TOOL_STATE_KEYS.sidebarSections, JSON.stringify({ layout: true }));
    expect(createService().collapsedIds()).toEqual([]);
  });

  it('should treat unknown sections as open and toggle a section closed and open again', () => {
    expect(service.isCollapsed('dungeon-builder.library.Neu')).toBe(false);

    service.toggle('dungeon-builder.layout');
    expect(service.isCollapsed('dungeon-builder.layout')).toBe(true);

    service.toggle('dungeon-builder.layout');
    expect(service.isCollapsed('dungeon-builder.layout')).toBe(false);
  });

  it('should report all collapsed only when every shown section of the scope is collapsed', () => {
    expect(service.allCollapsed('dungeon-builder')).toBe(false);
    service.register('dungeon-builder.file');
    service.register('dungeon-builder.layout');
    service.register('dungeon-tracker.grid');

    service.toggle('dungeon-builder.file');
    expect(service.allCollapsed('dungeon-builder')).toBe(false);

    service.toggle('dungeon-builder.layout');
    expect(service.allCollapsed('dungeon-builder')).toBe(true);
    expect(service.allCollapsed('dungeon-tracker')).toBe(false);
  });

  it('should collapse and expand all sections of one scope without touching other scopes', () => {
    service.register('dungeon-builder.file');
    service.register('dungeon-builder.layout');
    service.register('dungeon-tracker.grid');
    service.toggle('dungeon-tracker.grid');

    service.setAll('dungeon-builder', true);
    expect(service.collapsedIds()).toEqual([
      'dungeon-tracker.grid',
      'dungeon-builder.file',
      'dungeon-builder.layout',
    ]);

    service.setAll('dungeon-builder', false);
    expect(service.collapsedIds()).toEqual(['dungeon-tracker.grid']);
  });

  it('should not match a scope that only shares the beginning of its name', () => {
    service.register('dungeon-builder-extra.file');
    service.setAll('dungeon-builder', true);
    expect(service.collapsedIds()).toEqual([]);
  });

  it('should keep a section registered while a second one with the same id is shown', () => {
    service.register('card-manager.deck-actions');
    service.register('card-manager.deck-actions');
    service.unregister('card-manager.deck-actions');
    service.unregister('card-manager.unknown');
    service.toggle('card-manager.deck-actions');

    expect(service.allCollapsed('card-manager')).toBe(true);
    service.unregister('card-manager.deck-actions');
    expect(service.allCollapsed('card-manager')).toBe(false);
  });
});
