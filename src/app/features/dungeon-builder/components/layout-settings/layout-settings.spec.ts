import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';

import { ConfirmationService } from '../../../../shared/services/confirmation.service';
import {
  BuilderServices,
  builderProviders,
  injectBuilderServices,
} from '../../testing/builder-services.fixtures';
import { LayoutSettings } from './layout-settings';

describe('LayoutSettings', () => {
  let fixture: ComponentFixture<LayoutSettings>;
  let host: HTMLElement;
  let s: BuilderServices;
  let confirm: Mock<() => Promise<boolean>>;

  beforeEach(() => {
    confirm = vi.fn(() => Promise.resolve(true));
    TestBed.configureTestingModule({
      imports: [LayoutSettings],
      providers: [...builderProviders(), { provide: ConfirmationService, useValue: { confirm } }],
    });
    fixture = TestBed.createComponent(LayoutSettings);
    host = fixture.nativeElement as HTMLElement;
    s = injectBuilderServices();
    fixture.detectChanges();
  });

  function field(testId: string): HTMLInputElement {
    return host.querySelector(`[data-testid="${testId}"]`) as HTMLInputElement;
  }

  async function change(testId: string, value: string): Promise<void> {
    field(testId).value = value;
    field(testId).dispatchEvent(new Event('change'));
    await fixture.whenStable();
  }

  it('should show name and size of the layout', () => {
    expect(field('layout-name').value).toBe('Neues Layout');
    expect(field('layout-columns').value).toBe('26');
    expect(field('layout-rows').value).toBe('19');
  });

  it('should rename the layout while typing', () => {
    field('layout-name').value = 'Gruft';
    field('layout-name').dispatchEvent(new Event('input'));
    expect(s.layout.layout().name).toBe('Gruft');
  });

  it('should resize without asking when nothing gets lost', async () => {
    await change('layout-columns', '30');
    await change('layout-rows', '12');

    expect(s.layout.layout()).toMatchObject({ columns: 30, rows: 12 });
    expect(confirm).not.toHaveBeenCalled();
  });

  it.each<string>(['4', '41', '7.5', ''])(
    'should reject the size "%s" and show the old one',
    async (value) => {
      await change('layout-columns', value);
      expect(s.layout.layout().columns).toBe(26);
      expect(field('layout-columns').value).toBe('26');
    },
  );

  it('should ask before elements get lost and keep the size on cancel', async () => {
    s.layout.placeElement('chest', { x: 20.5, y: 2.5 });
    confirm.mockResolvedValueOnce(false);

    await change('layout-columns', '10');
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: '1 Element liegt außerhalb und wird entfernt.' }),
    );
    expect(s.layout.layout().columns).toBe(26);
    expect(field('layout-columns').value).toBe('26');

    s.layout.placeElement('chest', { x: 22.5, y: 2.5 });
    await change('layout-columns', '10');
    expect(confirm).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: '2 Elemente liegen außerhalb und werden entfernt.' }),
    );
    expect(s.layout.layout()).toMatchObject({ columns: 10, pieces: [] });
  });
});
