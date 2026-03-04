# /video-pipeline — Master Orchestrator

Run the complete video production pipeline from idea to scaffold.

This command orchestrates Stages 1–3 sequentially. Stage 4 (iterative build) is done through normal conversation after this command completes.

## Input

The user provides a video idea: "$ARGUMENTS"

If no arguments provided, ask: "What video would you like to create? Describe the idea in a sentence or two."

## Pipeline Overview

```
Stage 1: Brief    →  Stage 2: Script    →  Stage 3: Manifest
(~2 min)             (~5 min)               (~5 min)
Interview            Scene-by-scene         Technical manifest
5 questions          Energy map             + composition scaffold
```

## Execution

### Stage 1: Creative Brief

Run the `/video-brief` workflow inline:

1. Conduct the 5-question interview (audience, key message, tone, duration, music)
2. Search for relevant real UI components in `components/features/`
3. Generate `tmp/videos/{name}-brief.md`
4. Verify quality gate (audience defined, message clear, duration locked, ≥2 UI screens)

Tell the user: "Stage 1 complete — brief saved. Moving to Stage 2: Script."

### Stage 2: Scene Script

Run the `/video-script` workflow inline using the brief from Stage 1:

1. Apply three-act structure (20% setup / 60% development / 20% resolution)
2. Break into scenes with layout assignments
3. Create energy map, validate call-and-response
4. Generate `tmp/videos/{name}-script.md`
5. Verify quality gate (structure, energy flow, layouts, duration match)

Present the energy map table to the user for review before proceeding. Ask: "Does this scene structure look right? Any adjustments before I generate the technical manifest?"

Wait for approval or adjustments. If adjustments requested, revise the script.

### Stage 3: Technical Manifest

Run the `/video-manifest` workflow inline using the script from Stage 2:

1. Map scenes to component imports
2. Validate all file paths exist
3. Calculate frame math
4. Generate `tmp/videos/{name}-manifest.json`
5. Scaffold `remotion/compositions/{Name}.tsx`
6. Register in `remotion/Root.tsx`
7. Verify quality gate (imports resolve, frame math correct, registered)

## Completion

Summarize everything produced:

```
Video pipeline complete for "{Title}"!

Artifacts:
  1. Brief:    tmp/videos/{name}-brief.md
  2. Script:   tmp/videos/{name}-script.md
  3. Manifest: tmp/videos/{name}-manifest.json
  4. Scaffold: remotion/compositions/{Name}.tsx (registered in Root.tsx)

Next steps:
  1. Start Remotion Studio: npm run video:dev
  2. Select the "{Name}" composition
  3. Build scenes one at a time — start with Scene 1
  4. For each scene, I'll implement it and you give micro-feedback
  5. After all scenes: wire transitions, full playthrough, render

Ready to start building? Say "build scene 1" to begin.
```

## Error Handling

- If a stage's quality gate fails, fix it before proceeding to the next stage
- If the user wants to skip a stage (e.g., already has a brief), allow jumping to the appropriate stage
- If real UI components can't be found, suggest alternatives or note it as a constraint
