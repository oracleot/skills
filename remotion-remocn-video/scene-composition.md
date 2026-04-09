# Scene Composition Patterns

## Stitching Scenes with TransitionSeries

Use `<TransitionSeries>` from `@remotion/transitions` for sequential scene assembly with built-in transitions:

```tsx
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

const TRANS_FADE = springTiming({ config: { damping: 200 }, durationInFrames: 25 });
const TRANS_WIPE = springTiming({ config: { damping: 20, stiffness: 200 }, durationInFrames: 25 });

export const MainAd: React.FC = () => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150}>
        <Scene1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={TRANS_FADE} presentation={fade()} />
      <TransitionSeries.Sequence durationInFrames={300}>
        <Scene2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={TRANS_WIPE} presentation={wipe({ direction: "from-right" })} />
      <TransitionSeries.Sequence durationInFrames={150}>
        <Scene3 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
```

### Alternative: Series with remocn Transitions

Use remocn's `frosted-glass-wipe` as `<Series.Sequence>` entries with negative offsets for overlap:

```tsx
<Series>
  <Series.Sequence durationInFrames={120}><Scene1 /></Series.Sequence>
  <Series.Sequence offset={-15} durationInFrames={15}>
    <FrostedGlassWipe direction="right"><Scene2 /></FrostedGlassWipe>
  </Series.Sequence>
  <Series.Sequence durationInFrames={300}><Scene2 /></Series.Sequence>
</Series>
```

## Frame Math with Transitions

Transition sequences overlap with the previous sequence — they don't add time.

**Budget formula:** Total frames = sum of scene durations. Transitions borrow from adjacent scenes.

With `TransitionSeries`, each transition of N frames causes an N-frame overlap. If you have 5 scenes totaling 900 frames and 4 transitions of 25 frames each, net playback = 900 - (4 × 25) = 800 frames. Plan scene durations accordingly.

## Two Valid Scene Authoring Styles

### Style 1: Rich Manual Composition

Scene composes multiple remocn components with manual spring/interpolate choreography. Use when building multi-element scenes:

```tsx
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconProgress = spring({ fps, frame: frame - 5, config: SPRING_ENTRANCE });
  const iconScale = interpolate(iconProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <MeshGradientBg colors={brandColors} speed={0.8} />
      <div style={{ transform: `scale(${iconScale})` }}>
        <LogoIcon />
      </div>
      <BlurReveal text="Brand Name" fontSize={108} />
    </AbsoluteFill>
  );
};
```

### Style 2: Thin Delegation

Scene delegates entirely to a self-contained remocn component that encapsulates a complete visual narrative:

```tsx
export const DemoScene: React.FC = () => (
  <AbsoluteFill>
    <TerminalToBrowserDeploy siteUrl="https://app.example.io" accentColor="#6C5CE7" speed={1} />
  </AbsoluteFill>
);
```

**When to use which:** Use Style 2 when a remocn component already handles everything (multi-phase demos, full dashboard animations). Use Style 1 when composing multiple elements or need custom choreography.

## Root.tsx Registration Pattern

Always register both the main composition and each scene individually:

```tsx
export const RemotionRoot: React.FC = () => (
  <>
    {/* Full video */}
    <Composition id="MainAd" component={MainAd} durationInFrames={900} fps={30} width={1920} height={1080} />

    {/* Individual scenes for Studio preview */}
    <Composition id="TitleCard" component={TitleCard} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="ProductDemo" component={ProductDemo} durationInFrames={270} fps={30} width={1920} height={1080} />
    {/* ... etc */}
  </>
);
```

**Important:** Standalone durations must match what the Series allocates. If you change a scene's duration in the master composition, update the standalone `<Composition>` too.
