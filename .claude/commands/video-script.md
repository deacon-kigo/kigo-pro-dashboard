# /video-script — Stage 2: Scene Script

Transform a creative brief into a scene-by-scene script with energy mapping.

## Input

The user provides a brief name: "$ARGUMENTS"

If arguments provided, read the brief from `tmp/videos/{name}-brief.md`.
If no brief file found, ask: "Which brief should I use? Provide the name or path."

## Process

### Step 1: Read Brief

Read the brief file and extract:

- Target duration (frames and seconds)
- Audience and tone
- Available real UI screens
- Key message
- Music preference

### Step 2: Apply Three-Act Structure

Divide the total duration:

- **Setup** (20%): Establish context, brand, mood — typically 1–2 scenes
- **Development** (60%): Key content, features, action — typically 3–5 scenes
- **Resolution** (20%): Conclusion, CTA — typically 1–2 scenes

### Step 3: Plan Scenes

For each scene, determine:

1. **Layout template** from available options (HeroTitle, SplitContent, FullScreenUI, StatHighlight, FeatureGrid, QuoteCallout, LogoCloud, ClosingCTA)
2. **Duration** following the guidelines in SCENE_PROMPT.md
3. **Energy level** (low / medium / high / peak)
4. **Content** (exact text, stats, UI component)
5. **Effects** to layer
6. **Transition** to next scene

### Step 4: Validate Energy Map

Apply the call-and-response rule:

- **Never stack two high-energy or peak scenes back-to-back**
- After a high/peak scene, follow with medium or low
- Build energy gradually through the Development act
- Resolution should descend from the Development peak

If the energy map violates these rules, reorder or adjust scene energy.

### Step 5: Validate Directional Momentum

Plan how each scene exits and the next enters:

- Consistent transition language (if fading, fade throughout)
- If content exits right, next scene enters from left

### Step 6: Generate Script

Create `tmp/videos/{name}-script.md`.

## Output Format

```markdown
# Video Script: {Title}

## Total Duration

{X}s ({N}f @ 30fps)

## Act Structure

- **Setup** (scenes 1–{n}): {description}
- **Development** (scenes {n}–{m}): {description}
- **Resolution** (scenes {m}–{last}): {description}

## Energy Map

| Scene | Title   | Duration    | Energy | Layout       | Transition |
| ----- | ------- | ----------- | ------ | ------------ | ---------- |
| 1     | {title} | {X}s ({N}f) | low    | HeroTitle    | fade       |
| 2     | {title} | {X}s ({N}f) | medium | SplitContent | slide      |
| ...   | ...     | ...         | ...    | ...          | ...        |

## Scene Details

### Scene 1: {Title}

- **Duration**: {X}s ({N}f @ 30fps)
- **Layout**: {LayoutName}
- **Background**: {color/gradient/effect}
- **Energy**: {low|medium|high|peak}
- **Timing**:
  - 0.0s (0f) — {first element}
  - 0.5s (15f) — {second element}
  - ...
- **Content**:
  - Heading: "{exact text}"
  - Body: "{exact text}"
  - {other elements}
- **Effects**: {list of fx components}
- **Real UI**: {component path, or "none"}
- **State**: {Redux state needed, or "none"}
- **Assets**: {images, logos, or "none"}
- **Transition**: {type} to next scene ({N}f overlap)

### Scene 2: {Title}

...
```

## Quality Gate

Before finishing, verify:

- [ ] Three-act structure applied with correct proportions (20/60/20 ±5%)
- [ ] No two consecutive high-energy or peak scenes
- [ ] Every scene has a layout template assigned
- [ ] Total scene durations sum to target (±10%)
- [ ] At least one scene uses a real UI component
- [ ] All scene text is written (no placeholders)
- [ ] Transitions specified between every scene pair

If any gate fails, fix it before completing.

## Completion

Tell the user: "Script complete! Saved to `tmp/videos/{name}-script.md`. Run `/video-manifest {name}` to continue to Stage 3."
