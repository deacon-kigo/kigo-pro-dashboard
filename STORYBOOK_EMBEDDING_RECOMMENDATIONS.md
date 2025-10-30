# Storybook Embedding & Version Control - Comprehensive Recommendations

> **Context**: Finding better alternatives to iframe embedding for rendering full Pro Dashboard pages in Storybook with complete interactivity, while implementing robust design version control.

---

## Part 1: Embedding Pro Dashboard Pages in Storybook

Based on analysis of your Pro Dashboard architecture and Storybook best practices, here are three approaches ranked by recommendation:

### ✅ **RECOMMENDED: Approach A - Extract & Render Feature Components Directly**

**How it works**: Render feature components (`OfferManagerView`, `AdManagerListView`) directly in Storybook stories with mocked providers.

#### Why This is Best for Kigo Pro

1. **Your pages are already thin wrappers** - Analysis shows pages are just layout shells:

   ```typescript
   // app/offer-manager/page.tsx (45 lines)
   export default function OfferManagerPage() {
     return (
       <Suspense fallback={<LoadingFallback />}>
         <AppLayout customBreadcrumb={breadcrumb}>
           <OfferManagerView />  {/* ← The actual component */}
         </AppLayout>
       </Suspense>
     );
   }
   ```

2. **Full Storybook features unlocked**:

   - ✅ Controls addon for interactive props
   - ✅ Actions addon for event tracking
   - ✅ Docs addon for auto-documentation
   - ✅ Accessibility testing
   - ✅ Visual regression testing
   - ✅ No iframe security/styling limitations

3. **True interactivity** - Components render natively with full React DevTools access

#### Implementation Steps

**Step 1: Identify Dependencies**

From `OfferManagerView.tsx` analysis, these dependencies need mocking:

- Redux store (`useAppDispatch`, `useAppSelector`)
- CopilotKit (`useCopilotReadable`, `useOfferManagerAgent`)
- Toast notifications (likely ToastProvider)
- Router context (Next.js `usePathname`)

**Step 2: Create Mock Providers Decorator**

```typescript
// .storybook/decorators/ProDashboardDecorator.tsx
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CopilotKit } from '@copilotkit/react-core';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    ui: (state = { chatOpen: false, sidebarWidth: '250px' }) => state,
    offerManager: (state = {
      selectedOffer: null,
      offerSelectionMode: 'select',
      workflowPhase: 'dashboard',
    }) => state,
  },
});

// Mock Next.js router
const mockRouter = {
  push: () => {},
  pathname: '/offer-manager',
  query: {},
  asPath: '/offer-manager',
};

export const ProDashboardDecorator = (Story: any) => (
  <Provider store={mockStore}>
    <AppRouterContext.Provider value={mockRouter}>
      <CopilotKit runtimeUrl="/api/copilotkit" agent="mockAgent">
        <div className="min-h-screen bg-bg-light p-6">
          <Story />
        </div>
      </CopilotKit>
    </AppRouterContext.Provider>
  </Provider>
);
```

**Step 3: Create Story for OfferManagerView**

```typescript
// components/features/offer-manager/OfferManagerView.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import OfferManagerView from "./OfferManagerView";
import { ProDashboardDecorator } from "@/.storybook/decorators/ProDashboardDecorator";

const meta = {
  title: "Kigo Pro/Full Pages/Offer Manager",
  component: OfferManagerView,
  decorators: [ProDashboardDecorator],
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "desktop",
    },
  },
} satisfies Meta<typeof OfferManagerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Main dashboard view showing existing offers and creation button.",
      },
    },
  },
};

export const CreationWorkflow: Story = {
  play: async ({ canvasElement }) => {
    // Use @storybook/testing-library to simulate clicking "Create Offer"
    const canvas = within(canvasElement);
    const createButton = await canvas.findByText("Create New Offer");
    await userEvent.click(createButton);
  },
  parameters: {
    docs: {
      description: {
        story: "Offer creation workflow with stepper navigation.",
      },
    },
  },
};
```

**Step 4: Configure Storybook for Tailwind & Next.js**

```typescript
// .storybook/main.ts
import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)", // ← Add Pro Dashboard stories
  ],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@": path.resolve(__dirname, "../"),
        },
      },
    };
  },
};
export default config;
```

```typescript
// .storybook/preview.tsx
import "../app/globals.css"; // ← Import Tailwind styles
import { ProDashboardDecorator } from "./decorators/ProDashboardDecorator";

export const decorators = [ProDashboardDecorator];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

#### Pros & Cons

**Pros**:

- ✅ Full Storybook functionality (no iframe limitations)
- ✅ True interactivity with React DevTools
- ✅ Easy to test and document
- ✅ Works with your existing architecture (pages are thin wrappers)
- ✅ No need to run separate dev servers
- ✅ Component-level isolation

**Cons**:

- ❌ Requires mocking dependencies (Redux, CopilotKit, Router)
- ❌ Some setup work for decorators
- ❌ May need to mock API calls
- ❌ Complex state management might need careful mocking

**Estimated Effort**: 4-6 hours for initial setup + 1-2 hours per feature component

---

### 🔄 **ALTERNATIVE: Approach B - Storybook Composition**

**How it works**: Create a separate Storybook instance for Pro Dashboard, then compose it into the Design System Storybook.

#### Architecture

```
Kigo Design System Storybook (Port 6006)
├── Kigo Design System/
│   ├── Inputs/ (Button, Form, Link)
│   ├── Layout/ (Card, Grid, AppBar)
│   └── Feedback/ (Modal, Snackbar)
│
└── [Composed] Kigo Pro Dashboard (Port 6007)
    └── Full Pages/
        ├── Offer Manager
        ├── Campaigns
        └── Ad Manager
```

#### Implementation Steps

**Step 1: Create Storybook in Pro Dashboard Repo**

```bash
cd /Users/dpoon/Documents/Kigo/Repo/kigo-pro-dashboard
npx storybook@latest init
```

**Step 2: Configure Pro Dashboard Storybook**

```typescript
// kigo-pro-dashboard/.storybook/main.ts
const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: "@storybook/nextjs",
  staticDirs: ["../public"],
};
export default config;
```

**Step 3: Compose into Design System Storybook**

```typescript
// kigo-design-system/.storybook/main.ts
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: "@storybook/react-vite",
  refs: {
    "pro-dashboard": {
      title: "Kigo Pro Dashboard",
      url: "http://localhost:6007", // Pro Dashboard Storybook
      expanded: false,
    },
  },
};
```

**Step 4: Run Both Storybooks**

```bash
# Terminal 1 - Design System
cd kigo-design-system && pnpm dev

# Terminal 2 - Pro Dashboard
cd kigo-pro-dashboard && npm run storybook
```

#### Pros & Cons

**Pros**:

- ✅ Complete separation of concerns (MUI vs Tailwind)
- ✅ Each Storybook can have its own config/addons
- ✅ Pro Dashboard stories live in their native repo
- ✅ Can reference Pro Dashboard without touching Design System code
- ✅ Different tech stacks coexist seamlessly

**Cons**:

- ❌ Need to run TWO Storybook instances (2 dev servers)
- ❌ Composed Storybook stories have limited addon functionality
- ❌ More complex deployment (2 static builds)
- ❌ Still need to mock dependencies in Pro Dashboard stories
- ❌ Navigation between systems slightly less seamless

**Estimated Effort**: 6-8 hours for initial setup + ongoing maintenance of 2 Storybooks

---

### ⚠️ **NOT RECOMMENDED: Approach C - Iframe Embedding**

**Why not**: As you correctly identified, iframes have significant limitations:

- ❌ No access to Storybook controls/actions/docs
- ❌ Styling conflicts and responsive issues
- ❌ Security restrictions (CORS, CSP)
- ❌ Can't use React DevTools
- ❌ Performance overhead
- ❌ Accessibility testing limitations

**Only use if**: You absolutely need the full Next.js runtime with server-side features that can't be mocked.

---

## Part 2: Design Version Control Strategy

### Analysis of Version Control Needs

Based on your requirements:

1. Track V1 (Production), V2 (Development), Future Vision designs
2. Document AI-generated designs with prompts
3. Maintain clarity across versions
4. Enable designer + developer collaboration

### 📊 **RECOMMENDED: Hybrid Git + Folder Strategy**

**Why this approach**: Git is purpose-built for version control and already integrated into your workflow. Additional tools add complexity without solving core problems.

#### Implementation Strategy

**Folder Structure for Design Versions**

```
kigo-pro-dashboard/
├── components/
│   ├── features/
│   │   ├── offer-manager/
│   │   │   ├── OfferManagerView.tsx              # Current production (V1)
│   │   │   ├── OfferManagerView.stories.tsx
│   │   │   ├── v2/                               # ← Development version
│   │   │   │   ├── OfferManagerView.v2.tsx
│   │   │   │   ├── OfferManagerView.v2.stories.tsx
│   │   │   │   └── DESIGN_NOTES.md               # AI prompt history
│   │   │   └── future/                           # ← Future vision
│   │   │       ├── OfferManagerView.future.tsx
│   │   │       ├── OfferManagerView.future.stories.tsx
│   │   │       └── VISION.md
```

**Storybook Organization**

```
Kigo Pro Dashboard/
├── Full Pages/
│   ├── Offer Manager/
│   │   ├── V1 - Production ← Current live version
│   │   ├── V2 - Development ← Next release
│   │   └── Future Vision ← Exploratory designs
```

#### Git Workflow for Design Versions

**Branch Strategy**

```bash
main                    # V1 Production code
├── develop             # V2 Development work
├── feature/ai-offer-wizard  # AI-generated features
└── design/future-vision     # Exploratory designs
```

**Tagging Design Milestones**

```bash
# Tag AI-generated designs
git tag -a design-v2.1-ai-offer-wizard -m "AI-generated offer creation wizard\nPrompt: Create a conversational offer wizard with step validation"

# Tag version releases
git tag -a v1.0.0-production -m "Production release - Offer Manager V1"
git tag -a v2.0.0-beta -m "Beta release - Offer Manager V2 with AI assistance"

# View design history
git tag -l "design-*"
git show design-v2.1-ai-offer-wizard
```

**AI Design Log**

Create a living document tracking AI contributions:

```markdown
<!-- components/features/offer-manager/AI_DESIGN_LOG.md -->

# AI Design Log - Offer Manager

## V2.1 - AI Offer Wizard (2025-01-15)

**Git Tag**: `design-v2.1-ai-offer-wizard`
**AI Model**: Claude 3.5 Sonnet
**Branch**: `feature/ai-offer-wizard`

### Prompt

> "Create a conversational offer creation wizard that guides users through goal setting, offer configuration, and campaign setup. Use a vertical stepper with inline AI assistance buttons."

### Generated Components

- `components/features/offer-manager/steps/GoalSettingStep.tsx`
- `components/features/offer-manager/OfferAgentStateRenderer.tsx`
- `components/features/offer-manager/AgentModeIndicator.tsx`

### Design Decisions

- Used OriginUI vertical stepper for minimal visual footprint
- Integrated CopilotKit for context-aware AI assistance
- Added "Ask AI" buttons next to complex form fields

### Files Changed

- See commit: `abc123f`
- See PR: #45

---

## V2.0 - Redesigned Dashboard (2025-01-10)

**Git Tag**: `design-v2.0-dashboard`
**AI Model**: Claude 3.5 Sonnet
**Branch**: `feature/offer-dashboard-redesign`

### Prompt

> "Redesign the offer manager dashboard to show offer cards with stats, status badges, and quick actions. Use a grid layout with filters."

...
```

#### Storybook Configuration for Versions

```typescript
// OfferManagerView.stories.tsx
import OfferManagerView from './OfferManagerView';
import OfferManagerViewV2 from './v2/OfferManagerView.v2';
import OfferManagerViewFuture from './future/OfferManagerView.future';

const meta = {
  title: 'Kigo Pro Dashboard/Full Pages/Offer Manager',
  component: OfferManagerView,
  decorators: [ProDashboardDecorator],
} satisfies Meta<typeof OfferManagerView>;

export default meta;

// V1 - Production
export const V1_Production: Story = {
  render: () => <OfferManagerView />,
  parameters: {
    docs: {
      description: {
        story: '**Current Production Version (V1)** - Live in production. Stable and battle-tested.',
      },
    },
    badges: ['production', 'stable'],
  },
};

// V2 - Development
export const V2_Development: Story = {
  render: () => <OfferManagerViewV2 />,
  parameters: {
    docs: {
      description: {
        story: '**Development Version (V2)** - Next release candidate with AI assistance features. Currently in beta testing.',
      },
    },
    badges: ['development', 'beta'],
  },
};

// Future Vision
export const FutureVision: Story = {
  render: () => <OfferManagerViewFuture />,
  parameters: {
    docs: {
      description: {
        story: '**Future Vision** - Exploratory design for next-gen offer creation with fully autonomous AI agent.',
      },
    },
    badges: ['future', 'experimental'],
  },
};
```

#### Visual Comparison Views

Create comparison stories to see versions side-by-side:

```typescript
export const VersionComparison: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div>
        <h3 className="font-bold mb-2">V1 Production</h3>
        <div className="border rounded-lg overflow-hidden">
          <OfferManagerView />
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-2">V2 Development</h3>
        <div className="border rounded-lg overflow-hidden">
          <OfferManagerViewV2 />
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-2">Future Vision</h3>
        <div className="border rounded-lg overflow-hidden">
          <OfferManagerViewFuture />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of all design versions.',
      },
    },
  },
};
```

### 🔧 **Alternative Tools (Use as Supplements, Not Replacements)**

Based on research, here are tools that can **complement** Git, not replace it:

#### 1. Chromatic (Visual Regression Layer)

**What it does**: Automated visual testing and UI review workflows
**Cost**: $149/month (unlimited users, 35k snapshots)
**Use case**: Catch visual regressions when promoting V2 → V1

```bash
# Install Chromatic
npm install --save-dev chromatic

# Run visual tests on version branches
npx chromatic --project-token=<token> --branch-name=develop
```

**Integration**:

```typescript
// .storybook/main.ts
export default {
  addons: ["@storybook/addon-essentials", "chromatic"],
};
```

**Pros**:

- ✅ Automatically captures snapshots of all stories
- ✅ Compares V1 vs V2 visually
- ✅ Integrates with GitHub PRs
- ✅ Designer-friendly review UI

**Cons**:

- ❌ Paid service ($149/mo minimum)
- ❌ Doesn't track AI prompts or design rationale
- ❌ Not a version control system (just visual diffing)

#### 2. Figma Branching (Design-to-Code Sync)

**What it does**: Figma's native branching for design files
**Cost**: Free with Figma Professional/Organization plans
**Use case**: Track design iterations before code implementation

**Workflow**:

1. Create Figma branch: `offer-manager-v2`
2. Design in Figma with version history
3. Export designs to code using Figma Dev Mode
4. Implement in code with Git branch of same name
5. Link Figma file in Storybook docs

```typescript
// OfferManagerView.stories.tsx
export const V2_Development: Story = {
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/abc123/Kigo-Pro?node-id=offer-manager-v2",
    },
    docs: {
      description: {
        story: `
**Development Version (V2)**

📐 [View Figma Design](https://figma.com/file/abc123)
🏷️ Git Tag: \`design-v2.0-dashboard\`
🤖 AI-Generated: Yes (see AI_DESIGN_LOG.md)
        `,
      },
    },
  },
};
```

**Pros**:

- ✅ Designer-friendly version control
- ✅ Native Figma integration
- ✅ Design-to-code handoff clarity

**Cons**:

- ❌ Doesn't version code (only designs)
- ❌ Requires Figma Professional plan
- ❌ Not for AI prompt tracking

#### 3. Code-Based Design Tools (Optional Enhancement)

**Tools**: Builder.io, Anima, story.to.design
**Use case**: Sync Storybook ↔ Figma bidirectionally

**Not recommended because**:

- Complex setup and maintenance
- Your workflow is already code-first
- Git + Storybook already provide design versioning

---

## Part 3: Complete Implementation Plan

### Phase 1: Embed Feature Components in Storybook (Week 1-2)

**Tasks**:

1. ✅ Create `ProDashboardDecorator` with Redux + CopilotKit mocks
2. ✅ Write story for `OfferManagerView` with V1/V2/Future versions
3. ✅ Configure Storybook for Tailwind + Next.js imports
4. ✅ Test interactivity and mock data flow
5. ✅ Document component dependencies

**Deliverables**:

- Working Storybook story for Offer Manager (all versions)
- Decorator setup for reuse across Pro Dashboard components
- Documentation on adding new feature component stories

### Phase 2: Implement Design Version Control (Week 2-3)

**Tasks**:

1. ✅ Create folder structure: `v2/` and `future/` subdirectories
2. ✅ Set up Git branching strategy: `main`, `develop`, `design/*`
3. ✅ Create `AI_DESIGN_LOG.md` template
4. ✅ Tag existing designs with `git tag -a design-v1.0`
5. ✅ Write version comparison stories in Storybook

**Deliverables**:

- Folder structure for V1/V2/Future versions
- Git workflow documentation
- AI design log with prompt history
- Side-by-side version comparison in Storybook

### Phase 3: Migrate Remaining Stable Components (Week 3-4)

**Priority components** (from `STABLE_COMPONENTS_ANALYSIS.md`):

1. Breadcrumb (used 7 times)
2. Button (240 lines)
3. Badge (225 lines)
4. Input (196 lines)
5. Card (186 lines)

**Tasks**:

1. ✅ Create stories for top 5 atomic components
2. ✅ Migrate to Design System if production-ready
3. ✅ Keep experimental versions in Pro Dashboard

### Phase 4: Set Up Chromatic (Optional, Week 4)

**Tasks**:

1. ✅ Sign up for Chromatic account
2. ✅ Install `chromatic` addon
3. ✅ Configure CI/CD for visual regression tests
4. ✅ Set up PR review workflow

**Cost**: $149/month (evaluate ROI after 1 month trial)

---

## Recommended Tech Stack

```json
{
  "embedding": {
    "approach": "Direct Component Rendering (Approach A)",
    "tools": [
      "@storybook/react-vite",
      "@storybook/addon-interactions",
      "@storybook/testing-library"
    ]
  },
  "version_control": {
    "approach": "Hybrid Git + Folder Structure",
    "tools": [
      "Git (branches, tags, commits)",
      "Folder structure (v2/, future/)",
      "Markdown logs (AI_DESIGN_LOG.md)"
    ]
  },
  "optional_enhancements": {
    "visual_testing": "Chromatic ($149/mo)",
    "design_sync": "Figma Branching (Free with Pro plan)"
  }
}
```

---

## Summary: Best Approach for Kigo Pro

### ✅ For Embedding: **Approach A - Direct Component Rendering**

**Why**: Your Pro Dashboard pages are already thin wrappers around feature components. This approach gives you full Storybook functionality without iframe limitations.

**Next Steps**:

1. Create `ProDashboardDecorator` to mock Redux + CopilotKit
2. Write stories for `OfferManagerView` (all versions)
3. Repeat for other stable feature components

### ✅ For Version Control: **Hybrid Git + Folder Structure**

**Why**: Git is already your version control system. Adding folders (`v2/`, `future/`) + tagging + AI design logs gives you full design versioning without new infrastructure.

**Next Steps**:

1. Create `v2/` and `future/` subdirectories for each feature
2. Set up Git branching: `main`, `develop`, `design/*`
3. Start logging AI prompts in `AI_DESIGN_LOG.md`
4. Create version comparison stories

### 💡 Optional Enhancements

**Chromatic** ($149/mo): Add only if visual regression testing becomes critical for V1 → V2 migrations

**Figma Branching** (Free): Use if designers need parallel version control (not required if design work happens in code)

---

## Questions & Next Steps

**Questions for you**:

1. Do you want to start with Approach A (Direct Component Rendering) for Offer Manager?
2. Should we set up the folder structure for V1/V2/Future versions?
3. Is Chromatic worth the $149/mo investment, or should we start with Git-only versioning?
4. Do designers work in Figma first, or is this a code-first workflow?

**Immediate Next Step**: I can implement the `ProDashboardDecorator` and create the first story for `OfferManagerView` if you'd like to proceed with Approach A.

Let me know which direction you'd like to take!
