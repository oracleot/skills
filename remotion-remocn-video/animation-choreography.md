# Animation Choreography

## Spring-Based Staggering (Primary Mechanism)

Stagger element entrances with `frame - N` offsets on individual springs. This is the core choreography technique:

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Each element starts its spring from 0 when frame < delay
const logo = spring({ fps, frame: frame - 5, config: SPRING_ENTRANCE });
const title = spring({ fps, frame: frame - 20, config: SPRING_CINEMATIC });
const subtitle = spring({ fps, frame: frame - 40, config: SPRING_SMOOTH });
```

This avoids nested `<Sequence>` components for simple staggers. When `frame < delay`, the spring stays at 0 — the element is hidden but not unmounted.

## `<Sequence from={N}>` vs Spring Delays

These serve different purposes:

| Mechanism | Behavior | Use when |
|---|---|---|
| `spring({ frame: frame - N })` | Element exists but holds at progress=0 until frame N | Soft-timed reveals where holding at 0 is fine |
| `<Sequence from={N}>` | Element is fully unmounted before frame N | Component shouldn't exist before its start (confetti burst, one-shot effects) |

## Signature Animation Combos

### Blur + Fade + Slide (Premium Reveal)

The signature cinematic entrance. Apply all three properties from a single spring:

```tsx
const progress = spring({ fps, frame: frame - delay, config: { damping: 18, stiffness: 70 } });
const opacity = interpolate(progress, [0, 1], [0, 1]);
const blur = interpolate(progress, [0, 1], [8, 0]);
const translateY = interpolate(progress, [0, 1], [20, 0]);

<div style={{
  opacity,
  filter: `blur(${blur}px)`,
  transform: `translateY(${translateY}px)`,
}}>
```

### Breathing / Pulsing (Living Elements)

For elements that should feel organic and never settle. Uses `Math.sin()` on every frame:

```tsx
const pulse = Math.sin(frame * 0.1) * 0.02 + 1;       // 2% scale oscillation
const glowPulse = Math.sin(frame * 0.08) * 0.1 + 0.9;  // 10% opacity wave

<div style={{ transform: `scale(${pulse})`, opacity: glowPulse }}>
```

Use for: CTA button pulses, background glow breathing, accent element life.

### Ken Burns Background Zoom

Subtle camera motion. Small scale range (3-5%) over the full scene duration:

```tsx
const bgScale = interpolate(frame, [0, totalFrames], [1.05, 1.0], {
  extrapolateRight: "clamp",
});

<div style={{ transform: `scale(${bgScale})` }}>
  <MeshGradientBg />
</div>
```

Tip: Making the zoom slightly longer than the scene (`[0, 150]` for a 120-frame scene) creates forward momentum — the zoom is still in motion when the scene cuts.

### Concentric Ring Accents

Staggered rings expanding from center for background visual interest:

```tsx
{[0, 1, 2].map((i) => {
  const ringProgress = spring({ fps, frame: frame - 10 - i * 8, config: { damping: 30, stiffness: 50 } });
  const ringScale = interpolate(ringProgress, [0, 1], [0.3, 0.8 + i * 0.15]);
  const ringOpacity = interpolate(ringProgress, [0, 1], [0, 0.06 - i * 0.015]);
  return (
    <div key={i} style={{
      position: "absolute",
      width: 600 + i * 200,
      height: 600 + i * 200,
      borderRadius: "50%",
      border: "1px solid rgba(108, 92, 231, 0.15)",
      transform: `scale(${ringScale})`,
      opacity: ringOpacity,
    }} />
  );
})}
```

## Spring Config Guide

| Feel | Config | Use for |
|---|---|---|
| Snappy, punchy | `{ damping: 12, stiffness: 120 }` | Focal elements, CTAs, logos |
| Smooth, elegant | `{ damping: 25-30, stiffness: 50-80 }` | Background accents, dividers |
| Cinematic glide | `{ damping: 28, stiffness: 60, mass: 1.1 }` | Text reveals, hero entrances |
| Bouncy pop | `{ damping: 8-10, stiffness: 150 }` | Stats, badges, icons |
| Nearly linear | `{ damping: 200 }` | Subtle fades, very smooth reveals |

### Recommended Presets for constants.ts

```tsx
export const SPRING_SMOOTH = { damping: 200 } as const;
export const SPRING_SNAPPY = { damping: 20, stiffness: 200 } as const;
export const SPRING_BOUNCY = { damping: 8 } as const;
export const SPRING_ENTRANCE = { damping: 15, stiffness: 80 } as const;
export const SPRING_CINEMATIC = { damping: 28, stiffness: 60, mass: 1.1 } as const;
```

## Critical Rules

1. **Always clamp interpolations:**
   ```tsx
   interpolate(frame, [0, 120], [1.05, 1.0], { extrapolateRight: "clamp" });
   ```
   Unclamped values overshoot. Always use `extrapolateRight: "clamp"`.

2. **Never use CSS transitions in Remotion.** All animation must be frame-driven via `useCurrentFrame()` + `spring()` + `interpolate()`. No `transition`, `animation`, or `animate-*` classes.

3. **Use `useVideoConfig()` for fps** — don't hard-code `30`. Springs need the fps value.
