---
name: remotion-remocn-video
description: Build production-grade programmatic videos with Remotion and remocn components. Use when creating video ads, product demos, YouTube pre-rolls, feature showcases, or any animated video content using Remotion. Covers project setup, scene composition, animation choreography, remocn component selection, and rendering. Triggers on "remotion", "remocn", "video ad", "product video", "YouTube ad", "animated video", "video rendering", or any task involving programmatic video creation.
---

# Remotion + remocn Video Production

Build cinematic, programmatic videos using Remotion v4 and remocn — a shadcn-style component registry of copy-pasteable video animation primitives.

## What is remocn?

**remocn** (https://remocn.dev) is a shadcn-style component registry for Remotion. Components are copied into your project (not installed as npm packages). Install via:

```bash
pnpm dlx shadcn@latest add @remocn/<component-name>
```

Components land in `components/registry/remocn/` (or `components/remocn/` depending on project setup). They use inline styles (no Tailwind), and all animations use Remotion's `useCurrentFrame()` + `spring()` + `interpolate()` — never CSS transitions or keyframes.

**Browse all available components, props, and usage examples at:** https://remocn.dev/docs

## Project Structure

```
project-root/
  package.json
  tsconfig.json
  remotion.config.ts          # Webpack overrides (Tailwind if needed)
  components.json             # shadcn config for remocn registry
  src/
    index.ts                  # registerRoot entry
    Root.tsx                  # Registers all Compositions
    style.css                 # Tailwind directives (optional)
    constants.ts              # Design tokens, spring presets, fps/dimensions
    scenes/                   # One file per scene
    components/
      remocn/                 # remocn components (auto-installed)
      custom/                 # Project-specific components
  MainComposition.tsx         # Master composition stitching scenes via Series
  out/                        # Rendered output
```

**`Root.tsx`** — Register the full video AND each individual scene as standalone compositions. This enables previewing/iterating on any scene independently in Remotion Studio.

**`constants.ts`** — Centralize all design tokens: colors, spring presets, fps, dimensions. Never hard-code these in scene files.

## Workflow

1. **Plan** — Define scenes, frame budgets, and which remocn components to use
2. **Install components** — `pnpm dlx shadcn@latest add @remocn/<name>` for each needed component
3. **Create constants** — Design tokens, spring presets, brand colors in `constants.ts`
4. **Build scenes individually** — One file per scene, preview in Studio
5. **Render stills** — `npx remotion still <Scene> --frame=N out/file.png` to verify key moments
6. **Stitch with Series/TransitionSeries** — Build the master composition
7. **Render full video** — `npx remotion render <Main> out/video.mp4`
8. **Iterate** — Review, adjust timing/choreography, re-render

## Rendering Commands

```bash
# Live preview with hot reload
npx remotion studio

# Render a still frame for verification
npx remotion still <CompositionId> --frame=N output.png

# Render full video
npx remotion render <CompositionId> out/video.mp4
```

## Common Gotchas

1. **`AbsoluteFill` in remocn components breaks flexbox layout** — If a remocn component uses `AbsoluteFill` internally and you embed it in a flexbox container, it will break out of the flow. Refactor to `display: inline-block` or a plain `div` wrapper.
2. **Standalone composition durations must match Series allocations** — If you change a scene's duration in Series, update the standalone `<Composition>` in Root.tsx too.
3. **No CSS transitions in Remotion** — All animation must use `useCurrentFrame()` + `spring()` + `interpolate()`. CSS `transition`, `animation`, and Tailwind `animate-*` classes are forbidden.
4. **Always clamp interpolations** — Use `extrapolateRight: "clamp"` on every `interpolate()` call. Unclamped values overshoot.
5. **Transition frame math** — `TransitionSeries` transitions absorb time from adjacent scenes. Budget: sum of scene durations minus (N_transitions * transition_duration).
6. **Font loading** — Use `@remotion/google-fonts` or a `fonts.ts` helper. Fonts must be loaded before render, not via CSS `@import`.
7. **`npx create-video@latest` has interactive prompts** — For automated setups, scaffold manually instead.

## Deep-Dive References

Load these sub-files when you need detailed guidance on a specific topic:

- **[scene-composition.md](./scene-composition.md)** — How to stitch scenes with `Series` and `TransitionSeries`, two scene authoring styles (rich manual vs thin delegation), frame math with transitions
- **[animation-choreography.md](./animation-choreography.md)** — Spring-based staggering, `Sequence` vs spring delays, signature animation combos (blur+fade+slide, breathing, Ken Burns), spring config guide by feel
- **[visual-design.md](./visual-design.md)** — Dark cinematic aesthetic, atmospheric layer ordering (7-layer stack), typography guidelines, using the full 1920x1080 canvas
- **[ad-narratives.md](./ad-narratives.md)** — YouTube pre-roll narrative structure (hook/problem/solution/features/proof/CTA), product showcase templates, frame budgeting

## remocn Component Reference

For the full component catalog with props, configuration options, and usage examples, refer to:

- **Component docs:** https://remocn.dev/docs
- **Registry source:** Components are browseable at https://remocn.dev

### Quick Component Map by Use Case

| Need | Components to consider |
|---|---|
| Hero text reveals | `blur-reveal`, `tracking-in`, `masked-slide-reveal` |
| Staggered text entrance | `staggered-fade-up` |
| Text accent effects | `shimmer-sweep`, `inline-highlight`, `marker-highlight` |
| Number/stat counters | `slot-machine-roll`, `animated-bar-chart` |
| Typing effects | `typewriter`, `matrix-decode` |
| Element entrances | `spring-pop-in`, `toast-notification` |
| Celebrations | `success-confetti` |
| User interaction demos | `simulated-cursor`, `bounding-box-selector` |
| Scene backgrounds | `mesh-gradient-bg`, `dynamic-grid` |
| Scene transitions | `frosted-glass-wipe`, `chromatic-aberration-wipe`, `spatial-push`, `grid-pixelate-wipe`, `kinetic-type-mask` |
| SaaS dashboards | `dashboard-populate` |
| Terminal/CLI demos | `terminal-simulator`, `terminal-to-browser-deploy` |
| Browser mockups | `browser-flow` |
| Code display | `glass-code-block`, `landing-code-showcase` |
| Feature grids | `staggered-bento-grid` |
| Device mockups | `hero-device-assemble` |
| AI product demos | `ai-generation-canvas` |
| Pricing scenes | `pricing-tier-focus` |
| Scrolling text | `infinite-marquee`, `perspective-marquee` |
