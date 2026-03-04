# Kigo Video Brand System

All brand constants are defined in `remotion/lib/brand.ts` and `remotion/lib/fonts.ts`.

## Colors

Source: `remotion/lib/brand.ts` -- `colors` object

| Name          | Hex       | Usage                                                  |
| ------------- | --------- | ------------------------------------------------------ |
| `black`       | `#231F20` | Primary background, dark surfaces                      |
| `charcoal`    | `#5A5858` | Secondary dark, device frames, muted elements          |
| `white`       | `#FFFFFF` | Primary text on dark backgrounds                       |
| `stone`       | `#f6f5f1` | Light backgrounds, off-white surfaces                  |
| `red`         | `#DC1021` | Alerts, errors, urgent indicators                      |
| `coral`       | `#FF4F5E` | Primary accent, AccentBar default, bullet dots, cursor |
| `orange`      | `#FF8717` | Secondary warm accent, gradient stops                  |
| `blue`        | `#328FE5` | Primary brand blue, gradient starts, beams, particles  |
| `darkSkyBlue` | `#25BDFE` | Bright accent blue                                     |
| `skyBlue`     | `#CCFFFE` | Light blue, gradient endpoints                         |
| `green`       | `#77D898` | Success states, positive metrics                       |
| `purple`      | `#8941EB` | Secondary brand, gradient midpoints                    |
| `lightPurple` | `#E5D7FA` | Light purple accent                                    |
| `pastelBlue`  | `#E1F0FF` | Light blue surface                                     |
| `pastelGreen` | `#DCFCE7` | Light green surface                                    |

### Common Color Patterns

- **Text on dark**: `colors.white` (full), `${colors.white}CC` (80%), `${colors.white}BB` (73%), `${colors.white}88` (53%)
- **Transparent overlays**: append hex alpha -- `${colors.blue}33` (20%), `${colors.white}22` (13%), `${colors.black}80` (50%)
- **Borders on dark**: `${colors.white}22` (~13%) or `${colors.white}15` (~8%)

## Gradients

Source: `remotion/lib/brand.ts` -- `gradients` object

| Name      | Definition                        | Usage                       |
| --------- | --------------------------------- | --------------------------- |
| `primary` | `135deg, blue -> purple`          | Default brand gradient      |
| `dark`    | `135deg, black -> charcoal`       | Dark background surfaces    |
| `hero`    | `135deg, black -> blue -> purple` | Hero/title card backgrounds |
| `coral`   | `135deg, coral -> orange`         | Warm accent gradient        |
| `sky`     | `135deg, skyBlue -> blue`         | Cool accent gradient        |

All gradients use 135-degree angle (top-left to bottom-right).

## Typography

Source: `remotion/lib/fonts.ts`

**Font Family**: Inter (loaded via `@remotion/google-fonts/Inter`)
**Weights loaded**: 400, 500, 600, 700, 800

### Style Presets

| Preset                  | Weight | Line Height | Letter Spacing    | Usage                                 |
| ----------------------- | ------ | ----------- | ----------------- | ------------------------------------- |
| `fontStyles.heading`    | 700    | 1.1         | -0.02em           | Main titles, large headings           |
| `fontStyles.subheading` | 600    | 1.2         | -0.01em           | Subtitles, section headings           |
| `fontStyles.body`       | 400    | 1.5         | normal            | Body text, descriptions, quotes       |
| `fontStyles.label`      | 500    | 1.3         | 0.02em, uppercase | Small labels, category tags, metadata |

### Typical Font Sizes

- Hero title: 90px (HeroTitle)
- Section title: 48-52px (SplitContent heading, FeatureGrid title)
- Quote text: 38px (QuoteCallout)
- Subtitle: 32px (HeroTitle subtitle)
- CTA text: 68px (ClosingCTA)
- Body text: 20px (SplitContent body, bullets)
- Description text: 14-16px (FeatureGrid cards)
- Labels: 14-15px (FullScreenUI title, StatHighlight labels)

## Spring Presets

Source: `remotion/lib/brand.ts` -- `springs` object

Use with Remotion's `spring()` function: `spring({ frame, fps, config: springs.smooth })`

| Name     | Damping | Mass | Stiffness | Character                                           |
| -------- | ------- | ---- | --------- | --------------------------------------------------- |
| `snappy` | 20      | 0.5  | 200       | Quick, responsive -- AccentBar, small elements      |
| `smooth` | 15      | 1.0  | 100       | Natural, fluid -- Title entrances, scale animations |
| `bouncy` | 10      | 0.8  | 150       | Slight overshoot -- CTA buttons, emphasis           |
| `gentle` | 20      | 1.2  | 80        | Slow, elegant -- Background fades, large movements  |

## Standard Durations

Source: `remotion/lib/brand.ts` -- `durations` object

| Name          | Frames | Seconds | Usage                                    |
| ------------- | ------ | ------- | ---------------------------------------- |
| `titleCard`   | 120    | 4.0     | Opening/closing title cards              |
| `shortScene`  | 90     | 3.0     | Logo clouds, brief transitions           |
| `mediumScene` | 150    | 5.0     | Content slides, feature grids            |
| `longScene`   | 210    | 7.0     | Detailed content, quotes with typewriter |
| `transition`  | 15     | 0.5     | Scene-to-scene overlap                   |

## Easing Curves

Source: `remotion/lib/brand.ts` -- `easings` object

Cubic bezier values for use with `interpolate()`:

| Name        | Values                  | Character                        |
| ----------- | ----------------------- | -------------------------------- |
| `easeOut`   | `[0.16, 1, 0.3, 1]`     | Decelerating -- natural stopping |
| `easeInOut` | `[0.42, 0, 0.58, 1]`    | Smooth start/stop                |
| `spring`    | `[0.34, 1.56, 0.64, 1]` | Overshoot then settle            |

Usage: `interpolate(frame, [0, 30], [0, 1], { easing: Easing.bezier(...easings.easeOut) })`

## Motion Principles

1. **Smooth, not snappy** -- Default to `springs.smooth` for most entrances. Reserve `springs.snappy` for small UI elements.
2. **Stagger everything** -- Elements should never appear all at once. Use 8-15 frame staggers between items.
3. **Let content breathe** -- Allow 15-30 frames (0.5-1s) of still time after all elements have entered before transitioning.
4. **Direction matters** -- Titles scale up from center, text slides from left, content slides up from below. Maintain consistent directional language.
5. **Opacity always** -- Every entrance includes a fade-in. Never pop elements in at full opacity.
6. **Subtle continuous motion** -- Background effects (particles, grids, spotlights) provide ambient life without distracting from content.
7. **Apple-keynote aesthetic** -- Dark backgrounds, white text, gradient accents, generous whitespace, premium materials in 3D.
