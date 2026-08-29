# Theme Adaptation

The canonical demo shell supplies behavior and structure. The target product supplies the presentation character.

## Evidence before styling

Inspect the repository's implemented design system, theme tokens, typography, app shell, components, icons, and real brand assets. Record only what is confidently supported. If evidence is incomplete, keep the template's neutral fallback; do not manufacture a logo, imitate a competitor, or infer a distinctive visual identity from a product name.

## Theme contract

Set `src/shared/demo-theme.cjs` with a product name, optional verified mark path, personality label, and compact token set for accent, contrast, canvas, surface, text, muted text, display font, body font, and radius. Prefer existing semantic design tokens over sampled one-off values. If fonts or assets cannot be bundled reliably, use system fallbacks.

Do not add domain-specific application UI to the shell. The runbook owns story content; the live product owns product interaction.

## Non-negotiable visual behavior

Opening and closing surfaces may be distinctly styled, but during product chapters the live product remains the visual focus. Reserve roughly 85–90% of usable area for it. Keep chapter context, browser controls, status, and the Presenter Notes entry point legible but quiet.

Themes may alter tone, spacing, typography, color, and restrained framing. They may not hide the editable browser address, Back, Forward, Reload, Loading/Live/Offline status, error/retry state, presentation navigation, or the separate Presenter Notes workflow.

## Fallback and review

Use the neutral default when a repository lacks a reliable design language. Before delivery, inspect opening, product, and closing states at the intended display size. Confirm that styling does not reduce contrast, obscure controls, or compete with the demonstrated product.
