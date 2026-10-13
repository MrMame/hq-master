---
name: Angular Templates and Styling
description: "Use when modifying Angular templates, inline templates, SCSS, Tailwind classes, Angular Material components, or accessibility behavior."
applyTo:
  - "src/**/*.html"
  - "src/**/*.scss"
  - "src/**/*.ts"
  - "src/tailwind.css"
---

# Angular Templates and Styling

- Prefer the existing Tailwind CSS 4 utility patterns and Angular Material
  components; do not introduce another styling system.
- Keep templates readable and components focused.
- Keep inline templates and styles for small components only; use separate files
  for larger content.
- Preserve the tablet-oriented layout and existing visual language.
- Use semantic HTML, labels, meaningful alternative text, and keyboard-friendly
  interactions for new UI.
- Do not disable accessibility checks merely to make a template pass lint.
- Keep styles scoped where possible and avoid unrelated global style changes.
