import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { AddCharacterDialog } from './add-character-dialog';

describe('AddCharacterDialog', () => {
  let loader: HarnessLoader;
  const close: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    close.mockReset();
    await TestBed.configureTestingModule({
      imports: [AddCharacterDialog],
      providers: [{ provide: MatDialogRef, useValue: { close } }],
    }).compileComponents();

    loader = TestbedHarnessEnvironment.loader(TestBed.createComponent(AddCharacterDialog));
  });

  const clickButton: (text: string) => Promise<void> = async (text: string): Promise<void> =>
    (await loader.getHarness(MatButtonHarness.with({ text }))).click();

  it('offers four difficulties plus Ok and Abbrechen', async () => {
    const texts: string[] = await Promise.all(
      (await loader.getAllHarnesses(MatButtonHarness)).map((b) => b.getText()),
    );
    expect(texts).toEqual(['Leicht', 'Mittel', 'Schwer', 'Extrem', 'Ok', 'Abbrechen']);
  });

  it.each<[string]>([['Ok'], ['Leicht'], ['Mittel'], ['Schwer'], ['Extrem']])(
    'closes with a new character on "%s"',
    async (text) => {
      await clickButton(text);
      expect(close).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ id: expect.any(String) }),
      );
    },
  );

  it('closes without a result on "Abbrechen"', async () => {
    await clickButton('Abbrechen');
    expect(close).toHaveBeenCalledExactlyOnceWith();
  });
});
