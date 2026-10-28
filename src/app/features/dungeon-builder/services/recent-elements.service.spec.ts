import { TestBed } from '@angular/core/testing';

import { describePersistedState } from '../../../core/session-state/testing/describe-persisted-state';
import { TOOL_STATE_KEYS } from '../../../core/session-state/tool-state-keys';
import { MAX_RECENT_ELEMENTS, RecentElementsService } from './recent-elements.service';

function createService(): RecentElementsService {
  TestBed.resetTestingModule();
  return TestBed.inject(RecentElementsService);
}

describe('RecentElementsService', () => {
  let service: RecentElementsService;

  beforeEach(() => {
    service = createService();
  });

  describePersistedState<RecentElementsService, string[]>('recent elements', {
    key: TOOL_STATE_KEYS.dungeonBuilderRecent,
    create: createService,
    read: (s) => s.recentIds(),
    fallback: [],
    stored: { raw: ['table', 'door'], expected: ['table', 'door'] },
    mutate: (s) => s.record('chest'),
  });

  it('should fall back to an empty list when the stored value is no list of ids', () => {
    localStorage.setItem(TOOL_STATE_KEYS.dungeonBuilderRecent, JSON.stringify([1, 2]));
    expect(createService().recentIds()).toEqual([]);
  });

  it('should put the newest element first and move a known one to the front', () => {
    service.record('table');
    service.record('door');
    service.record('table');

    expect(service.recentIds()).toEqual(['table', 'door']);
  });

  it('should keep at most the newest elements', () => {
    for (let i: number = 0; i < MAX_RECENT_ELEMENTS + 2; i++) service.record(`piece-${i}`);

    expect(service.recentIds()).toHaveLength(MAX_RECENT_ELEMENTS);
    expect(service.recentIds()[0]).toBe(`piece-${MAX_RECENT_ELEMENTS + 1}`);
    expect(service.recentIds()).not.toContain('piece-1');
  });
});
