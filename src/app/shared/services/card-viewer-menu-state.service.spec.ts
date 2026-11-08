import { TestBed } from '@angular/core/testing';

import { describePersistedState } from '../../core/session-state/testing/describe-persisted-state';
import { TOOL_STATE_KEYS } from '../../core/session-state/tool-state-keys';
import { CardViewerMenuStateService } from './card-viewer-menu-state.service';

function createService(): CardViewerMenuStateService {
  TestBed.resetTestingModule();
  return TestBed.inject(CardViewerMenuStateService);
}

describe('CardViewerMenuStateService', () => {
  let service: CardViewerMenuStateService;

  beforeEach(() => {
    service = createService();
  });

  describePersistedState<CardViewerMenuStateService, boolean>('card viewer menu', {
    key: TOOL_STATE_KEYS.cardViewerMenuOpen,
    create: createService,
    read: (s) => s.expanded(),
    fallback: false,
    stored: { raw: true, expected: true },
    mutate: (s) => s.toggle(),
  });

  it('should fall back to collapsed when the stored value is no boolean', () => {
    localStorage.setItem(TOOL_STATE_KEYS.cardViewerMenuOpen, JSON.stringify('true'));
    expect(createService().expanded()).toBe(false);
  });

  it('should start collapsed and toggle expanded and collapsed again', () => {
    expect(service.expanded()).toBe(false);

    service.toggle();
    expect(service.expanded()).toBe(true);

    service.toggle();
    expect(service.expanded()).toBe(false);
  });
});
