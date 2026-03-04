# Kigo Video Creation Skill

## Overview

Create Apple-quality animated videos using Remotion inside kigo-pro-dashboard. Videos showcase the Kigo platform using real UI components, premium effects, and 3D scenes.

## Video Pipeline

The recommended workflow uses a 4-stage pipeline. Run `/video-pipeline` to execute all stages, or run individual stages:

| Stage       | Command                    | Output                                              | Duration |
| ----------- | -------------------------- | --------------------------------------------------- | -------- |
| 1. Brief    | `/video-brief`             | `tmp/videos/{name}-brief.md`                        | ~2 min   |
| 2. Script   | `/video-script`            | `tmp/videos/{name}-script.md`                       | ~5 min   |
| 3. Manifest | `/video-manifest`          | `tmp/videos/{name}-manifest.json` + scaffold `.tsx` | ~5 min   |
| 4. Build    | _(iterative conversation)_ | `remotion/compositions/{Name}.tsx`                  | ~60+ min |

Stages 1–3 are structured commands with quality gates. Stage 4 is an iterative conversation loop supported by this skill's documentation.

## Skill Documentation

| File               | Purpose                                                         |
| ------------------ | --------------------------------------------------------------- |
| `SKILL.md`         | This file — overview, workflow, rules                           |
| `SCENE_PROMPT.md`  | Structured scene format with timing guidelines                  |
| `BRAND.md`         | Design system (colors, gradients, typography, springs)          |
| `EFFECTS.md`       | 12 premium animation effects with props and usage               |
| `LAYOUTS.md`       | 8 layout templates with animation behavior                      |
| `THREE_D.md`       | React Three Fiber component guide                               |
| `REAL_UI.md`       | Dashboard component integration guide                           |
| `WORKFLOW.md`      | Production techniques (iteration, pacing, music sync, layering) |
| `MANIFEST.md`      | VideoManifest schema, template mapping, scaffold generation     |
| `MOTION_TOKENS.md` | Motion token reference (durations, easings, springs, staggers)  |

## Workflow (Manual)

If not using the pipeline commands, follow this manual workflow:

1. **Receive** — User provides slide descriptions or a brief
2. **Decompose** — Break each slide into elements (heading, body, callout, image/UI, background)
3. **Plan** — Generate a structured scene prompt for each slide (see SCENE_PROMPT.md)
4. **Review** — Present the scene plan to the user for approval/adjustments
5. **Build** — Create the Remotion composition from the approved plan
6. **Preview** — `npm run video:dev` to open Remotion Studio
7. **Render** — `npm run video:render -- <CompositionId> out/<name>.mp4 --gl=angle`

## Component Inventory

### Layouts (remotion/components/layouts/)

Full-frame scene templates — see LAYOUTS.md for details:

- `HeroTitle` — Title cards with background effects
- `SplitContent` — Left text + right media split
- `FullScreenUI` — Real UI component filling frame
- `StatHighlight` — Animated statistics display
- `FeatureGrid` — Card grid with stagger
- `QuoteCallout` — Testimonial display
- `LogoCloud` — Partner/logo showcase
- `ClosingCTA` — Final slide with CTA

### Effects (remotion/components/fx/)

Premium animation effects — see EFFECTS.md for details:

- `GradientText`, `ShimmerBorder`, `SpotlightCard`, `ParticleField`
- `GlassMorphCard`, `TypewriterText`, `NumberTicker`, `AnimatedBeam`
- `GridPattern`, `Spotlight`, `AccentBar`, `CalloutBox`

### 3D (remotion/components/three/)

React Three Fiber components — see THREE_D.md for details:

- `StudioScene`, `DeviceMockup3D`, `FloatingCard3D`, `Text3DHeading`, `ReflectiveFloor`

### Real UI Components

Dashboard components from the main app — see REAL_UI.md.

### Motion Tokens (remotion/lib/motion-tokens.ts)

Standardized animation constants — see MOTION_TOKENS.md for reference:

- Duration tiers: `MOTION.duration.{micro|fast|base|slow|dramatic|breathe}`
- Easing curves: `MOTION.easing.{enter|exit|emphasis|smooth|elastic}`
- Spring configs: `MOTION.spring.{gentle|snappy|bouncy|heavy}`
- Stagger presets: `MOTION.stagger.{tight|normal|loose|dramatic}`

## Key Files

- Entry: `remotion/index.ts`
- Registry: `remotion/Root.tsx`
- Config: `remotion.config.ts`
- Brand: `remotion/lib/brand.ts`
- Fonts: `remotion/lib/fonts.ts`
- Motion tokens: `remotion/lib/motion-tokens.ts`
- FX barrel: `remotion/components/fx/index.ts`
- 3D barrel: `remotion/components/three/index.ts`
- Store: `remotion/providers/StoreProvider.tsx`

## Rules

1. ALL animation via `useCurrentFrame()` + `interpolate()` / `spring()` from "remotion"
2. NO CSS transitions, NO CSS animations, NO Framer Motion
3. NO useEffect/useState for animation state
4. 3D: Use `<ThreeCanvas>` from `@remotion/three`, `layout="none"` on Sequences
5. Register every composition in `remotion/Root.tsx`
6. Wrap compositions in `<StoreProvider>` if using real UI components
7. Standard: 1920x1080 @ 30fps
8. Render with `--gl=angle` for 3D content
9. Import effects from `../fx` (barrel export), three from `../three`
10. Import brand constants from `../../lib/brand`, fonts from `../../lib/fonts`
11. Import motion tokens from `../../lib/motion-tokens` for all animation timing
12. Use `MOTION.easing.enter` for entrances, `MOTION.stagger.normal` as default stagger
