import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CardViewerService } from './card-viewer.service';
import { CardDraft } from '../models/card-action.model';

describe('CardViewerService', () => {
  let service: CardViewerService;

  beforeEach(() => {
    service = TestBed.inject(CardViewerService);
  });

  it('views nothing at the start', () => {
    expect(service.viewed()).toBeNull();
  });

  it('opens a card live by default and replaces it with the next one', () => {
    service.open({ deckId: 'd1', cardId: 'c1' });
    expect(service.viewed()).toEqual({
      ref: { deckId: 'd1', cardId: 'c1' },
      context: { mode: 'live' },
    });
    const draft: CardDraft = {
      characterId: 'a',
      moves: signal([]),
      equipped: signal([]),
      move: () => undefined,
    };
    service.open({ deckId: 'd1', cardId: 'c2' }, { mode: 'draft', draft });
    expect(service.viewed()?.ref.cardId).toBe('c2');
    expect(service.viewed()?.context).toEqual({ mode: 'draft', draft });
  });

  it('closes the viewer', () => {
    service.open({ deckId: 'd1', cardId: 'c1' });
    service.close();
    expect(service.viewed()).toBeNull();
  });
});
