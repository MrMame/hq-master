import { CardAction } from '../models/card-action.model';
import { CardActionFactory } from './provide-card-actions';

/**
 * „In den Ablagestapel legen“ im Charakter-Editor: merkt eine Slot-, Inventar- oder Gürtelkarte des bearbeiteten
 * Charakters im Entwurf vor; erst „Übernehmen“ legt sie ab. Der Ort im Kontext ist der Entwurfsstand.
 */
export const draftDiscardAction: CardActionFactory = (): CardAction => ({
  id: 'draft-discard',
  label: 'In den Ablagestapel legen',
  group: 'move',
  order: 20,
  modes: ['draft'],
  isAvailable: ({ location, draft }) =>
    !!draft &&
    (location.kind === 'equipped' || location.kind === 'inventory' || location.kind === 'belt') &&
    location.characterId === draft.characterId,
  run: ({ ref, draft }) => draft?.move(ref, { kind: 'discardPile' }),
});
