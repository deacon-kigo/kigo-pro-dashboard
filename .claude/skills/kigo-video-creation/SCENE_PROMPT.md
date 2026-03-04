# Scene Prompt Format

When decomposing slides into video scenes, use this structured format for each scene.

## Template

```
## Scene [N]: [Title]
- **Duration**: [X]s ([frames]f @ 30fps)
- **Layout**: [HeroTitle | SplitContent | FullScreenUI | StatHighlight | FeatureGrid | QuoteCallout | LogoCloud | ClosingCTA]
- **Background**: [color/gradient/effect]
- **Timing**:
  - 0.0s (0f) -- [First element description]
  - 0.5s (15f) -- [Second element description]
  - 1.2s (36f) -- [Third element description]
  - [continue for all elements...]
- **Content**:
  - Heading: "[exact text]"
  - Body: "[exact text]"
  - [other content elements...]
- **Effects**: [list of fx components used]
- **State**: [Redux state or component props needed, if using real UI]
- **Assets**: [referenced images, logos, UI components]
- **Transition**: [cut | fade | slide | wipe] to next scene
```

## Duration Guidelines

- Title cards: 3-4s (90-120f)
- Content slides: 5-7s (150-210f)
- Stats/highlights: 4-5s (120-150f)
- Logo clouds: 3s (90f)
- Closing CTA: 3s (90f)
- Total video: 30-90s recommended

## Timing Best Practices

- First element visible by 0.3s (9f)
- Stagger elements by 0.3-0.5s (9-15f)
- Allow 0.5s (15f) minimum for reading before next element
- Scene transition overlap: 0.5s (15f) via TransitionSeries
- Title entrance should complete within 0.7s (20f)
- Body text should start after heading is fully visible
- Bullet points stagger at 0.27s (8f) intervals

## Frame Math Quick Reference

- 30fps: 1 frame = 0.033s
- 0.5s = 15f
- 1.0s = 30f
- 1.5s = 45f
- 2.0s = 60f
- 3.0s = 90f
- 4.0s = 120f
- 5.0s = 150f
- 7.0s = 210f

## Decomposition Process

1. Identify the core message of each slide
2. Choose the best layout template (see LAYOUTS.md for selection guidance)
3. Map content elements to layout props
4. Select supporting effects (see EFFECTS.md for keyword lookup)
5. Define timing for each element entrance
6. Specify transitions between scenes
7. If using real UI, determine what Redux state or mock data is needed

## Example: Two-Scene Plan

```
## Scene 1: Hero Intro
- **Duration**: 4s (120f @ 30fps)
- **Layout**: HeroTitle
- **Background**: black (#231F20) with grid effect
- **Timing**:
  - 0.0s (0f) -- GridPattern fades in over 1s
  - 0.0s (0f) -- Title springs in (scale 0.85 -> 1.0)
  - 0.5s (15f) -- Subtitle fades in from below
- **Content**:
  - Heading: "The Future of Loyalty"
  - Subtitle: "Powered by Kigo"
- **Effects**: GradientText (title), GridPattern (background)
- **State**: none
- **Assets**: none
- **Transition**: fade to next scene

## Scene 2: Platform Stats
- **Duration**: 5s (150f @ 30fps)
- **Layout**: StatHighlight
- **Background**: dark gradient
- **Timing**:
  - 0.0s (0f) -- Title fades in with GradientText
  - 0.7s (20f) -- First stat counter starts
  - 1.1s (32f) -- Second stat counter starts
  - 1.5s (44f) -- Third stat counter starts
- **Content**:
  - Title: "Platform Impact"
  - Stats:
    - { value: 2.5, suffix: "M+", label: "ACTIVE MEMBERS", decimals: 1 }
    - { value: 98, suffix: "%", label: "UPTIME" }
    - { value: 340, suffix: "+", label: "ENTERPRISE CLIENTS" }
- **Effects**: GradientText (title), NumberTicker (stats)
- **State**: none
- **Assets**: none
- **Transition**: cut to next scene
```
