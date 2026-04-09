# Ad Narrative Structures

## YouTube Pre-Roll (30-60s)

The critical constraint: YouTube's **skip button appears at 5 seconds** (frame 150 at 30fps). Your hook must land before then.

### Narrative Arc

| Phase | Duration | Purpose | Key Principle |
|---|---|---|---|
| **Hook** | 3-5s | Grab attention, prevent skip | Bold text, emotional punch, visual impact |
| **Problem** | 5-10s | Establish pain point the audience feels | Validate their frustration, create tension |
| **Solution** | 10-15s | Show the product as the answer | Hero moment — dashboard, product UI, "aha" |
| **Features** | 10-20s | Demonstrate specific value | 2-3 key features with mini-demos, not screenshots |
| **Social Proof** | 3-5s | Build trust | Stats, numbers, "open source" badges |
| **CTA** | 3-5s | Drive action | URL, button, "Start Free", confetti |

### Hook Strategies

**Pain point hook** — Lead with a problem the audience immediately recognizes:
- "47 tabs open. 0 jobs." (tutorial hell)
- "Another meeting that should've been an email." (productivity)
- "Debugging in production. Again." (DevOps)

**Stat hook** — Lead with a surprising number:
- "26 career tracks. Zero cost."
- "993 lessons. One platform."

**Question hook** — Direct address:
- "Sound familiar?"
- "Still using spreadsheets for this?"

The hook text must be **fully readable by frame 120** (4s) to register before the skip button.

### Suggested remocn Components by Phase

| Phase | Components |
|---|---|
| Hook | `blur-reveal` (punch text), `spring-pop-in` (visual elements), `mesh-gradient-bg` |
| Problem | `typewriter` (pain points), `dynamic-grid` (chaos), `frosted-glass-wipe` (chaos→clarity) |
| Solution | `browser-flow` (product), `dashboard-populate` (SaaS), `hero-device-assemble` (device reveal), `slot-machine-roll` (stats) |
| Features | `terminal-simulator` (CLI), `glass-code-block` (code), `staggered-bento-grid` (feature grid), `spring-pop-in` (cards) |
| Social Proof | `slot-machine-roll` (counters), `animated-bar-chart` (metrics) |
| CTA | `typewriter` (URL), `success-confetti` (celebration), `blur-reveal` (tagline) |

### Scene Transitions

Vary transitions to maintain energy. Don't use the same transition twice in a row:

| Transition | Feel | Best between |
|---|---|---|
| `fade` (via @remotion/transitions) | Smooth, default | Any scenes |
| `wipe` (via @remotion/transitions) | Clean, directional | Problem→Solution, Features→CTA |
| `frosted-glass-wipe` (remocn) | Premium, elegant | Hook→Problem (narrative built-in) |
| `chromatic-aberration-wipe` (remocn) | High-energy, tech | Hook→anything, dramatic cuts |
| `spatial-push` (remocn) | Physical, impactful | Between major sections |

### Frame Budgeting

At 30fps, 1 second = 30 frames. Common durations:

| Duration | Frames | Good for |
|---|---|---|
| 3s | 90 | Quick beats: hook text, stat flash, CTA |
| 4s | 120 | Title cards, short scenes, transitions |
| 5s | 150 | Hook scenes (must land before skip) |
| 7s | 210 | Feature showcases, card stagger |
| 9s | 270 | Product demos, complex animations |
| 10s | 300 | Problem establishment with multiple text lines |

**Transition overlap budget:** Each 25-frame transition absorbs ~0.8s from adjacent scenes. With 4 transitions, that's ~3.3s absorbed. Plan scene durations to account for this.

## Product Showcase (60-90s)

More room for depth. Structure:

1. **Brand intro** (5-8s) — Logo, tagline, set the tone
2. **Product overview** (15-20s) — Full `browser-flow` or `dashboard-populate` walkthrough
3. **Feature deep-dives** (25-40s) — 3-4 features with live demos (terminal, code, AI, etc.)
4. **Social proof / stats** (5-10s) — Numbers, testimonials, badges
5. **CTA** (5-8s) — URL, pricing, "Start Free"

Use `simulated-cursor` for product walkthroughs. Show real interactions, not static screenshots.

## Short-Form (15-30s)

For social media / YouTube Shorts:

- **One message only.** Pick the single most compelling feature or stat.
- **Visual-first.** Must work on mute (no voiceover dependency).
- **Hook in 1-2s.** No slow builds. Immediate visual punch.
- **CTA is the last 3s.** Logo + URL + tagline.
- **Vertical (1080x1920) for Shorts/TikTok/Reels**, horizontal (1920x1080) for YouTube/Twitter.
