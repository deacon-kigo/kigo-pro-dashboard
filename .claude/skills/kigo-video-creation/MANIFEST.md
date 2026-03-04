# Video Manifest Schema

The manifest is the structured contract between the planning stages (brief → script → manifest) and the build stage. It's machine-parseable JSON that drives composition scaffolding.

## VideoManifest Schema

```typescript
interface VideoManifest {
  id: string; // kebab-case identifier (e.g., "offer-manager-promo")
  title: string; // Human-readable title
  durationFrames: number; // Total frames
  fps: 30;
  resolution: { width: 1920; height: 1080 };

  scenes: SceneManifest[];

  audio?: {
    src: string; // Path to audio file (public/ or absolute)
    manifest: AudioManifest; // Pre-extracted musical data
  };

  globalStyle: {
    motionPreset: "snappy" | "gentle" | "dramatic";
  };
}

interface SceneManifest {
  id: string; // Scene identifier (e.g., "hero-intro")
  template: string; // Layout component name (see mapping below)
  startFrame: number;
  durationFrames: number;
  energy: "low" | "medium" | "high" | "peak";

  props: Record<string, any>; // Template-specific props

  effects: string[]; // fx component names to layer

  realUI?: {
    component: string; // Import path relative to @/ (e.g., "components/features/offers/OfferManager")
    reduxState?: Record<string, any>; // Pre-populated store state
  };

  three?: {
    component: string; // 3D component name from three/ barrel
    props: Record<string, any>;
  };

  transition?: {
    type: "fade" | "slide" | "wipe" | "cut";
    durationFrames: number; // Typically 15f (0.5s)
  };
}
```

## Template-to-Component Mapping

| Template Name   | Component               | Best For                  | Key Props                                    |
| --------------- | ----------------------- | ------------------------- | -------------------------------------------- |
| `HeroTitle`     | `layouts/HeroTitle`     | Title cards, openers      | `title`, `subtitle`, `backgroundEffect`      |
| `SplitContent`  | `layouts/SplitContent`  | Feature + UI side-by-side | `heading`, `body`, `bullets`, `rightContent` |
| `FullScreenUI`  | `layouts/FullScreenUI`  | Real UI showcase          | `children`, `deviceFrame`, `title`           |
| `StatHighlight` | `layouts/StatHighlight` | KPI/metrics display       | `stats[]`, `title`                           |
| `FeatureGrid`   | `layouts/FeatureGrid`   | Multi-feature overview    | `features[]`, `columns`                      |
| `QuoteCallout`  | `layouts/QuoteCallout`  | Testimonials              | `quote`, `author`, `role`                    |
| `LogoCloud`     | `layouts/LogoCloud`     | Partner showcase          | `logos[]`, `title`                           |
| `ClosingCTA`    | `layouts/ClosingCTA`    | Final CTA slide           | `ctaText`, `subtitle`, `logoSrc`             |

## Effects Reference

| Effect Name      | Component           | Use With                     |
| ---------------- | ------------------- | ---------------------------- |
| `GradientText`   | `fx/GradientText`   | Headings for visual pop      |
| `ShimmerBorder`  | `fx/ShimmerBorder`  | CTA buttons, featured cards  |
| `SpotlightCard`  | `fx/SpotlightCard`  | Highlighted content cards    |
| `ParticleField`  | `fx/ParticleField`  | Atmospheric backgrounds      |
| `GlassMorphCard` | `fx/GlassMorphCard` | Premium card overlays        |
| `TypewriterText` | `fx/TypewriterText` | Quotes, code snippets        |
| `NumberTicker`   | `fx/NumberTicker`   | Statistics, KPIs             |
| `AnimatedBeam`   | `fx/AnimatedBeam`   | Connections between elements |
| `GridPattern`    | `fx/GridPattern`    | Subtle tech backgrounds      |
| `Spotlight`      | `fx/Spotlight`      | Dramatic lighting            |
| `AccentBar`      | `fx/AccentBar`      | Left-edge emphasis           |
| `CalloutBox`     | `fx/CalloutBox`     | Info boxes                   |

## 3D Component Reference

| Component         | Use For                      | Key Props              |
| ----------------- | ---------------------------- | ---------------------- |
| `StudioScene`     | 3D environment wrapper       | `children`             |
| `DeviceMockup3D`  | 3D laptop/phone with texture | `screenshot`, `device` |
| `FloatingCard3D`  | Premium 3D card              | `children`             |
| `Text3DHeading`   | 3D metallic text             | `text`, `color`        |
| `ReflectiveFloor` | Stage floor                  | —                      |

## AudioManifest Schema

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

## Scaffold Generation

When generating a composition scaffold from a manifest:

1. Import all referenced layout, fx, and three components
2. Import `MOTION` from `../../lib/motion-tokens`
3. Import `brand` constants from `../../lib/brand`
4. Create a `<Sequence>` for each scene at the correct `from` offset
5. Place placeholder comments inside each scene: `{/* TODO: Implement scene */}`
6. Register the composition in `Root.tsx` with correct duration and metadata
7. If any scene uses `realUI`, wrap the composition in `<StoreProvider>`

### Scaffold Template

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import { MOTION } from "../../lib/motion-tokens";
// ... layout/fx/three imports based on manifest

export const VideoName: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Scene 1: {title} — {template} */}
      <Sequence from={0} durationInFrames={120}>
        {/* TODO: Implement scene */}
      </Sequence>

      {/* Scene 2: {title} — {template} */}
      <Sequence from={120} durationInFrames={150}>
        {/* TODO: Implement scene */}
      </Sequence>
    </AbsoluteFill>
  );
};
```
