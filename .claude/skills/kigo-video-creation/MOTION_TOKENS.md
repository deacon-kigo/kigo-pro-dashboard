# Motion Design Tokens

Standardized motion values used across all Remotion compositions. Import from `remotion/lib/motion-tokens.ts`.

```typescript
import { MOTION } from "../../lib/motion-tokens";
```

## Duration Tiers

All durations in frames at 30fps.

| Token                      | Frames | Seconds | Use For                              |
| -------------------------- | ------ | ------- | ------------------------------------ |
| `MOTION.duration.micro`    | 4      | 0.13s   | Instant feedback, icon swaps         |
| `MOTION.duration.fast`     | 8      | 0.27s   | UI-style snappy transitions          |
| `MOTION.duration.base`     | 12     | 0.40s   | Standard transition (default choice) |
| `MOTION.duration.slow`     | 20     | 0.67s   | Deliberate, noticeable movement      |
| `MOTION.duration.dramatic` | 30     | 1.00s   | Hero moments, scene transitions      |
| `MOTION.duration.breathe`  | 45     | 1.50s   | Holds, breathing room between action |

### Usage

```typescript
// Fade in over standard duration
const opacity = interpolate(frame, [0, MOTION.duration.base], [0, 1], {
  easing: MOTION.easing.enter,
  extrapolateRight: "clamp",
});

// Hero entrance with dramatic timing
const scale = interpolate(frame, [0, MOTION.duration.dramatic], [0.85, 1], {
  easing: MOTION.easing.emphasis,
  extrapolateRight: "clamp",
});
```

## Easing Curves

All easing functions for use with `interpolate()`.

| Token                    | Behavior             | Use For                         |
| ------------------------ | -------------------- | ------------------------------- |
| `MOTION.easing.enter`    | Cubic deceleration   | Elements entering the frame     |
| `MOTION.easing.exit`     | Cubic acceleration   | Elements leaving the frame      |
| `MOTION.easing.emphasis` | Back overshoot (1.4) | Attention-grabbing entrances    |
| `MOTION.easing.smooth`   | Cubic ease-in-out    | Position changes, repositioning |
| `MOTION.easing.elastic`  | Elastic bounce       | Playful, energetic animations   |

### Usage

```typescript
const translateY = interpolate(frame, [0, MOTION.duration.base], [40, 0], {
  easing: MOTION.easing.enter,
  extrapolateRight: "clamp",
});
```

## Spring Configs

For use with Remotion's `spring()` function.

| Token                  | Damping | Stiffness | Mass | Character           |
| ---------------------- | ------- | --------- | ---- | ------------------- |
| `MOTION.spring.gentle` | 15      | 100       | 1.0  | Smooth, relaxed     |
| `MOTION.spring.snappy` | 20      | 200       | 0.8  | Quick, responsive   |
| `MOTION.spring.bouncy` | 10      | 150       | 1.0  | Energetic overshoot |
| `MOTION.spring.heavy`  | 25      | 80        | 1.5  | Weighty, deliberate |

### Usage

```typescript
const progress = spring({
  frame,
  fps: 30,
  config: MOTION.spring.snappy,
});
```

### Preset Helpers

```typescript
import {
  getSpringForPreset,
  getStaggerForPreset,
} from "../../lib/motion-tokens";

// Use with globalStyle.motionPreset from manifest
const springConfig = getSpringForPreset("dramatic"); // → MOTION.spring.heavy
const staggerDelay = getStaggerForPreset("dramatic"); // → 12 frames
```

## Stagger Presets

Delay in frames between sequential element animations.

| Token                     | Frames | Seconds | Use For                                |
| ------------------------- | ------ | ------- | -------------------------------------- |
| `MOTION.stagger.tight`    | 3      | 0.10s   | Rapid-fire list items, particle bursts |
| `MOTION.stagger.normal`   | 5      | 0.17s   | Standard stagger (default)             |
| `MOTION.stagger.loose`    | 8      | 0.27s   | Deliberate sequence, feature cards     |
| `MOTION.stagger.dramatic` | 12     | 0.40s   | One-by-one reveal, hero elements       |

### Usage

```typescript
// Stagger 4 cards
{cards.map((card, i) => (
  <Sequence key={i} from={baseDelay + i * MOTION.stagger.normal}>
    <Card {...card} />
  </Sequence>
))}
```

## Relationship to brand.ts

`motion-tokens.ts` complements `brand.ts`:

- **brand.ts** — Visual identity (colors, gradients, scene durations, spring presets)
- **motion-tokens.ts** — Animation behavior (easing curves, stagger timing, duration tiers)

Both should be imported in compositions. brand.ts defines WHAT things look like; motion-tokens.ts defines HOW things move.
