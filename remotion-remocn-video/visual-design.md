# Visual Design Principles

## Dark Cinematic Aesthetic

The default aesthetic for video ads and product showcases:

- **Background:** Deep obsidian (`#09090f` to `#070810`). Never flat black — use `mesh-gradient-bg` with brand colors.
- **Accents:** Brand colors as radial glows, border highlights, and gradient text.
- **Texture:** Grain overlays, grid lines, and floating particles add depth and life.
- **Contrast:** White text on dark with careful use of muted text (`rgba(255,255,255,0.4-0.5)`) for hierarchy.

## Atmospheric Layer Stack (Back to Front)

Layer elements in this order for visual depth. Not every scene needs all 7 layers, but this is the full stack:

1. **Mesh gradient background** — `mesh-gradient-bg` with brand colors and low speed (0.6-0.8). Organic drift replaces dead flat backgrounds.

2. **Grid lines** — Subtle structural depth:
   ```tsx
   backgroundImage: `
     linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
     linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
   `,
   backgroundSize: "80px 80px",
   opacity: 0.5,
   ```

3. **Floating particles** — 8-12 small circles drifting with `Math.sin()`:
   ```tsx
   const x = baseX + Math.sin(frame * 0.015 + i * 1.2) * 8;
   const y = baseY + Math.sin(frame * 0.02 + i * 0.8) * 12;
   ```
   Colors: alternate between brand accent colors. Opacity: 0.1-0.25. Size: 2-4px.

4. **Radial glows** — Atmospheric color washes behind content:
   ```tsx
   background: `
     radial-gradient(ellipse 60% 50% at 50% 50%, rgba(accent, 0.08) 0%, transparent 70%),
     radial-gradient(ellipse 40% 35% at 65% 60%, rgba(accent2, 0.05) 0%, transparent 60%)
   `,
   ```

5. **Vignette** — Darkened edges focus attention on center:
   ```tsx
   background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
   ```

6. **Content** — Text, UI elements, demos, cards.

7. **Grain texture** — Fine noise overlay at low opacity:
   ```tsx
   backgroundImage: `
     radial-gradient(circle at 25% 75%, rgba(255,255,255,0.01) 1px, transparent 1px),
     radial-gradient(circle at 75% 25%, rgba(255,255,255,0.008) 1px, transparent 1px)
   `,
   backgroundSize: "4px 4px, 6px 6px",
   opacity: 0.6,
   pointerEvents: "none",
   ```

## Typography

### Font Selection
- **Display headings:** Distinctive fonts like Syne, Cabinet Grotesk, SF Pro Display (700-800 weight)
- **Body text:** Clean sans-serif like Plus Jakarta Sans, General Sans (400-600)
- **Code/terminal:** Monospace like JetBrains Mono, Geist Mono (400)

### Sizing for 1920x1080 Video
- Hero titles: **80-108px** — large enough to read instantly
- Subtitles: **22-28px** — clear secondary hierarchy
- Body/captions: **18-22px** — still readable on smaller screens
- Stats/numbers: **64-96px** — bold impact

### Text Effects
- Negative letter-spacing for headings: `-0.02em`
- Gradient text for key phrases:
  ```tsx
  background: "linear-gradient(135deg, #accent1, #accent2)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  ```

## Using the Full 1920x1080 Canvas

**Be generous with sizing.** Common mistake: making UI elements too small relative to the canvas.

| Element | Minimum Width | Recommended |
|---|---|---|
| Terminal/browser windows | 1000px | 1050-1100px |
| Dashboard cards | 1200px | 1400-1560px |
| Feature card grids | 1100px total | 3 × 360px with 32px gaps |
| Code blocks | 800px | 900-1000px |
| Text containers | — | Max 900px for readability |

Leave 100-180px margins on each side. Fill the remaining space.

## Glow Effects

### Border Glow (Cards/Buttons)
```tsx
boxShadow: `
  0 0 0 1px rgba(accent, 0.25),
  0 0 20px rgba(accent, 0.15),
  0 0 60px rgba(accent, 0.08)
`,
```

### Behind-Element Glow
Place a blurred div behind the element:
```tsx
<div style={{
  position: "absolute",
  width: "120%",
  height: "120%",
  background: `radial-gradient(ellipse, rgba(accent, 0.2), transparent 70%)`,
  filter: "blur(40px)",
  zIndex: -1,
}} />
```

### Accent Top-Line on Cards
```tsx
<div style={{
  position: "absolute",
  top: 0,
  left: "10%",
  right: "10%",
  height: 2,
  background: "linear-gradient(90deg, transparent, rgba(accent, 0.6), transparent)",
  borderRadius: 1,
}} />
```
