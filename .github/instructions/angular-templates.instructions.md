---
name: Angular Templates and Styling
description: 'Use when modifying Angular templates, inline templates, component CSS, global styles, Angular Material components, or accessibility behavior.'
applyTo:
  - 'src/**/*.html'
  - 'src/**/*.css'
  - 'src/**/*.ts'
---

# Angular Templates and Styling

- Style with plain CSS: semantic class names per component (BEM-like, e.g.
  `.dungeon-sidebar__title`) in the component's own `.css` file via `styleUrl`.
  Do not introduce utility frameworks, SCSS, or another styling system.
- Colors, spacing, font sizes, radii, and shadows come only from the design tokens in
  `src/styles/tokens.css` (`var(--…)`); no hard-coded color values in component CSS.
- Global base styles and the reset live in `src/styles.css`; the Angular Material theme in
  `src/styles/material-theme.css` (+ `material-theme-typography.css`) is generated – see its
  header comment before changing it.
- Adjust Angular Material components through their token variables (`--mat-…`) or
  sufficiently specific selectors. Use `!important` only when there is no other way, and
  explain it in a comment.
- Native CSS nesting and `:hover`/`:active`/`:disabled` are fine; breakpoints use
  `@media (min-width: 40rem)` (sm).
- Keep templates readable and components focused.
- Keep inline templates and styles for small components only; use separate files
  for larger content.
- Preserve the tablet-oriented layout and existing visual language.
- Use semantic HTML, labels, meaningful alternative text, and keyboard-friendly
  interactions for new UI.
- Do not disable accessibility checks merely to make a template pass lint.
- Keep styles scoped where possible and avoid unrelated global style changes.
