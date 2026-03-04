# REMOTION VIDEO PRODUCTION KNOWLEDGE

> Drop this file into your project root as `REMOTION_VIDEO_KNOWLEDGE.md` or into `.claude/rules/` as a rules file.
> Reference it in your CLAUDE.md with: `See REMOTION_VIDEO_KNOWLEDGE.md for video production context.`

---

## PROJECT CONTEXT

This project uses Claude Code + Remotion + React Three Fiber (R3F) to create music-driven SaaS video.
The Remotion project is embedded in a production app (21first.dev / 21Dev) using the `<Player>` component,
rendering real UI components from the live application — not mockups.

Architecture:

- Scene-based prompt system: each prompt = one scene
- Music-first workflow: audio analysis → LLM scene planning → Remotion rendering
- Layered composition: R3F 3D scenes + 2D UI + motion graphics in single compositions
- Real UI embedding: production React components rendered inside Remotion compositions

---

## TECHNICAL STACK RULES

### Remotion Core Rules

- NEVER use `Math.random()` — use Remotion's seeded `random()` for deterministic renders
- NEVER use CSS transitions, `@keyframes`, or `requestAnimationFrame` — they break parallel rendering
- ALL animation must be driven by `useCurrentFrame()` + `interpolate()` or `spring()`
- Static CSS (Flexbox, Grid, Tailwind utilities) works perfectly
- Use `<Sequence>` for temporal composition, `<AbsoluteFill>` for spatial layering
- Use `<TransitionSeries>` with built-in presentations (fade, slide, wipe, flip, clockWipe) for scene transitions
- Audio: re-encode all audio to 48kHz CBR before use; test sync at start, middle, and end

### React Three Fiber in Remotion

- Import from `@remotion/three` — use `<ThreeCanvas>` not `<Canvas>`
- NEVER use R3F's `useFrame()` hook — drive all animation from `useCurrentFrame()`
- Use `layout="none"` on any `<Sequence>` inside `<ThreeCanvas>`
- Set OpenGL renderer to `angle` for headless rendering
- Avoid Drei effects that rely on requestAnimationFrame (`<Glitch>`, `<DepthOfField>`) — they flicker during render
- AWS Lambda has NO GPU — Three.js CPU via swangle (slow). Use GPU instances for 3D-heavy content
- Include proper lighting in every 3D scene

### Audio & Music Integration

- Claude cannot process raw audio — all musical data must be pre-extracted as structured JSON
- Use `visualizeAudio()` from `@remotion/media-utils` for per-frame frequency data (array of 0–1 values)
  - Indices 0–3 = bass, 4–7 = mids, 8–15 = highs
- Use `getAudioData()` / `useAudioData()` for raw waveform access
- For music-driven scenes: LLMs handle macro-structure (scene themes, palettes per section),
  Remotion's audio APIs handle micro-reactivity (bass-pulsing, frequency-driven particles)

### Embedding Real UI

- Production React components can be imported directly into Remotion compositions
- Any animated CSS transitions in production components MUST be replaced with Remotion-native animation
- Brownfield integration: create `remotion/` folder inside existing app, share components between web app and video
- The `<Player>` component (~263k weekly npm downloads) embeds Remotion as an interactive preview in any React app

---

## MOTION DESIGN TOKENS (USE IN ALL SCENES)

```typescript
// motion-tokens.ts — import into every composition for consistency
import { Easing } from "remotion";

export const MOTION = {
  // Duration in frames (at 30fps: 8f = 0.27s, 12f = 0.4s, 20f = 0.67s, 30f = 1s)
  duration: {
    micro: 4, // instant feedback
    fast: 8, // UI-style snappy
    base: 12, // standard transition (0.3–0.4s max for UI feel)
    slow: 20, // deliberate movement
    dramatic: 30, // hero moments, scene transitions
    breathe: 45, // holds / breathing room
  },

  // Easing curves
  easing: {
    enter: Easing.out(Easing.cubic), // decelerate into position
    exit: Easing.in(Easing.cubic), // accelerate out
    emphasis: Easing.out(Easing.back(1.4)), // slight overshoot = anticipation
    smooth: Easing.inOut(Easing.cubic), // position changes
    elastic: Easing.out(Easing.elastic(1)), // playful bounce
  },

  // Spring configs for spring() calls
  spring: {
    gentle: { damping: 15, stiffness: 100, mass: 1 },
    snappy: { damping: 20, stiffness: 200, mass: 0.8 },
    bouncy: { damping: 10, stiffness: 150, mass: 1 },
    heavy: { damping: 25, stiffness: 80, mass: 1.5 },
  },

  // Stagger delay in frames between sequential element animations
  stagger: {
    tight: 3, // rapid-fire list items
    normal: 5, // standard stagger
    loose: 8, // deliberate sequence
    dramatic: 12, // one-by-one reveal
  },
} as const;
```

---

## CREATIVE WORKFLOW — HOW TO PRODUCE GOOD VIDEO

### The Iteration Pattern (Not Single-Shot Prompts)

- Simple prompts >> complex prompts. Start minimal, iterate rapidly.
- Typical production: 100–200+ micro-exchanges for a polished 30–60s video
- Each iteration should be tiny: "bigger logo", "slow the transition 20%", "center this text"
- Claude gets 80–90% of the way on simple motion graphics; complex work needs many cycles
- The Remotion preview updates in real time — use it as a tight feedback loop

### Scene Prompt Structure (What Works)

When prompting for a scene, specify:

1. Resolution and FPS (e.g., 1920×1080, 30fps)
2. Background (color, gradient, or transparent for layering)
3. Numbered animation sequence with explicit frame ranges
4. Reference the motion tokens: "use MOTION.easing.enter for all entrances"

Example: "Scene 3 (frames 180–360): Feature cards slide in from bottom with stagger.
Each card: white bg, rounded corners, icon + label. Use spring.snappy.
Cards stagger by MOTION.stagger.normal frames. Hold for 30 frames after all visible."

### What Claude Does Well vs. Poorly

GOOD: Terminal typing animations, text reveals, data visualizations, clean infographics,
simple product demos, geometric/abstract motion, code walkthroughs, chart animations

POOR: Complex overlapping multi-element animations, spatial reasoning (z-index, proportions),
nuanced artistic composition, anything requiring visual taste judgment

### Props-Based Templating (Scale Technique)

After getting a base video working, refactor to accept props (company name, tagline, colors, data).
Generate dozens of variations from one template without re-prompting.
One video is easier in After Effects; 100 videos are easier in Remotion.

---

## MUSIC-FIRST PRODUCTION TECHNIQUE

### Phase 1: Audio Analysis → Structured Manifest

Pre-extract all musical data into a JSON manifest before any prompting:

```typescript
interface AudioManifest {
  bpm: number;
  beatTimestamps: number[]; // seconds
  sections: {
    label: string; // "intro" | "verse" | "chorus" | "bridge" | "drop" | "outro"
    startTime: number;
    endTime: number;
    energy: number; // 0–1
    mood: string; // "tense" | "euphoric" | "minimal" | "building"
  }[];
  key: string;
  timeSignature: string;
}
```

Tools for extraction:

- **librosa** (Python): `librosa.beat.beat_track()` for BPM + beat positions
- **Essentia** (Python/JS WASM): `RhythmExtractor2013`, `TempoCNN` for tempo
- **web-audio-beat-detector** (browser): quick BPM + first-beat-offset
- **Meyda** (browser): per-frame timbral features (spectral centroid, MFCCs, energy)

### Phase 2: Emotional Arc → Visual Language

Map each song section to a visual language BEFORE generating any code:

| Section | Energy | Visual Language                                        |
| ------- | ------ | ------------------------------------------------------ |
| Intro   | Low    | Minimal, breathing, single element, dark palette       |
| Verse   | Medium | Structured, informational, steady rhythm               |
| Chorus  | High   | Explosive, saturated, full-screen, multiple elements   |
| Bridge  | Varied | Contrast shift, new perspective, texture change        |
| Drop    | Peak   | Maximum intensity, scale + particles + camera shake    |
| Outro   | Fading | Pulling back, simplifying, returning to single element |

### Phase 3: Call-and-Response Principle

NEVER max out both music and visuals simultaneously.

- Big visual action → music responds while visuals recede
- Music builds → visuals stay minimal → visuals EXPLODE on the break
- This dynamic breathing is what separates professional from amateur

### Phase 4: Beat Synchronization Rules

- Visual hits should land 2–4 frames BEFORE the actual beat (never late)
- Snap into beat positions — don't ease into them (percussive, not gradual)
- Use off-beat frames for anticipation (slight pullback/scale-down before the hit)
- Convert beat timestamps to frames: `Math.round(beatTimeSec * fps)`

### Phase 5: Wiring Up Reactivity in Remotion

```typescript
// Map frequency bands to visual parameters
const audioData = useAudioData(audioSrc);
const visualization = visualizeAudio({
  fps,
  frame,
  audioData,
  numberOfSamples: 256,
});

const bass = visualization.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
const mids = visualization.slice(4, 8).reduce((a, b) => a + b, 0) / 4;
const highs = visualization.slice(8, 16).reduce((a, b) => a + b, 0) / 8;

// Bass → background pulse / camera shake
// Mids → element transitions / color shifts
// Highs → particle density / detail effects
```

---

## LAYERING TECHNIQUE: 3D + 2D + UI

### DOM-Over-Canvas Pattern

```tsx
<AbsoluteFill>
  {/* Layer 1: 3D background */}
  <ThreeCanvas style={{ position: "absolute" }}>
    <Scene3D />
  </ThreeCanvas>

  {/* Layer 2: 2D motion graphics overlay */}
  <AbsoluteFill style={{ zIndex: 1, pointerEvents: "none" }}>
    <MotionGraphicsOverlay />
  </AbsoluteFill>

  {/* Layer 3: UI components on top */}
  <AbsoluteFill style={{ zIndex: 2, pointerEvents: "none" }}>
    <RealAppUI />
  </AbsoluteFill>
</AbsoluteFill>
```

### Making Real UI Cinematic (Not a Screen Recording)

- Auto-zoom on interactions (scale 1.0 → 1.3 on the clicked area)
- Spring-physics cursor smoothing (damped pointer movement)
- Gradient/branded background framing around UI screenshots
- Speed ramp: accelerate boring parts, slow down key interactions
- Device mockup: render UI on a 3D phone/laptop model via video texture

### Camera Techniques in R3F + Remotion

- Dolly moves with smooth easing for filmic push-ins
- FOV animation for Hitchcock dolly-zoom effect
- `damp3` / `dampE` from maath library for smooth exponential damping
- All camera properties driven by `useCurrentFrame()` + `interpolate()`

---

## SCENE PACING & STORYTELLING ARCHITECTURE

### Three-Act Micro-Structure (Even for 15s Videos)

1. **Setup** (20% of duration): Establish context, brand, mood
2. **Development** (60%): Key content, features, action sequences
3. **Resolution** (20%): Conclusion, CTA, logo resolve

### Duration Guidelines

- Micro-interactions: 100–200ms (3–6 frames at 30fps)
- Moderate transitions: 300–400ms (9–12 frames)
- Complex sequences: 500–700ms (15–21 frames)
- Scene holds (breathing room): 1–2 seconds (30–60 frames)

### Cross-Scene Coherence Rules

1. **Consistent transition language**: if using hard cuts, use them throughout
2. **Directional momentum**: object exits right → next scene enters from left
3. **Map energy before generating**: plan which scenes are high/low energy
4. **Reference shared motion tokens**: every scene uses same easing/spring/stagger values
5. **Breathing room**: include holds between high-energy sequences

### Animation Principles to Encode

- **Anticipation**: slight reverse motion in first 10–15% of animation duration
- **Follow-through**: secondary elements (shadows, labels) animate slightly after primary, with overshoot
- **Staging**: only ONE major animation demands attention per frame
- **Secondary action**: subtle supporting animations reinforce without competing
- **Exaggeration**: overshoot on springs, slightly larger scale changes than physics dictates

---

## SCENE-BASED MANIFEST ARCHITECTURE

### Manifest-Driven Approach (Proven at Scale)

Instead of unconstrained code generation, use parameterized scene templates:

```typescript
interface VideoManifest {
  scenes: {
    id: string;
    template: string; // "hero-text" | "feature-cards" | "ui-demo" | "3d-scene" | "data-viz"
    startFrame: number;
    durationFrames: number;
    props: Record<string, any>; // template-specific parameters
    transition?: {
      type: "fade" | "slide" | "wipe" | "cut";
      durationFrames: number;
    };
    audioSync?: {
      section: string; // references AudioManifest section
      reactivity: "bass" | "mids" | "highs" | "all";
      intensity: number; // 0–1
    };
  }[];
  globalStyle: {
    primaryColor: string;
    fontFamily: string;
    motionPreset: "snappy" | "gentle" | "dramatic";
  };
}
```

### Why This Works

- LLM generates the manifest (structured data), NOT arbitrary React code
- Templates constrain output to known-good patterns
- A switch statement maps manifest entries to React components
- Each component receives calculated `from` prop for temporal sequencing
- Proven at scale: GitHub "Year in Code" rendered 10,000 personalized videos via Lambda

---

## KEY RESOURCES

- Remotion AI docs: remotion.dev/docs/ai/
- Remotion system prompt for LLMs: remotion.dev/llms.txt
- Agent Skills repo: github.com/remotion-dev/skills (+ modular rule files)
- 3D rules: github.com/remotion-dev/skills/blob/main/skills/remotion/rules/3d.md
- Prompt Gallery: remotion.dev/prompts/
- ThreeCanvas docs: remotion.dev/docs/three-canvas
- Audio visualization: remotion.dev/docs/audio/visualization
- TransitionSeries: remotion.dev/docs/transitions/transitionseries
- Player embedding: remotion.dev/docs/player/player
- Brownfield integration: remotion.dev/docs/brownfield
- Prompt-to-Motion-Graphics SaaS template: github.com/remotion-dev/template-prompt-to-motion-graphics-saas
- Starter kit (kickstart): github.com/jhartquist/claude-remotion-kickstart
- R3F template: github.com/remotion-dev/template-three
