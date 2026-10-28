import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { CharacterDamageService } from '../../../../shared/services/character-damage.service';
import { CollapsibleSidebar } from '../../../../shared/components/collapsible-sidebar/collapsible-sidebar';
import { SidebarSection } from '../../../../shared/components/sidebar-section/sidebar-section';
import { SidebarSectionToggleAll } from '../../../../shared/components/sidebar-section-toggle-all/sidebar-section-toggle-all';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { BoardToken } from '../../models/board-token.model';
import { CharacterSelection } from '../../models/character-selection.model';
import { BoardZoomControl } from '../../../../shared/components/board-zoom-control/board-zoom-control';
import { DungeonBoard } from '../dungeon-board/dungeon-board';
import { DungeonLegendEntry } from '../dungeon-legend-entry/dungeon-legend-entry';
import { GridSettings } from '../grid-settings/grid-settings';

@Component({
  selector: 'app-dungeon-tracker-page',
  standalone: true,
  imports: [
    BoardZoomControl,
    CollapsibleSidebar,
    DungeonBoard,
    DungeonLegendEntry,
    GridSettings,
    SidebarSection,
    SidebarSectionToggleAll,
  ],
  templateUrl: './dungeon-tracker-page.html',
  styleUrl: './dungeon-tracker-page.css',
})
export class DungeonTrackerPage {
  private readonly dungeonBoardService: DungeonBoardService = inject(DungeonBoardService);
  private readonly characterEditor: CharacterEditorService = inject(CharacterEditorService);
  private readonly characterDamage: CharacterDamageService = inject(CharacterDamageService);

  readonly boardState: Signal<DungeonBoardState> = this.dungeonBoardService.boardState;
  readonly tokens: Signal<BoardToken[]> = this.dungeonBoardService.tokens;

  /** Zoomstufe des Spielbretts: reiner Anzeigezustand, wird nicht gespeichert. */
  readonly zoom: WritableSignal<number> = signal<number>(1);

  /** Modus „Nullpunkt verschieben“: reiner UI-Zustand, wird nicht gespeichert, startet aus. */
  readonly originMode: WritableSignal<boolean> = signal<boolean>(false);

  /** Eine Markierung für Spielbrett und Legende: reiner UI-Zustand, wird nicht gespeichert. */
  private readonly selection: WritableSignal<CharacterSelection | null> =
    signal<CharacterSelection | null>(null);

  /** Die Markierung gilt nur, solange es den Charakter noch gibt. */
  readonly activeSelection: Signal<CharacterSelection | null> = computed(() => {
    const selection: CharacterSelection | null = this.selection();
    return this.tokens().some((t) => t.position.characterId === selection?.characterId)
      ? selection
      : null;
  });

  /** Klick aufs Token markiert (ohne Umschalten, wegen des Doppelklicks), freie Stelle hebt auf. */
  onBoardSelectionChange(characterId: string | null): void {
    this.selection.set(characterId ? { characterId, source: 'board' } : null);
  }

  /** In der Legende schaltet ein Klick die Markierung um. */
  onLegendSelectionToggled(characterId: string): void {
    const isSelected: boolean = this.activeSelection()?.characterId === characterId;
    this.selection.set(isSelected ? null : { characterId, source: 'legend' });
  }

  onImageUpload(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (!file) return;

    const reader: FileReader = new FileReader();
    reader.onload = (): void => {
      this.dungeonBoardService.setBoardImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  /** Der Service schreibt den Treffer; Token und Legende folgen über `tokens` sofort. */
  onDamageRequested(character: CharacterInfo, damageType: DamageTypes): void {
    this.characterDamage.requestDamage(character, damageType);
  }

  /** Den neuen Charakter setzt der Sync-Effekt des DungeonBoardService aufs erste freie Feld. */
  onNewCharacterClick(): void {
    this.characterEditor.openCreate();
  }
}
