## 2023-10-27 - Icon-Only Button Accessibility
**Learning:** Modal close buttons in this app (`✕`) often lack accessible names, making them invisible or confusing to screen reader users. Additionally, they lack clear focus indicators for keyboard navigation.
**Action:** When adding or modifying icon-only buttons, always include an `aria-label` (localized if possible), wrap decorative icons in an `aria-hidden="true"` span, and add `focus-visible:ring-2 focus-visible:outline-none` classes to ensure they are fully accessible to keyboard and screen reader users.
