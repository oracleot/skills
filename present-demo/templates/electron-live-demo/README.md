# Present Demo Electron Shell

This is the canonical starting point for generated `present-demo` applications. Copy this directory into the selected demo output directory, then replace only the files marked `ADAPT` below:

1. `src/shared/demo-theme.cjs` — derive tokens from confidently identified product design evidence.
2. `src/shared/runbook.cjs` — author the verified, story-led runbook.
3. `src/main.cjs` — set the user-confirmed `initialUrl`, and make only product-specific navigation/permission changes that have been reviewed.

Do not remove the audience test hooks, the named session, context isolation, or the narrow preload bridge. Use `npm run dev` to launch with a debugging port and `npm run smoke` in another terminal to run the bundled smoke test.

The shell deliberately makes the live product the dominant surface. Themes may change presentation tone and framing; they must not replace the product chapter with slide content. Never ship the placeholder without replacing it with the exact environment URL confirmed by the user.
