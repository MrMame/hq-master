import { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovableCharacterCard } from './movable-character-card';
import { CardLayout } from '../../models/card-layout.model';
import { CharacterInfo } from '../../models/character-info.model';

const orc: CharacterInfo = {
  id: 'orc-1',
  name: 'Orc',
  type: 'Erde',
  health: 42,
  armor: 7,
  attack: 1,
  defense: 1,
  speed: 1,
  abilities: [],
  image: '',
  description: '',
};

describe('MovableCharacterCard', () => {
  let component: MovableCharacterCard;
  let fixture: ComponentFixture<MovableCharacterCard>;
  let host: HTMLElement;

  async function render(layout: CardLayout, onTop: boolean = false): Promise<void> {
    fixture.componentRef.setInput('layout', layout);
    fixture.componentRef.setInput('onTop', onTop);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovableCharacterCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MovableCharacterCard);
    fixture.componentRef.setInput('character', orc);
    component = fixture.componentInstance;
    host = fixture.nativeElement;
  });

  function box(): HTMLElement {
    return host.querySelector('.draggable-box') as HTMLElement;
  }

  it('should position the card from its layout and mark it on top', async () => {
    await render({ x: 120, y: 30, isMinimised: true }, true);
    expect(box().style.left).toBe('120px');
    expect(box().style.top).toBe('30px');
    expect(box().classList).toContain('is-on-top');
    expect(host.querySelector('app-character-card-minimised')).not.toBeNull();
  });

  it('should show the full card with a delete button when not minimised', async () => {
    await render({ x: 0, y: 0, isMinimised: false });
    const removed: Mock<() => void> = vi.fn();
    component.removeRequested.subscribe(removed);
    expect(host.querySelector('app-character-card')).not.toBeNull();
    (host.querySelector('.content > button') as HTMLButtonElement).click();
    expect(removed).toHaveBeenCalled();
  });

  it('should request focus on click and toggle on double click of the handle', async () => {
    await render({ x: 0, y: 0, isMinimised: true });
    const focused: Mock<() => void> = vi.fn();
    const toggled: Mock<() => void> = vi.fn();
    component.focused.subscribe(focused);
    component.minimiseToggled.subscribe(toggled);
    box().click();
    host.querySelector('.handle')?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(focused).toHaveBeenCalledTimes(1);
    expect(toggled).toHaveBeenCalledTimes(1);
  });
});
