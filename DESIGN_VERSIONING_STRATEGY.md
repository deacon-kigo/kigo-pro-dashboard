# Kigo Pro Design System - Design Versioning & Embedded Apps Strategy

**Research Report & Implementation Recommendations**

---

## Executive Summary

After deep research into Storybook advanced patterns, design versioning tools, and code-based design workflows for 2025, here's a comprehensive strategy for managing V1 designs, future visions, and AI-generated designs in the Kigo Pro Design System.

### The Challenge

You need to:

1. ✅ Build component stories for Kigo Pro services
2. ✅ Embed full design environments (entire app routes) in Storybook
3. ✅ Manage V1 vs Future Vision designs
4. ✅ Track AI-generated / prompt-based designs
5. ✅ Version control different design iterations
6. ✅ Link components to live running apps

---

## 🎯 Recommended Solution: Multi-Strategy Approach

### **Strategy 1: Embedded App Routes in Storybook**

**Use Case**: Show full dashboard pages, campaigns, offer-manager UI

### **Strategy 2: Design Versions with Branches + Tags**

**Use Case**: Manage V1 vs V2 vs Future Vision

### **Strategy 3: AI-Generated Design Tracking**

**Use Case**: Track prompt-based designs, iterations

### **Strategy 4: Chromatic for Visual Version Control**

**Use Case**: Visual regression testing, design review

---

## 📦 Solution 1: Embedded Apps in Storybook

### **Problem You're Solving**

- Kigo Pro Dashboard has **54 routes** (dashboard, campaigns, offer-manager, merchants, etc.)
- Each route is a complete design environment
- Need to showcase these in Storybook without re-implementing as components

### **Solution: Storybook Iframe Addon**

**How It Works:**

1. Install `@geometricpanda/storybook-addon-iframe`
2. Create stories that embed your Next.js app routes
3. Click on a "component" in Storybook → it loads the full app page

**Implementation:**

```bash
# Install addon
pnpm add -D @geometricpanda/storybook-addon-iframe
```

**Configure:** `.storybook/main.ts`

```typescript
export default {
  addons: [
    "@geometricpanda/storybook-addon-iframe",
    // ... other addons
  ],
};
```

**Create Story:** `.storybook/stories/FullApps.stories.tsx`

```typescript
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Kigo Pro/Full Apps/Offer Manager",
  parameters: {
    layout: "fullscreen",
    iframe: {
      url: "http://localhost:3000/offer-manager",
      height: "800px",
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OfferManagerV1: Story = {
  parameters: {
    iframe: {
      url: "http://localhost:3000/offer-manager",
    },
  },
};

export const OfferManagerFutureVision: Story = {
  parameters: {
    iframe: {
      url: "http://localhost:3000/offer-manager?version=v2",
    },
  },
};

export const CampaignsDashboard: Story = {
  parameters: {
    iframe: {
      url: "http://localhost:3000/campaigns",
    },
  },
};
```

**Benefits:**

- ✅ No code duplication
- ✅ Shows real app with real data
- ✅ Can switch between versions with URL params
- ✅ Easy to maintain (just update app, Storybook shows it)

**Limitations:**

- ⚠️ Requires Pro Dashboard to be running (localhost:3000)
- ⚠️ Can't use in production Storybook (unless Pro Dashboard is deployed)

---

## 🏷️ Solution 2: Design Version Management

### **Problem You're Solving**

- Need to maintain V1 (current production)
- Need to develop V2 (next iteration)
- Need to explore Future Vision (aspirational)
- Need to track AI-generated variations

### **Solution: Git Branches + Storybook Versions Addon**

### **Approach A: Git Branches for Major Versions**

**Branch Strategy:**

```
main                    → Production V1
├── design/v2          → Next version in development
├── design/future      → Future vision explorations
└── design/ai-*        → AI-generated variations
    ├── design/ai-2024-10-20-offer-flow
    └── design/ai-2024-10-22-campaign-wizard
```

**Workflow:**

1. **V1 (main)**: Current production code
2. **V2 (design/v2)**: Next release features
3. **Future Vision (design/future)**: Long-term explorations
4. **AI Experiments (design/ai-\*)**: Prompt-based designs

### **Approach B: Component-Level Versioning**

**File Structure:**

```
components/features/offer-manager/
├── v1/
│   ├── OfferManagerDashboard.tsx
│   └── OfferCreationForm.tsx
├── v2/
│   ├── OfferManagerDashboard.tsx
│   └── OfferCreationForm.tsx
└── future/
    ├── OfferManagerDashboardAI.tsx
    └── OfferCreationFormVoice.tsx
```

**Storybook Organization:**

```
Kigo Pro/
├── V1 (Production)/
│   ├── Offer Manager
│   ├── Campaigns
│   └── Dashboard
├── V2 (Development)/
│   ├── Offer Manager
│   └── Campaigns
└── Future Vision/
    ├── AI Voice Offers
    └── Predictive Campaigns
```

### **Approach C: Storybook Versions Addon**

**Install:**

```bash
pnpm add -D sb-addon-versions
```

**Configure:** `.storybook/main.ts`

```typescript
export default {
  addons: ["sb-addon-versions"],
};
```

**Create:** `versions.json`

```json
{
  "versions": [
    {
      "label": "V1 Production",
      "path": "/v1/",
      "default": true
    },
    {
      "label": "V2 Development",
      "path": "/v2/"
    },
    {
      "label": "Future Vision",
      "path": "/future/"
    }
  ]
}
```

**Benefits:**

- ✅ Users can switch between versions in UI
- ✅ Each version is a separate Storybook build
- ✅ Clear separation of concerns
- ✅ Can deploy multiple versions simultaneously

---

## 🤖 Solution 3: AI-Generated Design Tracking

### **Problem You're Solving**

- Using prompts to generate designs programmatically
- Hard to track which prompts created which designs
- Need version control for AI iterations

### **Solution: Prompt Metadata + Git Tags**

### **A. Prompt Documentation in Stories**

**Story with Prompt Metadata:**

```typescript
export const AIGeneratedOfferFlow: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## AI Generation Details

**Date**: October 22, 2025
**Prompt**: "Create a multi-step offer creation flow with progress tracker,
inline validation, and AI-powered recommendations"

**Model**: Claude 3.7 Sonnet
**Iterations**: 3
**Final Refinement**: Manual styling adjustments

**Version Control**:
- Commit: a1b2c3d
- Branch: design/ai-offer-flow-v2
- Tag: ai-design-2025-10-22-001
        `,
      },
    },
    aiGeneration: {
      prompt: "Create a multi-step offer creation flow...",
      model: "claude-3.7-sonnet",
      date: "2025-10-22",
      iterations: 3,
      tag: "ai-design-2025-10-22-001",
    },
  },
  render: () => <AIGeneratedOfferFlow />,
};
```

### **B. Git Tags for AI Iterations**

**Tagging Strategy:**

```bash
# After AI generates a design
git tag -a ai-design-2025-10-22-001 -m "AI: Offer flow with progress tracker"
git tag -a ai-design-2025-10-22-002 -m "AI: Campaign wizard with recommendations"

# List all AI-generated designs
git tag -l "ai-design-*"
```

### **C. AI Design Log File**

**Create:** `documentation/ai-design-log.md`

```markdown
# AI-Generated Design Log

## 2025-10-22 - Offer Manager Flow Redesign

**Prompt:**

> Create a multi-step offer creation flow with progress tracker, inline validation,
> and AI-powered recommendations. Use Kigo brand colors and ensure mobile responsiveness.

**Result:**

- Created: `components/features/offer-manager/v2/OfferCreationWizard.tsx`
- Commit: `a1b2c3d`
- Tag: `ai-design-2025-10-22-001`
- Story: `Kigo Pro/V2/Offer Manager/Creation Wizard`

**Refinements Needed:**

- [x] Adjusted spacing for mobile
- [x] Changed primary button color
- [ ] Add keyboard shortcuts

**Comparison:** [View Diff](link-to-diff)

---

## 2025-10-20 - Campaign Analytics Dashboard

**Prompt:**

> Design a campaign analytics dashboard with real-time metrics, charts, and filterable views
> ...
```

### **D. Code-Based Design Tools Integration**

**Recommended Tools for 2025:**

1. **Builder.io (Visual Copilot)**

   - Figma → Storybook
   - AI-powered code generation
   - Supports React, Vue, Tailwind
   - Has Storybook integration

2. **story.to.design**

   - Storybook → Figma sync
   - Notifies designers when code changes
   - One-click updates

3. **Anima**
   - Figma/XD → Code
   - Multi-framework support
   - Clean, production-ready code

**Workflow:**

```
Design Prompt
  ↓
AI Generates Design (Claude/GPT)
  ↓
Code in Pro Dashboard
  ↓
Create Storybook Story
  ↓
Sync to Figma (story.to.design)
  ↓
Designer Reviews & Refines
  ↓
Export from Figma (Builder.io)
  ↓
Update Code
  ↓
Commit with AI metadata
```

---

## 🎨 Solution 4: Chromatic for Visual Version Control

### **Problem You're Solving**

- Need to visually compare V1 vs V2 vs Future designs
- Need to catch visual regressions
- Need design review workflow
- Need to track design changes across branches

### **Solution: Chromatic Integration**

**What Chromatic Does:**

1. Visual regression testing (screenshot every story)
2. Branch comparison (compare feature branches to main)
3. Design review workflow (approve/reject changes)
4. Version tracking (go back to any commit)

**Setup:**

```bash
# Install Chromatic
pnpm add -D chromatic

# Add to package.json
{
  "scripts": {
    "chromatic": "chromatic --project-token=<your-token>"
  }
}
```

**Workflow:**

```bash
# On feature branch (design/v2)
git checkout -b design/v2-offer-manager
# ... make changes ...
git commit -m "V2: New offer manager design"

# Run Chromatic
pnpm chromatic

# Chromatic automatically:
# - Takes screenshots of all stories
# - Compares to main branch
# - Shows visual diffs
# - Creates review link
```

**Benefits:**

- ✅ Visual diff between V1 and V2
- ✅ Catch unintended changes
- ✅ Share designs with stakeholders
- ✅ Track design evolution over time
- ✅ Automatic baseline management per branch

**Chromatic Dashboard:**

```
Main Branch (V1)
├─ Offer Manager Dashboard: ✅ Baseline
├─ Campaign Creation: ✅ Baseline
└─ Merchant Dashboard: ✅ Baseline

Feature Branch (design/v2)
├─ Offer Manager Dashboard: ⚠️ 23 changes detected
├─ Campaign Creation: ✅ No changes
└─ Merchant Dashboard: ⚠️ 5 changes detected
```

---

## 🏗️ Recommended Architecture

### **Folder Structure**

```
kigo-pro-dashboard/
├── app/                         # Next.js routes (54 pages)
│   ├── offer-manager/
│   ├── campaigns/
│   └── dashboard/
│
├── components/
│   ├── atoms/                   # Shared across versions
│   ├── molecules/
│   ├── organisms/
│   └── features/
│       ├── offer-manager/
│       │   ├── v1/             # Production
│       │   ├── v2/             # Next version
│       │   └── future/         # Future vision
│       ├── campaigns/
│       │   ├── v1/
│       │   └── v2/
│       └── dashboard/
│           └── v1/
│
├── .storybook/
│   ├── main.ts                 # Addon config
│   └── stories/
│       ├── FullApps/           # Embedded app routes
│       │   ├── V1-Production.stories.tsx
│       │   ├── V2-Development.stories.tsx
│       │   └── FutureVision.stories.tsx
│       └── Components/
│           ├── V1/
│           ├── V2/
│           └── Future/
│
├── documentation/
│   ├── ai-design-log.md        # AI generation tracking
│   ├── design-decisions.md     # Manual design notes
│   └── version-comparison.md   # V1 vs V2 analysis
│
└── versions.json               # Version switcher config
```

---

## 📋 Implementation Plan

### **Phase 1: Setup (Week 1)**

**1.1 Install Addons**

```bash
pnpm add -D @geometricpanda/storybook-addon-iframe
pnpm add -D sb-addon-versions
pnpm add -D chromatic
```

**1.2 Configure Storybook**

- Add iframe addon to `.storybook/main.ts`
- Add versions addon
- Create `versions.json`

**1.3 Create Branch Strategy**

```bash
git checkout -b design/v2
git checkout -b design/future
```

---

### **Phase 2: Embed Full Apps (Week 2)**

**2.1 Create Full App Stories**

- Create `.storybook/stories/FullApps/`
- Create stories for all 54 routes
- Organize by feature (Offer Manager, Campaigns, Dashboard)

**2.2 Version Separation**

```typescript
// V1 Production
export const OfferManagerV1: Story = {
  parameters: {
    iframe: { url: "http://localhost:3000/offer-manager" },
  },
};

// V2 Development
export const OfferManagerV2: Story = {
  parameters: {
    iframe: { url: "http://localhost:3000/offer-manager?version=v2" },
  },
};

// Future Vision
export const OfferManagerFuture: Story = {
  parameters: {
    iframe: { url: "http://localhost:3000/offer-manager?version=future" },
  },
};
```

**2.3 Add Version Query Param Handling**

```typescript
// app/offer-manager/page.tsx
export default function OfferManagerPage({ searchParams }) {
  const version = searchParams.version || 'v1';

  switch(version) {
    case 'v2':
      return <OfferManagerV2 />;
    case 'future':
      return <OfferManagerFuture />;
    default:
      return <OfferManagerV1 />;
  }
}
```

---

### **Phase 3: Component Versioning (Week 3)**

**3.1 Restructure Components**

- Move V1 components to `v1/` folders
- Create `v2/` folders for new designs
- Create `future/` for explorations

**3.2 Create Version Stories**

```
Kigo Pro/
├── V1 Production/
│   ├── Inputs/
│   ├── Layout/
│   └── Features/
├── V2 Development/
│   ├── Inputs/
│   └── Features/
└── Future Vision/
    └── Features/
```

---

### **Phase 4: AI Design Tracking (Week 4)**

**4.1 Create AI Design Log**

- Document: `documentation/ai-design-log.md`
- Template for each AI generation
- Git tagging strategy

**4.2 Story Metadata**

- Add `aiGeneration` parameters to stories
- Document prompts, models, iterations
- Link to commits and tags

**4.3 Git Tagging**

```bash
git tag -a ai-design-YYYY-MM-DD-NNN -m "Description"
```

---

### **Phase 5: Chromatic Integration (Week 5)**

**5.1 Setup Chromatic**

- Create Chromatic account
- Link GitHub repo
- Add to CI/CD

**5.2 CI Integration**

```yaml
# .github/workflows/chromatic.yml
name: Chromatic
on: push
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm chromatic --project-token=${{ secrets.CHROMATIC_TOKEN }}
```

**5.3 Branch Baselines**

- Set baselines for `main` (V1)
- Set baselines for `design/v2`
- Set baselines for `design/future`

---

## 🎯 Usage Workflows

### **Workflow 1: Creating V2 Design**

```bash
# 1. Create branch
git checkout -b design/v2-offer-flow

# 2. Create new component version
mkdir components/features/offer-manager/v2
cp -r components/features/offer-manager/v1/* components/features/offer-manager/v2/

# 3. Make changes to V2

# 4. Create Storybook story
# .storybook/stories/V2/OfferManager.stories.tsx

# 5. Run Chromatic
pnpm chromatic

# 6. Review visual diffs
# Open Chromatic link, compare V1 vs V2

# 7. Commit with metadata
git commit -m "V2: New offer flow design

- Multi-step wizard
- Inline validation
- AI recommendations

Version: V2
Component: OfferCreationWizard
"

# 8. Tag if significant
git tag -a v2-offer-flow-2025-10-22 -m "V2: Offer flow redesign"
```

---

### **Workflow 2: AI-Generated Design**

```bash
# 1. Generate with AI
# Use Claude/GPT: "Create a campaign analytics dashboard with..."

# 2. Create branch
git checkout -b design/ai-campaign-analytics

# 3. Implement generated code

# 4. Document in AI log
echo "## 2025-10-22 - Campaign Analytics

Prompt: Create a campaign analytics dashboard...
Result: components/features/campaigns/v2/AnalyticsDashboard.tsx
" >> documentation/ai-design-log.md

# 5. Create story with metadata
export const AIGeneratedAnalytics: Story = {
  parameters: {
    aiGeneration: {
      prompt: "...",
      model: "claude-3.7-sonnet",
      date: "2025-10-22",
    },
  },
};

# 6. Commit and tag
git commit -m "AI: Campaign analytics dashboard"
git tag -a ai-design-2025-10-22-001 -m "AI: Campaign analytics"

# 7. Run Chromatic
pnpm chromatic
```

---

### **Workflow 3: Viewing All Versions in Storybook**

**User opens Storybook:**

```
1. Navigate to "Kigo Pro"
2. See three main categories:
   - V1 Production (current)
   - V2 Development (in progress)
   - Future Vision (explorations)

3. Click "V1 Production > Full Apps > Offer Manager"
   → Loads iframe with live V1 app

4. Click "V2 Development > Full Apps > Offer Manager"
   → Loads iframe with V2 prototype

5. Click version switcher dropdown (sb-addon-versions)
   → Switch between versions

6. Compare components side-by-side
   → Open V1 and V2 stories in separate tabs
```

---

## 🔧 Alternative Solutions

### **Option A: Separate Storybook Instances**

Instead of one Storybook, create multiple:

```
kigo-design-system/          → Storybook 1 (MUI + Tailwind components)
kigo-pro-dashboard-v1/       → Storybook 2 (V1 full apps)
kigo-pro-dashboard-v2/       → Storybook 3 (V2 prototypes)
kigo-pro-dashboard-future/   → Storybook 4 (Future visions)
```

**Pros:**

- ✅ Complete separation
- ✅ Different dependencies per version
- ✅ Can be deployed independently

**Cons:**

- ❌ Harder to compare versions
- ❌ More maintenance
- ❌ Duplication of shared components

---

### **Option B: Figma + code-gen + Storybook**

Use Figma as design source, auto-generate code:

```
Figma Design
  ↓ (Builder.io)
Code Generated
  ↓
Commit to Git
  ↓
Storybook Auto-Updates
  ↓ (story.to.design)
Figma Gets Code Updates
```

**Pros:**

- ✅ Designers work in Figma
- ✅ Code auto-generated
- ✅ Bidirectional sync

**Cons:**

- ❌ Generated code may need refinement
- ❌ Limited to supported frameworks
- ❌ AI prompts harder to track

---

### **Option C: Notion/Linear + Storybook Links**

Track designs in Notion, link to Storybook:

```
Notion Database: "Kigo Pro Designs"
├─ Row 1: Offer Manager V1
│  - Status: Production
│  - Storybook: [Link to story]
│  - Chromatic: [Visual diff link]
├─ Row 2: Offer Manager V2
│  - Status: In Development
│  - Prompt: "Create multi-step..."
│  - Storybook: [Link to V2 story]
│  - AI Tag: ai-design-2025-10-22-001
└─ Row 3: Offer Manager Future
   - Status: Exploration
   - Storybook: [Link to future story]
```

**Pros:**

- ✅ Central tracking
- ✅ Easy to see all versions
- ✅ Can add notes, images, videos

**Cons:**

- ❌ Manual linking
- ❌ Not in codebase
- ❌ Can get out of sync

---

## 💡 Best Practices

### **1. Commit Message Convention**

```
[V1] Fix: Button styling on mobile
[V2] Feature: New offer wizard
[Future] Exploration: Voice-based offer creation
[AI] Generated: Campaign analytics from prompt
```

### **2. Story Naming Convention**

```
Kigo Pro/
├── V1 Production/
│   └── Features/Offer Manager/Dashboard
├── V2 Development/
│   └── Features/Offer Manager/Dashboard V2
└── Future Vision/
    └── Features/Offer Manager/AI-Powered Dashboard
```

### **3. Documentation Requirements**

**For Every Design Version:**

- [ ] Storybook story created
- [ ] If AI-generated, document prompt
- [ ] Git commit with metadata
- [ ] Git tag if significant milestone
- [ ] Chromatic visual test run
- [ ] Add to ai-design-log.md or design-decisions.md

### **4. Version Transition Checklist**

**When V2 becomes Production:**

```bash
# 1. Merge V2 to main
git checkout main
git merge design/v2

# 2. Archive V1
git checkout -b archive/v1
git tag -a v1-final -m "V1 final production version"

# 3. Update Storybook categories
# Move V2 stories to "V1 Production"
# Start new "V2 Development" for next iteration

# 4. Update versions.json
# V1 → V1 (Legacy)
# V2 → V1 (Production)
# V3 → V2 (Development)
```

---

## 📊 Comparison Matrix

| Approach                | Setup Time | Maintenance | Version Clarity | AI Tracking | Cost    |
| ----------------------- | ---------- | ----------- | --------------- | ----------- | ------- |
| **Iframe Addon**        | 1 day      | Low         | High            | Medium      | Free    |
| **Versions Addon**      | 2 days     | Medium      | Very High       | Medium      | Free    |
| **Chromatic**           | 1 day      | Low         | High            | High        | $149/mo |
| **Builder.io**          | 3 days     | Medium      | Medium          | High        | $39/mo  |
| **Separate Storybooks** | 5 days     | High        | Medium          | Low         | Free    |
| **Notion Tracking**     | 1 day      | High        | Medium          | High        | $8/mo   |

---

## 🎯 Final Recommendation

**Use a combination:**

1. **Iframe Addon** (immediate) - Embed full apps in Storybook
2. **Git Branches + Folder Structure** (week 1) - V1/V2/Future separation
3. **AI Design Log** (ongoing) - Track prompts and iterations
4. **Chromatic** (week 2) - Visual regression and design review

**Why this combination:**

- ✅ Low cost (only Chromatic paid)
- ✅ Quick to implement
- ✅ Works with existing workflow
- ✅ Scalable to many versions
- ✅ Tracks AI-generated designs
- ✅ Visual diff capabilities
- ✅ Code stays in Git (version control)

---

## 📞 Next Steps

1. **Immediate**: Install iframe addon and create first embedded story
2. **Week 1**: Set up branch structure and versions.json
3. **Week 2**: Create AI design log template
4. **Week 3**: Set up Chromatic
5. **Week 4**: Migrate existing designs to version structure

---

**Questions to Answer Before Proceeding:**

1. Do you want separate Storybook instances or one unified?
2. Should V1 stay on main branch or move to archive?
3. How often will you create AI-generated designs?
4. Do you need Figma integration?
5. Should designers have access to Chromatic?

Let me know your preferences and I can create detailed implementation guides!

---

Last Updated: October 22, 2025
