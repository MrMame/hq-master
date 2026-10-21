import { TestBed } from '@angular/core/testing';
import { HarnessLoader, TestElement } from '@angular/cdk/testing';
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
    [1, 'damage-btn--light'],
    [10, 'damage-btn--light'],
    [11, 'damage-btn--moderate'],
    [30, 'damage-btn--moderate'],
    [31, 'damage-btn--noticeable'],
    [50, 'damage-btn--noticeable'],
    [51, 'damage-btn--heavy'],
    [75, 'damage-btn--heavy'],
    [76, 'damage-btn--critical'],
    [100, 'damage-btn--critical'],
  ])('marks damage %i with the severity class %s', async (value, severityClass) => {
    const host: TestElement = await (await button(String(value))).host();
    expect(await host.hasClass(severityClass)).toBe(true);
    expect(await host.hasClass('damage-grid-btn')).toBe(true);
  });

  it('closes without a result on "Abbrechen"', async () => {
    await (await button('Abbrechen')).click();
    expect(close).toHaveBeenCalledExactlyOnceWith();
  });
});
