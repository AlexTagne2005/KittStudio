## 2024-10-24 - Accessibility Enhancements in BrandKitModal
**Learning:** Found multiple form inputs without linked labels and color pickers lacking ARIA labels. Proper `htmlFor`/`id` linking and keyboard focus states are critical for modal accessibility.
**Action:** Always link labels to inputs with `htmlFor` and `id`, and add `aria-label` to icon-only buttons and color pickers. Use `focus-visible:ring-2 focus-visible:ring-amber-400` to ensure focus is easily visible for keyboard users.
