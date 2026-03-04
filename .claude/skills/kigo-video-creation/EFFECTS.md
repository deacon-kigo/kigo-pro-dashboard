# Effects Quick Reference

All effects live in `remotion/components/fx/` and are exported from `remotion/components/fx/index.ts`.

Import pattern:

```typescript
import { GradientText, ShimmerBorder, ParticleField } from "../fx";
```

Every effect uses `useCurrentFrame()` + `interpolate()` / `spring()` for animation. No CSS transitions, no CSS animations, no runtime state.

---

## GradientText

**Keywords**: "gradient text", "animated text", "color sweep", "shimmering text"
**File**: `remotion/components/fx/GradientText.tsx`

Animated gradient sweep across text using `background-clip: text`.

| Prop         | Type            | Default                 | Description           |
| ------------ | --------------- | ----------------------- | --------------------- |
| `text`       | `string`        | required                | Text to render        |
| `startFrame` | `number`        | `0`                     | Frame offset          |
| `colors`     | `string[]`      | `[blue, purple, coral]` | Gradient color stops  |
| `style`      | `CSSProperties` | --                      | Additional CSS styles |

**Behavior**: Fades in over 15f. Gradient cycles through 200% background width every 2 seconds (60f) for continuous color sweep. First color is duplicated at end for seamless loop.

**Usage**: Headings, titles, any prominent text that needs visual emphasis.

---

## ShimmerBorder

**Keywords**: "shimmer border", "glowing border", "animated border", "rainbow border"
**File**: `remotion/components/fx/ShimmerBorder.tsx`

Card wrapper with a continuously rotating conic-gradient border.

| Prop           | Type        | Default  | Description            |
| -------------- | ----------- | -------- | ---------------------- |
| `children`     | `ReactNode` | required | Card content           |
| `borderWidth`  | `number`    | `2`      | Border thickness in px |
| `borderRadius` | `number`    | `16`     | Corner radius in px    |
| `startFrame`   | `number`    | `0`      | Frame offset           |

**Behavior**: Fades in over 15f. Conic gradient rotates 360 degrees every 2 seconds. Colors: blue -> purple -> coral -> orange -> blue. Inner content has black background.

**Usage**: CTA cards, highlighted sections, premium card wrapping.

---

## SpotlightCard

**Keywords**: "spotlight card", "hover light", "moving light card"
**File**: `remotion/components/fx/SpotlightCard.tsx`

Card with a radial spotlight tracing an elliptical path across the surface.

| Prop             | Type        | Default       | Description    |
| ---------------- | ----------- | ------------- | -------------- |
| `children`       | `ReactNode` | required      | Card content   |
| `startFrame`     | `number`    | `0`           | Frame offset   |
| `spotlightColor` | `string`    | `colors.blue` | Spotlight tint |

**Behavior**: Fades in over 20f. Spotlight follows an elliptical path (X: 20-80%, Y: 30-70%) with a 3-second cycle. Uses radial gradient at 0.2 opacity (`33` hex). Black background with 16px border-radius.

**Usage**: Feature cards, highlighted content blocks.

---

## ParticleField

**Keywords**: "particles", "floating dots", "particle background", "ambient dots"
**File**: `remotion/components/fx/ParticleField.tsx`

SVG-based floating dot particles with sinusoidal drift and pulsing opacity.

| Prop            | Type     | Default       | Description                |
| --------------- | -------- | ------------- | -------------------------- |
| `particleCount` | `number` | `60`          | Number of particles        |
| `startFrame`    | `number` | `0`           | Frame offset               |
| `color`         | `string` | `colors.blue` | Particle color             |
| `speed`         | `number` | `1`           | Animation speed multiplier |

**Behavior**: Global fade-in over 30f. Each particle has deterministic position (seeded LCG random), sinusoidal X/Y drift (3% of container), and pulsing opacity. Particles are absolutely positioned SVG circles covering the full container.

**Usage**: Background texture for title cards, closing slides, any scene needing subtle motion.

---

## GlassMorphCard

**Keywords**: "glass card", "frosted glass", "blur card", "glassmorphism"
**File**: `remotion/components/fx/GlassMorphCard.tsx`

Frosted-glass card with backdrop blur.

| Prop         | Type        | Default  | Description                                     |
| ------------ | ----------- | -------- | ----------------------------------------------- |
| `children`   | `ReactNode` | required | Card content                                    |
| `startFrame` | `number`    | `0`      | Frame offset                                    |
| `opacity`    | `number`    | `0.12`   | Background opacity (0-1, mapped to white alpha) |

**Behavior**: Fades in + slides up 24px over 20f. Background: white at given opacity with 24px backdrop blur. 20px border-radius, 32px padding, 1px white border at ~13% opacity, subtle box shadow.

**Usage**: Feature grid cards, content containers, any elevated surface.

---

## TypewriterText

**Keywords**: "typewriter", "typing effect", "character reveal", "text reveal"
**File**: `remotion/components/fx/TypewriterText.tsx`

Character-by-character text reveal with blinking cursor.

| Prop            | Type            | Default        | Description                                        |
| --------------- | --------------- | -------------- | -------------------------------------------------- |
| `text`          | `string`        | required       | Full text to reveal                                |
| `startFrame`    | `number`        | `0`            | Frame offset                                       |
| `charsPerFrame` | `number`        | `0.5`          | Characters revealed per frame (supports fractions) |
| `cursorColor`   | `string`        | `colors.coral` | Cursor bar color                                   |
| `style`         | `CSSProperties` | --             | Text styling                                       |

**Behavior**: Container fades in over 8f. Characters appear at `charsPerFrame` rate. Cursor is always visible while typing; blinks on/off every 15f after typing completes. Duration formula: `ceil(text.length / charsPerFrame)` frames.

**Usage**: Quotes, testimonials, dramatic text reveals.

---

## NumberTicker

**Keywords**: "counter", "number animation", "count up", "odometer", "ticker"
**File**: `remotion/components/fx/NumberTicker.tsx`

Spring-driven count-up animation from 0 to target value.

| Prop         | Type            | Default  | Description                    |
| ------------ | --------------- | -------- | ------------------------------ |
| `value`      | `number`        | required | Target number                  |
| `startFrame` | `number`        | `0`      | Frame offset                   |
| `duration`   | `number`        | `60`     | Count-up duration in frames    |
| `prefix`     | `string`        | `""`     | Text before number (e.g., "$") |
| `suffix`     | `string`        | `""`     | Text after number (e.g., "%")  |
| `decimals`   | `number`        | `0`      | Decimal places                 |
| `style`      | `CSSProperties` | --       | Text styling                   |

**Behavior**: Uses `spring()` with dynamic stiffness based on duration. Displayed value = `spring_progress * value`, formatted with locale-aware thousand separators. Uses `tabular-nums` font variant for stable digit width.

**Usage**: Statistics, KPIs, metric displays. Pair with `StatHighlight` layout.

---

## AnimatedBeam

**Keywords**: "beam", "connecting line", "data flow", "neon line"
**File**: `remotion/components/fx/AnimatedBeam.tsx`

SVG line between two points with a travelling glow segment.

| Prop          | Type     | Default       | Description             |
| ------------- | -------- | ------------- | ----------------------- |
| `fromX`       | `number` | required      | Start X coordinate (px) |
| `fromY`       | `number` | required      | Start Y coordinate (px) |
| `toX`         | `number` | required      | End X coordinate (px)   |
| `toY`         | `number` | required      | End Y coordinate (px)   |
| `startFrame`  | `number` | `0`           | Frame offset            |
| `color`       | `string` | `colors.blue` | Beam color              |
| `strokeWidth` | `number` | `2`           | Line thickness          |

**Behavior**: Fades in over 20f. Base line at 0.15 opacity. Bright segment (30% of line length) travels along the line via `strokeDashoffset` animation, one full cycle every 2 seconds. SVG gaussian blur filter creates neon glow.

**Usage**: Connection diagrams, data flow visualizations, architecture illustrations.

---

## GridPattern

**Keywords**: "dot grid", "grid background", "dot pattern", "grid texture"
**File**: `remotion/components/fx/GridPattern.tsx`

SVG dot grid background with radial fade mask and parallax drift.

| Prop         | Type     | Default           | Description                              |
| ------------ | -------- | ----------------- | ---------------------------------------- |
| `dotSize`    | `number` | `2`               | Dot radius in px                         |
| `gap`        | `number` | `32`              | Grid cell size in px                     |
| `startFrame` | `number` | `0`               | Frame offset                             |
| `fadeRadius` | `number` | `70`              | Radial fade mask radius (% of container) |
| `color`      | `string` | `colors.charcoal` | Dot color                                |

**Behavior**: Fades to 0.5 opacity over 30f. Dots drift with subtle sinusoidal parallax (8px horizontal, 6px vertical). Radial gradient mask fades edges to transparent. Full-frame SVG overlay, pointer-events disabled.

**Usage**: Background for HeroTitle scenes, subtle texture behind content.

---

## Spotlight

**Keywords**: "spotlight sweep", "light sweep", "stage light", "dramatic lighting"
**File**: `remotion/components/fx/Spotlight.tsx`

Large radial light that sweeps back and forth across the scene.

| Prop            | Type     | Default        | Description                     |
| --------------- | -------- | -------------- | ------------------------------- |
| `startFrame`    | `number` | `0`            | Frame offset                    |
| `color`         | `string` | `colors.white` | Light color                     |
| `size`          | `number` | `800`          | Spotlight diameter in px        |
| `sweepDuration` | `number` | `fps * 3`      | Frames for one full sweep cycle |

**Behavior**: Fades to 0.25 opacity over 15f. Ping-pong sweep: X position oscillates 10-90% using triangle wave. Y position gently drifts with sine function. Uses radial gradient at `22` hex opacity (roughly 13%).

**Usage**: Dramatic background for quotes, testimonials, any scene needing stage-light ambiance.

---

## AccentBar

**Keywords**: "accent bar", "colored bar", "vertical bar", "section marker"
**File**: `remotion/components/fx/AccentBar.tsx`

Vertical colored bar that slides in from the left with spring animation.

| Prop         | Type               | Default        | Description                   |
| ------------ | ------------------ | -------------- | ----------------------------- |
| `color`      | `string`           | `colors.coral` | Bar color                     |
| `width`      | `number`           | `6`            | Bar width in px               |
| `startFrame` | `number`           | `0`            | Frame offset                  |
| `height`     | `number \| string` | `48`           | Bar height (px or CSS string) |

**Behavior**: Spring-based slide-in (`springs.snappy`) from 40px left of final position. Opacity controlled by spring progress. Fully rounded ends (border-radius = width/2).

**Usage**: Heading decorations, section markers. Built into `SplitContent` and `QuoteCallout` layouts.

---

## CalloutBox

**Keywords**: "callout", "info box", "callout card", "bordered card"
**File**: `remotion/components/fx/CalloutBox.tsx`

Bordered card with a left-edge accent bar.

| Prop              | Type        | Default              | Description           |
| ----------------- | ----------- | -------------------- | --------------------- |
| `children`        | `ReactNode` | required             | Card content          |
| `accentColor`     | `string`    | `colors.blue`        | Left accent bar color |
| `startFrame`      | `number`    | `0`                  | Frame offset          |
| `backgroundColor` | `string`    | `colors.white` at 5% | Card background       |

**Behavior**: Left accent bar springs in with `springs.snappy` (Y-scale from 0 to 1, origin top). Body content fades in + slides right 16px starting at frame 6, completing by frame 22. 12px border-radius, 1px border at 8% white opacity, 24x28px padding.

**Usage**: Key takeaways, important notes, highlighted info within larger scenes.
