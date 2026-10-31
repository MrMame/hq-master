import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes, provideRouter } from '@angular/router';

import { MainNav } from '../components/main-nav/main-nav';
import { MAIN_NAV_ITEMS, MainNavItem } from '../components/main-nav/main-nav-items';

@Component({ template: '' })
class EmptyPage {}

/** Routen wie in `app.routes.ts`: jede Seite der Navigation plus Weiterleitungen auf den Dungeon Tracker. */
const TEST_ROUTES: Routes = [
  { path: '', redirectTo: 'dungeontracker', pathMatch: 'full' },
  ...MAIN_NAV_ITEMS.map((item: MainNavItem) => ({
    path: item.route.slice(1),
    component: EmptyPage,
  })),
  { path: '**', redirectTo: 'dungeontracker' },
];

export interface MainNavTestContext {
  fixture: ComponentFixture<MainNav>;
  host: HTMLElement;
  router: Router;
  /** Navigiert per Router und wartet, bis die Ansicht aktualisiert ist. */
  navigate(url: string): Promise<void>;
}

/** Rendert die Hauptnavigation mit Test-Routen und navigiert auf `url`. */
export async function renderMainNav(url: string): Promise<MainNavTestContext> {
  await TestBed.configureTestingModule({
    imports: [MainNav],
    providers: [provideRouter(TEST_ROUTES)],
  }).compileComponents();
  const fixture: ComponentFixture<MainNav> = TestBed.createComponent(MainNav);
  const router: Router = TestBed.inject(Router);
  const navigate: (target: string) => Promise<void> = async (target: string): Promise<void> => {
    await router.navigateByUrl(target);
    await fixture.whenStable();
  };
  await navigate(url);
  return { fixture, host: fixture.nativeElement as HTMLElement, router, navigate };
}
