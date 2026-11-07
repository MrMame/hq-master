import { isSameRef } from '../../core/services/card-deck/deck-state.util';
import { CardAction } from '../models/card-action.model';
import { CardActionFactory } from './provide-card-actions';

/**
 * „In den Ablagestapel legen“ im Charakter-Editor: merkt eine Karte des bearbeiteten Charakters im Entwurf
 * vor; erst „Übernehmen“ legt sie ab.
 */
export const draftDiscardAction: CardActionFactory = (): CardAction => ({
  id: 'draft-discard',
  label: 'In den Ablagestapel legen',
  group: 'move',
  order: 20,
  modes: ['draft'],
  isAvailable: ({ ref, location, draft }) =>
    !!draft &&
    location.kind === 'equipped' &&
    location.characterId === draft.characterId &&
    !draft.discarded().some((discarded) => isSameRef(discarded, ref)),
  run: ({ ref, draft }) => draft?.discard(ref),
});
