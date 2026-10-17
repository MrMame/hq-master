import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDisplay } from './card-display';
import { BasicCard, CombatCard } from '../../models/card.model';

const BASIC: BasicCard = {
  id: 'b1',
  name: 'Fackel',
  imagePath: 'torch.svg',
  description: '',
  cardType: 'basic',
};

const COMBAT: CombatCard = {
  id: 'c1',
  name: 'Schwert',
  imagePath: 'sword.svg',
  description: '',
  cardType: 'combat',
  attack: 4,
  defense: 2,
};

describe('CardDisplay', () => {
  let fixture: ComponentFixture<CardDisplay>;
  let host: HTMLElement;

  const render: (card: BasicCard | CombatCard, side?: 'front' | 'back') => Promise<void> = async (
    card: BasicCard | CombatCard,
    side?: 'front' | 'back',
  ): Promise<void> => {
    fixture.componentRef.setInput('card', card);
    fixture.componentRef.setInput('backImagePath', 'back.svg');
    if (side) fixture.componentRef.setInput('side', side);
    await fixture.whenStable();
  };

  const image: () => HTMLImageElement = (): HTMLImageElement =>
    host.querySelector('.card-image') as HTMLImageElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CardDisplay] }).compileComponents();
    fixture = TestBed.createComponent(CardDisplay);
    host = fixture.nativeElement as HTMLElement;
  });

  it('shows the front with image and name by default', async () => {
    await render(BASIC);

    expect(host.querySelector('.card-front')).not.toBeNull();
    expect(image().getAttribute('src')).toBe('torch.svg');
    expect(image().alt).toBe('Fackel');
    expect(host.querySelector('.card-name')?.textContent).toBe('Fackel');
  });

  it('hides the stats for basic cards', async () => {
    await render(BASIC);

    expect(host.querySelector('.card-stats')).toBeNull();
  });

  it('shows attack and defense for combat cards', async () => {
    await render(COMBAT);

    expect(host.querySelector('.card-stats')?.textContent).toBe('ATK 4 / DEF 2');
  });

  it('shows only the back image when side is back', async () => {
    await render(COMBAT, 'back');

    expect(host.querySelector('.card-front')).toBeNull();
    expect(host.querySelector('.card-back')).not.toBeNull();
    expect(image().getAttribute('src')).toBe('back.svg');
    expect(host.querySelector('.card-name')).toBeNull();
  });

  it('emits the card id on click', async () => {
    await render(BASIC);
    const clicked: string[] = [];
    fixture.componentInstance.cardClick.subscribe((id: string) => clicked.push(id));

    (host.querySelector('.card-display') as HTMLElement).click();

    expect(clicked).toEqual(['b1']);
  });

  it('asCombat returns the card only for combat cards', () => {
    expect(fixture.componentInstance.asCombat(COMBAT)).toBe(COMBAT);
    expect(fixture.componentInstance.asCombat(BASIC)).toBeNull();
  });
});
