## 2024-03-20 - Responsive Hidden Text Accessibility
**Learning:** Responsive utility classes like `hidden md:inline` on button text can create critical accessibility issues on mobile devices where the buttons become icon-only without proper ARIA labels. Additionally, these custom-styled buttons often lack explicit keyboard focus states by default.
**Action:** When using responsive classes to hide text on small screens, always add explicit `aria-label` attributes to ensure screen reader context is maintained across all device sizes. Always pair custom styling with `focus-visible:ring` utilities to preserve keyboard navigation.
## 2024-05-18 - Responsive Hidden Text Accessibility
**Learning:** Using responsive utility classes like `hidden sm:inline` to hide button text on small screens removes the text from the accessibility tree, leaving icon-only buttons with no accessible name for screen readers on mobile devices.
**Action:** Always provide an explicit `aria-label` matching the visual text on buttons where the text may be conditionally hidden using responsive CSS, ensuring the button remains accessible across all viewport sizes.
