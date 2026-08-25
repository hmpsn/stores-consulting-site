# Accessibility Notes for the Later Design Pass

Structural accessibility checks exclude color contrast because this phase preserves the Claude mockup's visual values by design. Axe currently flags the mockup steel gray (`#8a8880`) against kraft backgrounds in the wordmark/footer at approximately 3.1–3.4:1, below the 4.5:1 target for small text.

The production structure still enforces semantic landmarks, a single H1, keyboard navigation, visible focus, reduced-motion support, form labels, image alt fields, and no critical or serious non-contrast Axe violations. Contrast must be resolved during the approved visual/design pass before final launch acceptance.
