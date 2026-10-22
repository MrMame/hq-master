import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader, TestElement } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DamageTakenDialog } from './damage-taken-dialog';
import { DamageTypes } from '../../../core/models/damage-types.model';
import { DamageDialogData } from '../../models/damage-dialog-data.model';

describe('DamageTakenDialog', () => {
  let loader: HarnessLoader;
  let fixture: ComponentFixture<DamageTakenDialog>;
  const close: ReturnType<typeof vi.fn> = vi.fn();

  const create: (data: DamageDialogData) => Promise<void> = async (
    data: DamageDialogData,
  ): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [DamageTakenDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DamageTakenDialog);
    loader = TestbedHarnessEnvironment.loader(fixture);
  };

  beforeEach(async () => {
    close.mockReset();
    await create({ characterName: 'Ork', damageType: DamageTypes.Normal });
  });

  const title: () => string | undefined = (): string | undefined =>
    (fixture.nativeElement as HTMLElement).querySelector('h2')?.textContent?.trim();

  it('uses the shared dark dialog look', () => {
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(host.classList).toContain('general-dialog');
    expect(host.querySelector('h2')?.classList).toContain('general-dialog__title');
  });

  it('names damage type and character in the title', () => {
    fixture.detectChanges();
    expect(title()).toBe('Schaden auf Rüstung: Ork');
  });

  it('names a critical hit as damage to health', async () => {
    TestBed.resetTestingModule();
    await create({ characterName: 'Brom', damageType: DamageTypes.Critical });
    fixture.detectChanges();
    expect(title()).toBe('Schaden auf Leben: Brom');
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
    const cancel: MatButtonHarness = await button('Abbrechen');
    expect(await (await cancel.host()).hasClass('general-dialog__cancel')).toBe(true);
    await cancel.click();
    expect(close).toHaveBeenCalledExactlyOnceWith();
  });
});
