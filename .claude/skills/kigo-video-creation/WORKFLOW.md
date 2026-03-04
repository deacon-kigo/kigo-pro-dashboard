# Video Production Workflow

Production techniques for building polished Remotion videos. These principles apply during the iterative build phase (Stage 4 of the pipeline).

## The Iteration Pattern

Video production is NOT a single-shot task. Plan for:

- **100–200+ micro-exchanges** for a polished 30–60s video
- Each iteration should be tiny: "bigger logo", "slow the transition 20%", "center this text"
- Claude gets 80–90% on simple motion graphics; complex work needs many cycles
- Remotion Studio preview updates in real time — use it as a tight feedback loop

### Build Order

1. Build **one scene at a time**, starting with Scene 1
2. Get each scene approved before moving to the next
3. After all scenes: wire transitions, add music sync, full playthrough
4. Final micro-adjustments across the whole video

## Animation Principles

### Anticipation + Follow-Through

- **Anticipation**: slight reverse motion in first 10–15% of animation duration
- **Follow-through**: secondary elements (shadows, labels) animate slightly after primary, with overshoot

### Staging

- Only **ONE major animation** demands attention per frame
- Secondary actions reinforce without competing
- Exaggeration: overshoot on springs, slightly larger scale changes than physics dictates

### Entrance Timing Rules

- First element visible by **0.3s (9f)**
- Stagger elements by **0.3–0.5s (9–15f)**
- Allow **0.5s (15f)** minimum reading time before next element
- Title entrance should complete within **0.7s (20f)**
- Body text starts after heading is fully visible
- Bullet points stagger at **0.27s (8f)** intervals

## Scene Pacing

### Three-Act Micro-Structure (Even for 15s Videos)

1. **Setup** (20% of duration): Establish context, brand, mood
2. **Development** (60%): Key content, features, action sequences
3. **Resolution** (20%): Conclusion, CTA, logo resolve

### Energy Map & Call-and-Response

- Map energy (low/medium/high/peak) per scene BEFORE building
- **Never stack two high-energy scenes back-to-back**
- Big visual action → next scene recedes (breathing room)
- Music builds → visuals stay minimal → visuals EXPLODE on the break

### Directional Momentum

- Object exits right → next scene enters from left
- If using hard cuts, use them throughout (consistent transition language)
- Include holds between high-energy sequences

## Making Real UI Cinematic

Real UI is Kigo's differentiator — not mockups. Techniques:

- **Auto-zoom** on interactions (scale 1.0 → 1.3 on the clicked area)
- **Spring-physics cursor** smoothing (damped pointer movement)
- **Gradient/branded background** framing around UI
- **Speed ramp**: accelerate boring parts, slow down key interactions
- **Device mockup**: render UI in FullScreenUI with device frame

## Music-First Production

When music is provided:

### 1. Audio Analysis → Manifest

Pre-extract musical data into an `AudioManifest` JSON (see MANIFEST.md for schema).
Tools: librosa, Essentia, web-audio-beat-detector, Meyda.

### 2. Emotional Arc → Visual Language

| Section | Energy | Visual Language                                        |
| ------- | ------ | ------------------------------------------------------ |
| Intro   | Low    | Minimal, breathing, single element, dark palette       |
| Verse   | Medium | Structured, informational, steady rhythm               |
| Chorus  | High   | Explosive, saturated, full-screen, multiple elements   |
| Bridge  | Varied | Contrast shift, new perspective, texture change        |
| Drop    | Peak   | Maximum intensity, scale + particles + camera shake    |
| Outro   | Fading | Pulling back, simplifying, returning to single element |

### 3. Beat Sync Rules

- Visual hits land **2–4 frames BEFORE** the actual beat (never late)
- **Snap** into beat positions — don't ease into them (percussive, not gradual)
- Use off-beat frames for anticipation (slight pullback/scale-down before hit)
- Convert beat timestamps to frames: `Math.round(beatTimeSec * fps)`

### 4. Wiring Reactivity

```typescript
const audioData = useAudioData(audioSrc);
const visualization = visualizeAudio({
  fps,
  frame,
  audioData,
  numberOfSamples: 256,
});
const bass = visualization.slice(0, 4).reduce((a, b) => a + b, 0) / 4; // → bg pulse / shake
const mids = visualization.slice(4, 8).reduce((a, b) => a + b, 0) / 4; // → transitions / color
const highs = visualization.slice(8, 16).reduce((a, b) => a + b, 0) / 8; // → particles / detail
```

## Layering Technique: 3D + 2D + UI

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

## Props-Based Templating

After getting a base video working, refactor to accept props (company name, tagline, colors, data). Generate dozens of variations from one template without re-prompting.
