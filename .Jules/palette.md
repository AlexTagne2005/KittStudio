## 2023-10-26 - Responsive Icon-Only Button Labels
**Learning:** In Tailwind, components with text hidden on small screens (`hidden md:inline`) act as icon-only buttons on mobile devices. Screen readers cannot access visually hidden text if it is completely removed from the accessibility tree (e.g., using `display: none` via `hidden`), making the buttons completely unlabelled on small viewports.
**Action:** When using responsive utility classes to hide text on mobile, ensure an explicit `aria-label` is always provided on the button element to maintain accessibility across all device sizes.
