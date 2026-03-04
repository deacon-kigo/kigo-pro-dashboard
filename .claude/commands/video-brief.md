# /video-brief — Stage 1: Creative Brief

Generate a creative brief for a Remotion video through a structured interview.

## Input

The user provides a high-level idea: "$ARGUMENTS"

If no arguments provided, ask: "What video would you like to create?"

## Process

### Step 1: Interview (5 Questions)

Ask these questions one at a time using AskUserQuestion. Wait for each answer before proceeding.

1. **Audience** — "Who is the target viewer?"
   - Options: Internal stakeholders, Prospects/sales demos, Partners, Developers

2. **Key message** — "What's the ONE thing the viewer should take away?"
   - Free text (no predefined options — let them type)

3. **Tone** — "What feeling should the video evoke?"
   - Options: Professional/enterprise, Energetic/startup, Elegant/premium, Playful/approachable

4. **Duration** — "Target length?"
   - Options: 15s social teaser, 30s overview, 60s feature deep-dive, 90s full demo

5. **Music/audio** — "Any music preference?"
   - Options: No music, Upbeat corporate, Ambient/cinematic, I'll provide my own track

### Step 2: Feature Discovery

Based on the user's idea, search for relevant real UI components:

- Search `components/features/` for the mentioned feature area
- Search `components/` more broadly if needed
- List each discovered component with its file path

Determine if 3D elements would add value based on the tone and duration.

### Step 3: Generate Brief

Create `tmp/videos/{name}-brief.md` where `{name}` is a kebab-case identifier derived from the idea.

First, ensure the directory exists: `mkdir -p tmp/videos`

## Output Format

Write the brief file with this exact structure:

```markdown
# Video Brief: {Title}

## Audience

{audience answer}

## Key Message

{key message answer}

## Tone

{tone answer}

## Duration

{X}s ({N}f @ 30fps)

## Music

{music preference}

## Real UI Screens Available

- `{ComponentName}` — {description} (`{file path}`)
- ...

## Recommended 3D Elements

- {element} — {why it fits the tone}
- ...
  (or "None recommended" if 2D is sufficient)

## Constraints/Notes

- {any special considerations from the interview}
```

## Quality Gate

Before finishing, verify:

- [ ] Audience is defined
- [ ] Single key message is articulated
- [ ] Duration is locked (with frame count)
- [ ] At least 2 real UI screens are identified

If any gate fails, address it before completing.

## Completion

Tell the user: "Brief complete! Saved to `tmp/videos/{name}-brief.md`. Run `/video-script {name}` to continue to Stage 2."
