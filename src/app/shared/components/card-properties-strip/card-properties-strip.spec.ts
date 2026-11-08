import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardProperty } from '../../../core/models/card-property.model';
import { CardPropertiesStrip } from './card-properties-strip';

describe('CardPropertiesStrip', () => {
  let fixture: ComponentFixture<CardPropertiesStrip>;

  const render: (properties: CardProperty[]) => Promise<HTMLElement> = async (
    properties: CardProperty[],
  ): Promise<HTMLElement> => {
    fixture.componentRef.setInput('properties', properties);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };
  const chips: (host: HTMLElement) => HTMLElement[] = (host: HTMLElement): HTMLElement[] =>
    Array.from(host.querySelectorAll<HTMLElement>('[data-testid="card-viewer-property"]'));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPropertiesStrip);
  });

  it('shows one chip per property in order with name and signed value', async () => {
    const host: HTMLElement = await render([
      { name: 'Leben', value: 30 },
      { name: 'Abwehr', value: -1 },
      { name: 'Glück', value: 0 },
    ]);

    expect(chips(host).map((chip) => chip.textContent?.trim())).toEqual([
      'Leben +30',
      'Abwehr −1',
      'Glück +0',
    ]);
    expect(host.getAttribute('role')).toBe('list');
    expect(chips(host)[0].getAttribute('role')).toBe('listitem');
  });

  it('colours positive and negative values apart and leaves 0 neutral', async () => {
    const [positive, negative, neutral]: HTMLElement[] = chips(
      await render([
        { name: 'Leben', value: 30 },
        { name: 'Abwehr', value: -1 },
        { name: 'Glück', value: 0 },
      ]),
    );

    expect(positive.classList).toContain('card-properties-strip__chip--positive');
    expect(negative.classList).toContain('card-properties-strip__chip--negative');
    expect(neutral.classList).not.toContain('card-properties-strip__chip--positive');
    expect(neutral.classList).not.toContain('card-properties-strip__chip--negative');
  });

  it('renders no chips without properties', async () => {
    expect(chips(await render([]))).toEqual([]);
  });
});
