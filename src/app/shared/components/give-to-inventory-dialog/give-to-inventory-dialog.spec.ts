import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mock, vi } from 'vitest';

import { GiveToInventoryDialog } from './give-to-inventory-dialog';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import { BASIC_CARD } from '../../../core/testing/deck.fixtures';

const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar' };
const dwarf: CharacterInfo = { ...createTestCharacter('b'), name: 'Zwerg' };

describe('GiveToInventoryDialog', () => {
  let fixture: ComponentFixture<GiveToInventoryDialog>;
  let host: HTMLElement;
  let close: Mock;

  async function create(characters: CharacterInfo[]): Promise<void> {
    close = vi.fn();
    await TestBed.configureTestingModule({
      imports: [GiveToInventoryDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { card: BASIC_CARD, characters } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GiveToInventoryDialog);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  const button: (text: string) => Promise<MatButtonHarness> = (text) =>
    TestbedHarnessEnvironment.loader(fixture).getHarness(MatButtonHarness.with({ text }));

  it('lists the characters with portrait and closes with the chosen one', async () => {
    await create([barbarian, dwarf]);
    expect(host.textContent).toContain('Fackel');
    expect(host.querySelectorAll('.give-inventory__portrait')).toHaveLength(2);
    expect(await (await button('Geben')).isDisabled()).toBe(true);

    const options: HTMLInputElement[] = Array.from(host.querySelectorAll('input[type="radio"]'));
    options[1].click();
    await fixture.whenStable();
    await (await button('Geben')).click();
    expect(close).toHaveBeenCalledWith('b');
  });

  it('preselects the only character and closes without value on cancel', async () => {
    await create([barbarian]);
    expect(await (await button('Geben')).isDisabled()).toBe(false);
    await (await button('Abbrechen')).click();
    expect(close).toHaveBeenCalledWith();
  });
});
