import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { provideDefaultCardActions } from '../card-actions/default-card-actions';
import { CardViewer } from '../components/card-viewer/card-viewer';
import { CardViewerMenuStateService } from '../services/card-viewer-menu-state.service';

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
    hand: [],
    assigned: [assignedCard(RUNE_ARMOR, 'a', 'body'), assignedCard(TOWER_SHIELD, 'a', 'leftHand')],
  };
}

/**
 * Öffnet den Editor für den ausgerüsteten Barbaren; das Deck liegt vorher in der Session, die allgemeinen
 * Kartenaktionen sind registriert.
 */
export function setupEquippedEditor(
  deck: DeckState = equippedDeck(),
): Promise<CharacterEditorDialogSetup> {
  localStorage.setItem(SESSION_KEYS.deckState, JSON.stringify(deck));
  return setupCharacterEditorDialog(
    EQUIPPED_BARBARIAN,
    [EQUIPPED_BARBARIAN],
    [...provideDefaultCardActions()],
  );
}

/** Bonus-Anzeige `+2 = 6` unter einem Grundwert, `null` ohne Bonus. */
export function statBonus(host: HTMLElement, stat: string): HTMLElement | null {
  return host.querySelector(`[data-testid="stat-bonus-${stat}"]`);
}

/** Zeilen des Abschnitts „Ausrüstung“ als Text, z. B. „Körper Runenrüstung“. */
export function equipmentRows(host: HTMLElement): string[] {
  return Array.from(host.querySelectorAll('.equipment-editor__slot')).map((row) =>
    Array.from(
      row.querySelectorAll(
        '.equipment-editor__label, .equipment-editor__name, .equipment-editor__free',
      ),
    )
      .map((child) => child.textContent?.trim() ?? '')
      .filter((text) => text !== '')
      .join(' '),
  );
}

/** Knopf aus Bild und Name einer Karte im Abschnitt „Ausrüstung“. */
export function viewButton(host: HTMLElement, cardName: string): HTMLButtonElement {
  const button: HTMLButtonElement | null = host.querySelector(
    `button[aria-label="${cardName} ansehen"]`,
  );
  if (!button) throw new Error(`Karte "${cardName}" nicht gefunden`);
  return button;
}

/** Card Viewer wie im App-Template mit aufgeklapptem Aktionsmenü; liefert den Overlay-Container. */
export async function renderCardViewer(): Promise<HTMLElement> {
  const menu: CardViewerMenuStateService = TestBed.inject(CardViewerMenuStateService);
  if (!menu.expanded()) menu.toggle();
  const viewer: ComponentFixture<CardViewer> = TestBed.createComponent(CardViewer);
  await viewer.whenStable();
  return TestBed.inject(OverlayContainer).getContainerElement();
}

/** Menüeintrag des Card Viewers mit genau dieser Beschriftung, `undefined` wenn er fehlt. */
export function viewerAction(overlay: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(overlay.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')).find(
    (item) => item.textContent?.trim() === label,
  );
}

/**
 * Rendert den Viewer, öffnet die Karte aus dem Editor darin und legt sie im Entwurf ab; liefert den
 * Overlay-Container des Viewers.
 */
export async function discardInViewer(
  { host, click }: CharacterEditorDialogSetup,
  cardName: string,
): Promise<HTMLElement> {
  const overlay: HTMLElement = await renderCardViewer();
  await click(viewButton(host, cardName));
  await click(viewerAction(overlay, 'In den Ablagestapel legen')!);
  return overlay;
}
