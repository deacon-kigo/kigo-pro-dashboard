# /video-manifest — Stage 3: Technical Manifest

Transform a scene script into a structured VideoManifest JSON and scaffold a Remotion composition.

## Input

The user provides a script name: "$ARGUMENTS"

If arguments provided, read the script from `tmp/videos/{name}-script.md`.
If no script file found, ask: "Which script should I use? Provide the name or path."

## Process

### Step 1: Read Script

Read the script file and extract all scene details including layouts, durations, content, effects, transitions, and real UI references.

### Step 2: Map Scenes to Components

For each scene:

1. Map the layout name to its import path (`remotion/components/layouts/{Name}`)
2. Map each effect to its import from `remotion/components/fx`
3. If using real UI, verify the component file exists at the specified path
4. If using 3D, map to `remotion/components/three` imports
5. Calculate exact `startFrame` for each scene (cumulative sum of previous durations)

### Step 3: Validate Frame Math

Verify:

- Each scene's `startFrame` = previous scene's `startFrame + durationFrames`
- Sum of all scene `durationFrames` = total `durationFrames`
- Transition overlap frames are accounted for (if using TransitionSeries, transitions overlap)

### Step 4: Select Motion Preset

Based on the brief's tone:

- Professional/enterprise → `"gentle"`
- Energetic/startup → `"snappy"`
- Elegant/premium → `"dramatic"`
- Playful/approachable → `"snappy"`

### Step 5: Generate Manifest JSON

Create `tmp/videos/{name}-manifest.json` following the VideoManifest schema from MANIFEST.md.

### Step 6: Scaffold Composition

Create `remotion/compositions/{PascalCaseName}.tsx` with:

1. All necessary imports (layouts, fx, three, motion-tokens, brand)
2. A `<Sequence>` for each scene at the correct `from` offset
3. Placeholder comments inside each scene: `{/* TODO: Build scene — {description} */}`
4. If any scene uses realUI, import StoreProvider

The scaffold should **compile without errors** — all imports must resolve to real files.

### Step 7: Register in Root.tsx

Add the new composition to `remotion/Root.tsx`:

- Import the composition component
- Add a `<Composition>` entry with the correct id, duration, fps, and dimensions
- If using real UI, wrap in StoreProvider (check if Root.tsx already wraps globally)

## Output: Manifest JSON Structure

```json
{
  "id": "{kebab-case-name}",
  "title": "{Human Title}",
  "durationFrames": 900,
  "fps": 30,
  "resolution": { "width": 1920, "height": 1080 },
  "scenes": [
    {
      "id": "hero-intro",
      "template": "HeroTitle",
      "startFrame": 0,
      "durationFrames": 120,
      "energy": "low",
      "props": {
        "title": "...",
        "subtitle": "...",
        "backgroundEffect": "grid"
      },
      "effects": ["GradientText", "GridPattern"],
      "transition": {
        "type": "fade",
        "durationFrames": 15
      }
    }
  ],
  "globalStyle": {
    "motionPreset": "snappy"
  }
}
```

## Output: Scaffold Composition

The generated `.tsx` file should follow this pattern:

```tsx
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { MOTION } from "../../lib/motion-tokens";
import { colors, gradients } from "../../lib/brand";
// ... layout imports
// ... fx imports (if used)
// ... three imports (if used)

export const {
  ComponentName,
}: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      {/* Scene 1: {Title} — {Layout} ({duration}s) */}
      <Sequence from={0} durationInFrames={120}>
        {/* TODO: Build scene — {description from script} */}
      </Sequence>

      {/* Scene 2: {Title} — {Layout} ({duration}s) */}
      <Sequence from={120} durationInFrames={150}>
        {/* TODO: Build scene — {description from script} */}
      </Sequence>

      {/* ... remaining scenes */}
    </AbsoluteFill>
  );
};
```

## Quality Gate

Before finishing, verify:

- [ ] Every scene maps to a real layout component (file exists)
- [ ] Real UI component paths verified (files exist)
- [ ] Frame math adds up (scene starts + durations = total)
- [ ] Manifest JSON is valid (parseable)
- [ ] Composition scaffold has no import errors (all referenced files exist)
- [ ] Composition is registered in Root.tsx
- [ ] Motion preset matches the tone from the brief

If any gate fails, fix it before completing.

## Completion

Tell the user:

```
Manifest complete!
- Manifest: tmp/videos/{name}-manifest.json
- Scaffold: remotion/compositions/{Name}.tsx
- Registered in Root.tsx

Ready for Stage 4: iterative build.
Start Remotion Studio with `npm run video:dev` and begin building scenes one at a time.
The kigo-video-creation skill docs (WORKFLOW.md, MOTION_TOKENS.md, EFFECTS.md, LAYOUTS.md) will guide the build phase.
```
