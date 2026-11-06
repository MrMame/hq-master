import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mock } from 'vitest';

import { AssignEquipmentDialog } from './assign-equipment-dialog';
import { AssignEquipmentDialogData } from '../../models/assign-equipment.model';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { AssignedCard } from '../../../../core/models/deck-state.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { assignedCard, RUNE_ARMOR, TOWER_SHIELD } from '../../../../core/testing/deck.fixtures';

const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar' };
const dwarf: CharacterInfo = { ...createTestCharacter('b'), name: 'Zwerg' };

describe('AssignEquipmentDialog', () => {
  let fixture: ComponentFixture<AssignEquipmentDialog>;
  let host: HTMLElement;
  let close: Mock;

  async function create(data: AssignEquipmentDialogData): Promise<void> {
    close = vi.fn();
    await TestBed.configureTestingModule({
      imports: [AssignEquipmentDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AssignEquipmentDialog);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  const radio: (name: string) => HTMLInputElement = (name) => {
    const label: Element | undefined = Array.from(
      host.querySelectorAll('.assign-equipment__option'),
    ).find((option) => option.textContent?.trim() === name);
    if (!label) throw new Error(`Option "${name}" nicht gefunden`);
    return label.querySelector('input') as HTMLInputElement;
  };
  const choose: (name: string) => Promise<void> = async (name) => {
    radio(name).click();
    await fixture.whenStable();
  };
  const button: (text: string) => Promise<MatButtonHarness> = (text) =>
    TestbedHarnessEnvironment.loader(fixture).getHarness(MatButtonHarness.with({ text }));

  it('lists the characters with portrait and closes with the chosen one', async () => {
    await create({ card: RUNE_ARMOR, characters: [barbarian, dwarf], assigned: [] });

    expect(host.textContent).toContain('Runenrüstung · Körper');
    expect(host.querySelectorAll('.assign-equipment__portrait')).toHaveLength(2);
    expect(await (await button('Zuweisen')).isDisabled()).toBe(true);
    expect(host.textContent).not.toContain('Hand');

    await choose('Zwerg');
    await (await button('Zuweisen')).click();
    expect(close).toHaveBeenCalledWith({ characterId: 'b', slot: 'body' });
  });

  it('preselects a single character', async () => {
    await create({ card: RUNE_ARMOR, characters: [barbarian], assigned: [] });
    expect(radio('Barbar').checked).toBe(true);
    expect(await (await button('Zuweisen')).isDisabled()).toBe(false);
  });

  it('preselects the free hand and lets the DM choose the other one', async () => {
    const assigned: AssignedCard[] = [assignedCard(TOWER_SHIELD, 'a', 'leftHand')];
    await create({ card: { ...TOWER_SHIELD, id: 'e9' }, characters: [barbarian, dwarf], assigned });

    await choose('Barbar');
    expect(radio('Rechte Hand').checked).toBe(true);
    expect(host.querySelector('[data-testid="slot-occupied"]')).toBeNull();

    await choose('Linke Hand');
    expect(host.querySelector('[data-testid="slot-occupied"]')?.textContent?.trim()).toBe(
      'Linke Hand ist belegt: Turmschild',
    );
    await (await button('Zuweisen')).click();
    expect(close).toHaveBeenCalledWith({ characterId: 'a', slot: 'leftHand' });
  });

  it('resets the hand to the preselection when another character is chosen', async () => {
    await create({ card: TOWER_SHIELD, characters: [barbarian, dwarf], assigned: [] });
    await choose('Barbar');
    await choose('Rechte Hand');
    await choose('Zwerg');
    expect(radio('Linke Hand').checked).toBe(true);
  });

  it('closes without a value on cancel', async () => {
    await create({ card: RUNE_ARMOR, characters: [barbarian], assigned: [] });
    await (await button('Abbrechen')).click();
    expect(close).toHaveBeenCalledWith();
  });
});
