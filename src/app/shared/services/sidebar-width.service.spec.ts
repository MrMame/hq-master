import { TestBed } from '@angular/core/testing';

import { describePersistedState } from '../../core/session-state/testing/describe-persisted-state';
import { TOOL_STATE_KEYS } from '../../core/session-state/tool-state-keys';
import { SidebarWidthService } from './sidebar-width.service';

function createService(): SidebarWidthService {
  TestBed.resetTestingModule();
  return TestBed.inject(SidebarWidthService);
}

describe('SidebarWidthService', () => {
  let service: SidebarWidthService;

  beforeEach(() => {
    service = createService();
  });

  describePersistedState<SidebarWidthService, Record<string, number>>('sidebar widths', {
    key: TOOL_STATE_KEYS.sidebarWidths,
    create: createService,
    read: (s) => s.widths(),
    fallback: {},
    stored: { raw: { 'dungeon-tracker': 320 }, expected: { 'dungeon-tracker': 320 } },
    mutate: (s) => s.setWidth('card-manager', 300),
  });

  it('should have no width for sidebars that were never resized', () => {
    expect(service.widthOf('time-tracker')).toBeNull();
  });

  it('should keep the widths of different features independent', () => {
    service.setWidth('dungeon-tracker', 320);
    service.setWidth('card-manager', 410);
    service.setWidth('dungeon-tracker', 280);

    expect(service.widthOf('dungeon-tracker')).toBe(280);
    expect(service.widthOf('card-manager')).toBe(410);
  });

  it('should raise a stored width below the minimum to 200px', () => {
    localStorage.setItem(TOOL_STATE_KEYS.sidebarWidths, JSON.stringify({ 'dungeon-builder': 90 }));

    expect(createService().widthOf('dungeon-builder')).toBe(200);
  });

  it('should drop invalid stored entries and keep the valid ones', () => {
    localStorage.setItem(
      TOOL_STATE_KEYS.sidebarWidths,
      JSON.stringify({ 'dungeon-builder': 'breit', 'card-manager': 300 }),
    );

    const restored: SidebarWidthService = createService();
    expect(restored.widthOf('dungeon-builder')).toBeNull();
    expect(restored.widthOf('card-manager')).toBe(300);
  });
});
