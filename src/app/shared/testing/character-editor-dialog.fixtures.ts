import { Signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Mock, vi } from 'vitest';

import { CharacterEditorDialog } from '../components/character-editor-dialog/character-editor-dialog';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { CharacterInfo } from '../../core/models/character-info.model';

type EditorField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export interface CharacterEditorDialogSetup {
  host: HTMLElement;
  close: Mock;
  /** Gemocktes `MatDialog.open` für die Rückfrage vor dem Entfernen. */
  dialogOpen: Mock;
  /** Legt fest, ob die Rückfrage bestätigt (`true`) oder abgebrochen (`false`) wird. */
  confirmWith: (confirmed: boolean) => void;
  /** Charaktere der Session (echter `CharactersDbService`). */
  characters: Signal<CharacterInfo[]>;
  /** Material-Button der Aktionsleiste mit genau dieser Beschriftung. */
  button: (text: string) => Promise<MatButtonHarness>;
  /** Gibt einen Wert ein wie ein Benutzer: Select per `change`, alle anderen Felder per `input`. */
  enter: (caption: string, value: string) => Promise<void>;
  /** Klickt ein natives Element (Checkbox, Bild) und rendert neu. */
  click: (element: HTMLElement) => Promise<void>;
}

/**
 * Rendert den Editor mit `data` (`null` = neuer Charakter), gemocktem `MatDialogRef` und gemockter
 * Rückfrage (Standard: bestätigt); `stored` liegt vorher schon in der Session (nur für Specs).
 */
export async function setupCharacterEditorDialog(
  data: CharacterInfo | null,
  stored: CharacterInfo[] = [],
): Promise<CharacterEditorDialogSetup> {
  const close: Mock = vi.fn();
  let confirmed: boolean = true;
  const dialogOpen: Mock = vi.fn(() => ({ afterClosed: () => of(confirmed) }));
  TestBed.configureTestingModule({
    imports: [CharacterEditorDialog],
    providers: [
      { provide: MatDialogRef, useValue: { close } },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
  });
  // Nicht über providers: MatDialogModule stellt MatDialog im Standalone-Injector des Editors bereit.
  TestBed.overrideProvider(MatDialog, { useValue: { open: dialogOpen } });
  await TestBed.compileComponents();
  const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
  stored.forEach((character) => charactersDb.writeCharacter(character));

  const fixture: ComponentFixture<CharacterEditorDialog> =
    TestBed.createComponent(CharacterEditorDialog);
  await fixture.whenStable();
  const host: HTMLElement = fixture.nativeElement as HTMLElement;
  const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);

  async function enter(caption: string, value: string): Promise<void> {
    const field: EditorField = editorField(host, caption);
    field.value = value;
    field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? 'change' : 'input'));
    await fixture.whenStable();
  }

  async function click(element: HTMLElement): Promise<void> {
    element.click();
    await fixture.whenStable();
  }

  return {
    host,
    close,
    dialogOpen,
    confirmWith: (value: boolean): void => {
      confirmed = value;
    },
    characters: charactersDb.characters,
    button: (text: string) => loader.getHarness(MatButtonHarness.with({ text })),
    enter,
    click,
  };
}

/** Eingabefeld unter der sichtbaren Beschriftung, z. B. „Name“ oder „Leben“. */
export function editorField(host: HTMLElement, caption: string): EditorField {
  const field: EditorField | null | undefined = Array.from(
    host.querySelectorAll('.character-editor__field'),
  )
    .find((f) => f.querySelector('.character-editor__caption')?.textContent?.trim() === caption)
    ?.querySelector<EditorField>('input, select, textarea');
  if (!field) throw new Error(`Feld "${caption}" nicht gefunden`);
  return field;
}

/** Checkbox der Fähigkeit mit dieser Beschriftung. */
export function abilityCheckbox(host: HTMLElement, ability: string): HTMLInputElement {
  const checkbox: HTMLInputElement | null | undefined = Array.from(
    host.querySelectorAll('.character-editor__ability'),
  )
    .find((label) => label.textContent?.trim() === ability)
    ?.querySelector('input');
  if (!checkbox) throw new Error(`Fähigkeit "${ability}" nicht gefunden`);
  return checkbox;
}

/** Bild-Button der Bildauswahl, gezählt ab 1 wie sein `aria-label`. */
export function imageButton(host: HTMLElement, position: number): HTMLButtonElement {
  const button: HTMLButtonElement | null = host.querySelector(
    `button[aria-label="Bild ${position}"]`,
  );
  if (!button) throw new Error(`Bild ${position} nicht gefunden`);
  return button;
}
