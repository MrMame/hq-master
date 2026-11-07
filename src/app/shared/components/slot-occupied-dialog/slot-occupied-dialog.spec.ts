import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mock, vi } from 'vitest';

import { SlotOccupiedDialog } from './slot-occupied-dialog';

describe('SlotOccupiedDialog', () => {
  let fixture: ComponentFixture<SlotOccupiedDialog>;
  let close: Mock;

  beforeEach(async () => {
    close = vi.fn();
    await TestBed.configureTestingModule({
      imports: [SlotOccupiedDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { cardName: 'Turmschild', characterName: 'Barbar' } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SlotOccupiedDialog);
    await fixture.whenStable();
  });

  const click: (text: string) => Promise<void> = async (text) =>
    (
      await TestbedHarnessEnvironment.loader(fixture).getHarness(MatButtonHarness.with({ text }))
    ).click();

  it('names the previous card and its owner', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Wohin kommt „Turmschild“ von Barbar?',
    );
  });

  it.each<[string, unknown[]]>([
    ['Ins Inventar', ['inventory']],
    ['In den Ablagestapel', ['discardPile']],
    ['Abbrechen', [undefined]],
  ])('„%s“ closes with the choice', async (text, args) => {
    await click(text);
    expect(close).toHaveBeenCalledWith(...args);
  });
});
