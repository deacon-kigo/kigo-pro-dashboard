# Layout Templates Reference

All layouts live in `remotion/components/layouts/`. Each is a full-frame (1920x1080) React component that handles its own entrance animations using `useCurrentFrame()` + `interpolate()` / `spring()`.

Every layout accepts a `startFrame` prop (default `0`) for staggering within a `<Sequence>`.

---

## HeroTitle

**File**: `remotion/components/layouts/HeroTitle.tsx`
**Best for**: Opening title cards, section dividers, dramatic single-message slides.

### Props

| Prop               | Type                                  | Default  | Description                                   |
| ------------------ | ------------------------------------- | -------- | --------------------------------------------- |
| `title`            | `string`                              | required | Main title text, rendered with `GradientText` |
| `subtitle`         | `string`                              | --       | Optional subtitle below title                 |
| `backgroundEffect` | `"grid" \| "particles" \| "gradient"` | `"grid"` | Background effect layer                       |
| `startFrame`       | `number`                              | `0`      | Frame offset for entrance                     |

### Animation Behavior

- Background: `GridPattern` (charcoal dots), `ParticleField` (blue, 80 particles), or gradient overlay (hero gradient, fades to 0.6 opacity over 30f)
- Title: spring scale from 0.85 to 1.0 (`springs.smooth`) + fade over 20f
- Subtitle: fades in + slides up 20px, starts at frame 15, completes by frame 35

### Scene Prompt Example

```
## Scene 1: Opening Title
- **Duration**: 4s (120f @ 30fps)
- **Layout**: HeroTitle
- **Background**: black with particles
- **Content**:
  - Heading: "Kigo Pro Dashboard"
  - Subtitle: "Enterprise Loyalty, Reimagined"
- **Effects**: GradientText, ParticleField
```

---

## SplitContent

**File**: `remotion/components/layouts/SplitContent.tsx`
**Best for**: Feature explanations, product walkthroughs, any slide with supporting visuals.

### Props

| Prop           | Type              | Default                  | Description                                             |
| -------------- | ----------------- | ------------------------ | ------------------------------------------------------- |
| `heading`      | `string`          | required                 | Left panel heading                                      |
| `body`         | `string`          | --                       | Optional body paragraph                                 |
| `bullets`      | `string[]`        | --                       | Optional bullet list (renders instead of or below body) |
| `rightContent` | `React.ReactNode` | required                 | Right panel content (3D scene, UI component, image)     |
| `accentColor`  | `string`          | `colors.coral` (#FF4F5E) | Color for AccentBar and bullet dots                     |
| `startFrame`   | `number`          | `0`                      | Frame offset                                            |

### Animation Behavior

- Left panel (45% width):
  - AccentBar + heading slide in from left (`springs.smooth`) + fade over 18f
  - Body text slides in from left, starts at frame 12, completes by frame 30
  - Bullets stagger at 8-frame intervals, each slides in over 15f
- Gradient divider: vertical 2px line with faded accent color
- Right panel (55% width): fades in + slides up 30px, starts at frame 20, completes by frame 40

### Scene Prompt Example

```
## Scene 3: AI-Powered Insights
- **Duration**: 6s (180f @ 30fps)
- **Layout**: SplitContent
- **Content**:
  - Heading: "AI-Powered Insights"
  - Bullets:
    - "Real-time campaign optimization"
    - "Predictive member behavior analytics"
    - "Automated offer personalization"
  - Right: <DeviceMockup3D type="laptop" screenContent="/screenshots/analytics.png" />
- **Effects**: AccentBar
```

---

## FullScreenUI

**File**: `remotion/components/layouts/FullScreenUI.tsx`
**Best for**: Showcasing real app screenshots or live UI components.

### Props

| Prop          | Type              | Default  | Description                                        |
| ------------- | ----------------- | -------- | -------------------------------------------------- |
| `children`    | `React.ReactNode` | required | The UI content to display                          |
| `deviceFrame` | `boolean`         | `false`  | Wraps content in a CSS laptop bezel                |
| `title`       | `string`          | --       | Small label in top-left corner (uppercase, dimmed) |
| `startFrame`  | `number`          | `0`      | Frame offset                                       |

### Animation Behavior

- Background: dark gradient (`gradients.dark`)
- Content: spring scale from 0.92 to 1.0 (`springs.smooth`) + Y translate 30px to 0 + fade over 15f
- Title label: fades in from frame 5 to 20
- Device frame mode: content at 85% width with charcoal bezel, camera dot, trackpad notch
- No-frame mode: content at 92% width/88% height with rounded corners and deep shadow

### Scene Prompt Example

```
## Scene 4: Dashboard Demo
- **Duration**: 5s (150f @ 30fps)
- **Layout**: FullScreenUI
- **Content**:
  - Title: "CAMPAIGN MANAGER"
  - Device frame: true
  - Children: <CampaignTable data={mockCampaigns} />
- **State**: Redux store pre-populated with campaign data
```

---

## StatHighlight

**File**: `remotion/components/layouts/StatHighlight.tsx`
**Best for**: KPI slides, metrics, platform impact numbers.

### Props

| Prop         | Type         | Default  | Description                             |
| ------------ | ------------ | -------- | --------------------------------------- |
| `stats`      | `StatItem[]` | required | Array of stat objects                   |
| `title`      | `string`     | --       | Optional GradientText title above stats |
| `startFrame` | `number`     | `0`      | Frame offset                            |

### StatItem Interface

```typescript
interface StatItem {
  value: number; // Target number for count-up
  label: string; // Uppercase label below number
  prefix?: string; // Before number (e.g., "$")
  suffix?: string; // After number (e.g., "%", "M+")
  decimals?: number; // Decimal places (default 0)
}
```

### Animation Behavior

- Background: dark gradient (`gradients.dark`)
- Title: GradientText, fades in + slides up 20px over 20f
- Stats: each staggers in with 12-frame offset, fades in + slides up 30px over 18f
- NumberTicker: spring-driven count-up from 0 to target value
- Divider lines: 1px white at 0.12 opacity, 80px tall, between stats

### Scene Prompt Example

```
## Scene 5: Platform Impact
- **Duration**: 5s (150f @ 30fps)
- **Layout**: StatHighlight
- **Content**:
  - Title: "By the Numbers"
  - Stats:
    - { value: 2.5, suffix: "M+", label: "ACTIVE MEMBERS", decimals: 1 }
    - { value: 98, suffix: "%", label: "RETENTION RATE" }
    - { value: 12, suffix: "x", label: "ROI IMPROVEMENT" }
- **Effects**: GradientText, NumberTicker
```

---

## FeatureGrid

**File**: `remotion/components/layouts/FeatureGrid.tsx`
**Best for**: Feature overviews, capability lists, product highlights.

### Props

| Prop         | Type        | Default  | Description                 |
| ------------ | ----------- | -------- | --------------------------- |
| `features`   | `Feature[]` | required | Array of feature objects    |
| `columns`    | `2 \| 3`    | `2`      | Grid column count           |
| `title`      | `string`    | --       | Optional GradientText title |
| `startFrame` | `number`    | `0`      | Frame offset                |

### Feature Interface

```typescript
interface Feature {
  title: string; // Card heading
  description: string; // Card body text
  icon?: React.ReactNode; // Optional icon/emoji above title
}
```

### Animation Behavior

- Background: black (`colors.black`)
- Title: GradientText, fades in + slides up 20px over 20f
- Cards: `GlassMorphCard` with 8-frame stagger (left-to-right, top-to-bottom)
- 2-column: 32px gap, 1200px max-width, 24px font for titles
- 3-column: 24px gap, 1600px max-width, 20px font for titles

### Scene Prompt Example

```
## Scene 3: Core Features
- **Duration**: 6s (180f @ 30fps)
- **Layout**: FeatureGrid
- **Content**:
  - Title: "Platform Capabilities"
  - Columns: 2
  - Features:
    - { title: "Campaign Engine", description: "Create, manage, and optimize loyalty campaigns with AI-powered suggestions." }
    - { title: "Offer Manager", description: "Design personalized offers that drive engagement and repeat visits." }
    - { title: "Analytics Suite", description: "Real-time dashboards with predictive insights and cohort analysis." }
    - { title: "Member Portal", description: "White-label member experiences across web and mobile." }
- **Effects**: GradientText, GlassMorphCard
```

---

## QuoteCallout

**File**: `remotion/components/layouts/QuoteCallout.tsx`
**Best for**: Testimonials, pull quotes, partner endorsements.

### Props

| Prop         | Type     | Default  | Description                               |
| ------------ | -------- | -------- | ----------------------------------------- |
| `quote`      | `string` | required | Quote text (rendered with TypewriterText) |
| `author`     | `string` | --       | Attribution name                          |
| `role`       | `string` | --       | Attribution role/company                  |
| `startFrame` | `number` | `0`      | Frame offset                              |

### Animation Behavior

- Background: black with Spotlight sweep (blue, 1000px diameter)
- Decorative left AccentBar (coral, 200px tall, 5px wide) at position left:120
- Decorative opening quotation mark: fades to 0.12 opacity, scales from 0.8 to 1.0, blue, 240px font
- Quote: TypewriterText at 0.8 chars/frame, 38px italic, starts at frame 10
- Author: fades in + slides up 15px after typewriter finishes (typewriter duration = text.length / 0.8 + 15 frames)
- Role: dimmed text below author

### Duration Calculation

Quote duration depends on text length: `ceil(text.length / 0.8) + 15 + 20` frames for the typewriter to finish plus author fade-in. Add 30-60 frames of breathing room.

### Scene Prompt Example

```
## Scene 6: Testimonial
- **Duration**: 7s (210f @ 30fps)
- **Layout**: QuoteCallout
- **Content**:
  - Quote: "Kigo transformed our loyalty program. Member engagement increased 3x in the first quarter."
  - Author: "Sarah Chen"
  - Role: "VP of Marketing, RetailCo"
- **Effects**: TypewriterText, Spotlight, AccentBar
```

---

## LogoCloud

**File**: `remotion/components/layouts/LogoCloud.tsx`
**Best for**: Partner showcases, client logos, integration ecosystems.

### Props

| Prop         | Type         | Default  | Description                 |
| ------------ | ------------ | -------- | --------------------------- |
| `logos`      | `LogoItem[]` | required | Array of logo objects       |
| `title`      | `string`     | --       | Optional GradientText title |
| `startFrame` | `number`     | `0`      | Frame offset                |

### LogoItem Interface

```typescript
interface LogoItem {
  src: string; // Image URL or path (use staticFile() for public/ assets)
  alt: string; // Alt text
}
```

### Animation Behavior

- Background: black (`colors.black`)
- Title: GradientText, fades in + slides up 20px over 20f
- Logos: 8-frame stagger, each fades in + scales from 0.7 to 1.0 over 18f
- Grayscale-to-color transition: starts at frame 10 per logo, completes by frame 35
- Logo sizing: 60px height, auto width, max 180px, centered flex-wrap row with 56px gap
- Uses Remotion `<Img>` component (not HTML `<img>`)

### Scene Prompt Example

```
## Scene 7: Trusted By
- **Duration**: 3s (90f @ 30fps)
- **Layout**: LogoCloud
- **Content**:
  - Title: "Trusted By Industry Leaders"
  - Logos:
    - { src: staticFile("logos/partner-1.svg"), alt: "Partner 1" }
    - { src: staticFile("logos/partner-2.svg"), alt: "Partner 2" }
    - { src: staticFile("logos/partner-3.svg"), alt: "Partner 3" }
- **Effects**: GradientText
```

---

## ClosingCTA

**File**: `remotion/components/layouts/ClosingCTA.tsx`
**Best for**: Final slides, calls to action, brand sign-offs.

### Props

| Prop         | Type     | Default  | Description                                                    |
| ------------ | -------- | -------- | -------------------------------------------------------------- |
| `logoSrc`    | `string` | --       | Optional logo image (URL or path)                              |
| `ctaText`    | `string` | required | Main CTA text, rendered with GradientText inside ShimmerBorder |
| `subtitle`   | `string` | --       | Subtitle below CTA                                             |
| `startFrame` | `number` | `0`      | Frame offset                                                   |

### Animation Behavior

- Background: animated gradient (angle rotates from 135 to 225 degrees over 300f), blue/purple tints on black
- ParticleField: purple, 50 particles, 0.5x speed
- Logo: fades in + scales from 0.8 to 1.0 over 25f
- CTA: `springs.bouncy` scale from 0.85 to 1.0, starts at frame 15, wrapped in ShimmerBorder (2px border, 20px radius)
- Subtitle: fades in + slides up 15px, starts at frame 35

### Scene Prompt Example

```
## Scene 8: Closing
- **Duration**: 3s (90f @ 30fps)
- **Layout**: ClosingCTA
- **Content**:
  - Logo: staticFile("kigo-logo-white.svg")
  - CTA: "Get Started Today"
  - Subtitle: "kigo.io/demo"
- **Effects**: GradientText, ShimmerBorder, ParticleField
```
