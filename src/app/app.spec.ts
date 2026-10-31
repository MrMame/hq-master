import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture: ComponentFixture<App> = TestBed.createComponent(App);
    await fixture.whenStable();
    host = fixture.nativeElement as HTMLElement;
  });

  it('renders the main navigation inside the header', () => {
    expect(host.querySelector('header app-main-nav')).not.toBeNull();
    expect(host.querySelector('header')?.textContent).toContain('HQ-Master');
  });

  it('renders a navigation link for every feature', () => {
    const links: [string | null, string][] = Array.from(host.querySelectorAll('nav a')).map(
      (a: Element) => [a.getAttribute('href'), a.textContent?.trim() ?? ''],
    );

    expect(links).toEqual([
      ['/gamesession', 'Game Session'],
      ['/cardmanager', 'Card Manager'],
      ['/timetracker', 'Time Tracker'],
      ['/dungeontracker', 'Dungeon Tracker'],
      ['/dungeonbuilder', 'Dungeon Builder'],
    ]);
  });

  it('renders the router outlet inside main', () => {
    expect(host.querySelector('main router-outlet')).not.toBeNull();
  });
});
