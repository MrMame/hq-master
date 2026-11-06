import { CharacterInfo } from '../../core/models/character-info.model';
import { DeckState } from '../../core/models/deck-state.model';
import { SESSION_KEYS } from '../../core/session-state/session-keys';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import {
  assignedCard,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../core/testing/deck.fixtures';
import {
  CharacterEditorDialogSetup,
  setupCharacterEditorDialog,
} from './character-editor-dialog.fixtures';

/** Barbar mit Rüstung 6 (Grundmaximum 4), Abwehr 4, Tempo 5 (nur für Specs). */
export const EQUIPPED_BARBARIAN: CharacterInfo = {
  ...createTestCharacter('a'),
  name: 'Barbar',
  armor: 6,
  maxArmor: 4,
};

/** Deck mit Runenrüstung (Körper) und Turmschild (linke Hand) am Barbaren. */
export function equippedDeck(): DeckState {
  return {
    ...createEquipmentDeckState('a'),
    activeCard: null,
    assigned: [assignedCard(RUNE_ARMOR, 'a', 'body'), assignedCard(TOWER_SHIELD, 'a', 'leftHand')],
  };
}

/** Öffnet den Editor für den ausgerüsteten Barbaren; das Deck liegt vorher in der Session. */
export function setupEquippedEditor(
  deck: DeckState = equippedDeck(),
): Promise<CharacterEditorDialogSetup> {
  localStorage.setItem(SESSION_KEYS.deckState, JSON.stringify(deck));
  return setupCharacterEditorDialog(EQUIPPED_BARBARIAN, [EQUIPPED_BARBARIAN]);
}

/** Bonus-Anzeige `+2 = 6` unter einem Grundwert, `null` ohne Bonus. */
export function statBonus(host: HTMLElement, stat: string): HTMLElement | null {
  return host.querySelector(`[data-testid="stat-bonus-${stat}"]`);
}

/** Zeilen des Abschnitts „Ausrüstung“ als Text, z. B. „Körper Runenrüstung Ablegen“. */
export function equipmentRows(host: HTMLElement): string[] {
  return Array.from(host.querySelectorAll('.equipment-editor__slot')).map((row) =>
    Array.from(row.children)
      .map((child) => child.textContent?.trim() ?? '')
      .filter((text) => text !== '')
      .join(' '),
  );
}

/** „Ablegen“-Button einer Karte im Abschnitt „Ausrüstung“. */
export function discardButton(host: HTMLElement, cardName: string): HTMLButtonElement {
  const button: HTMLButtonElement | null = host.querySelector(
    `button[aria-label="${cardName} ablegen"]`,
  );
  if (!button) throw new Error(`Ablegen für "${cardName}" nicht gefunden`);
  return button;
}
