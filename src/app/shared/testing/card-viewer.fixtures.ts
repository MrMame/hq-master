import { OverlayContainer } from '@angular/cdk/overlay';
import { Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRef, DeckState } from '../../core/models/deck-state.model';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { CardViewer } from '../components/card-viewer/card-viewer';
import { CardViewerContext } from '../models/card-action.model';
import { CardViewerMenuStateService } from '../services/card-viewer-menu-state.service';
import { CardViewerService } from '../services/card-viewer.service';

/** Card Viewer mit echtem Deck-Zustand (nur für Specs). */
export interface CardViewerSetup {
  fixture: ComponentFixture<CardViewer>;
  cardManager: CardManagerService;
  viewer: CardViewerService;
  /** Overlay-Container, in dem der Viewer erscheint. */
  overlay: HTMLElement;
  /** Öffnet die Karte und rendert. */
  open: (ref: CardRef, context?: CardViewerContext) => Promise<void>;
  /** Wartet, bis Änderungen gerendert sind. */
  stable: () => Promise<void>;
  /** Text über der Karte (Deck und Ort), `undefined` bei geschlossenem Viewer. */
  location: () => string | undefined;
  /** Beschriftungen der Menüeinträge. */
  menuLabels: () => string[];
  menuItem: (label: string) => HTMLButtonElement;
}

/**
 * Rendert den Viewer wie im App-Template mit `providers` (z. B. `provideCardActions(...)`).
 * Das Aktionsmenü ist aufgeklappt, außer `menuExpanded` ist `false`; `'stored'` lässt den gespeicherten Zustand.
 */
export async function setupCardViewer(
  state: DeckState,
  providers: Provider[] = [],
  { menuExpanded = true }: { menuExpanded?: boolean | 'stored' } = {},
): Promise<CardViewerSetup> {
  TestBed.configureTestingModule({ providers });
  const cardManager: CardManagerService = TestBed.inject(CardManagerService);
  const viewer: CardViewerService = TestBed.inject(CardViewerService);
  const menu: CardViewerMenuStateService = TestBed.inject(CardViewerMenuStateService);
  if (menuExpanded !== 'stored' && menu.expanded() !== menuExpanded) menu.toggle();
  cardManager.restore(state);
  const fixture: ComponentFixture<CardViewer> = TestBed.createComponent(CardViewer);
  const overlay: HTMLElement = TestBed.inject(OverlayContainer).getContainerElement();
  const stable: () => Promise<void> = () => fixture.whenStable();
  await stable();
  const items: () => HTMLButtonElement[] = () =>
    Array.from(overlay.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));

  return {
    fixture,
    cardManager,
    viewer,
    overlay,
    open: async (ref: CardRef, context?: CardViewerContext): Promise<void> => {
      viewer.open(ref, context);
      await stable();
    },
    stable,
    location: () =>
      overlay.querySelector('[data-testid="card-viewer-location"]')?.textContent?.trim(),
    menuLabels: () => items().map((item) => item.textContent?.trim() ?? ''),
    menuItem: (label: string): HTMLButtonElement => {
      const item: HTMLButtonElement | undefined = items().find(
        (candidate) => candidate.textContent?.trim() === label,
      );
      if (!item) throw new Error(`Menüeintrag "${label}" nicht gefunden`);
      return item;
    },
  };
}
