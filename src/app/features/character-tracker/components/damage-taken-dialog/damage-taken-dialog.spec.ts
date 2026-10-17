import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { DamageTakenDialog } from './damage-taken-dialog';

describe('DamageTakenDialog', () => {
  let loader: HarnessLoader;
  const close: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    close.mockReset();
    await TestBed.configureTestingModule({
      imports: [DamageTakenDialog],
      providers: [{ provide: MatDialogRef, useValue: { close } }],
    }).compileComponents();

    loader = TestbedHarnessEnvironment.loader(TestBed.createComponent(DamageTakenDialog));
  });

  const button: (text: string) => Promise<MatButtonHarness> = (
    text: string,
  ): Promise<MatButtonHarness> => loader.getHarness(MatButtonHarness.with({ text }));

  it('offers the damage values 1 to 100 plus Abbrechen', async () => {
    expect(await loader.getAllHarnesses(MatButtonHarness)).toHaveLength(101);
  });

  it.each<[number]>([[1], [7], [100]])(
    'closes with damage %i when it is clicked',
    async (value) => {
      await (await button(String(value))).click();
      expect(close).toHaveBeenCalledExactlyOnceWith(value);
    },
  );

  it.each<[number, string]>([
    [10, 'bg-green-100'],
    [11, 'bg-lime-100'],
    [50, 'bg-amber-100'],
    [75, 'bg-orange-200'],
    [76, 'bg-red-600'],
  ])('colours damage %i with %s', async (value, colourClass) => {
    const harness: MatButtonHarness = await button(String(value));
    expect(await (await harness.host()).hasClass(`!${colourClass}`)).toBe(true);
  });

  it('closes without a result on "Abbrechen"', async () => {
    await (await button('Abbrechen')).click();
    expect(close).toHaveBeenCalledExactlyOnceWith();
  });
});
