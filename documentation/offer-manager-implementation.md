# Offer Manager MVP Implementation

## 🎯 Overview

The Offer Manager is an AI-native feature tightly integrated with CopilotKit that enables merchants to create promotional offers through an intelligent, conversational workflow. It extends the existing LangGraph supervisor architecture as a specialist agent.

## 🏗️ Architecture

### LangGraph Agent Hierarchy

```
Supervisor Agent (Intent Detection & Routing)
├── Campaign Agent (Ad Creation)
├── Analytics Agent (Performance Data)
├── Filter Agent (Targeting Management)
├── Merchant Agent (Account Support)
└── Offer Manager Agent (NEW - Offer Creation & Management)
    ├── Goal Setting Sub-workflow
    ├── Offer Creation Sub-workflow
    ├── Campaign Setup Sub-workflow
    ├── Validation Sub-workflow
    └── Approval Sub-workflow (with human-in-the-loop)
```

### Backend Implementation

**Files Created:**

- `/backend/app/agents/offer_manager.py` - Main offer manager agent with sub-workflow handlers

**Files Modified:**

- `/backend/app/agents/supervisor.py` - Extended to route "offer_management" intent to the new agent

**Key Features:**

- **Intent Detection**: Recognizes offer-related keywords (offer, promotion, deal, discount, coupon)
- **Program Type Detection**: Auto-detects John Deere, Yardi, or general programs from context
- **Workflow Steps**: goal_setting → offer_creation → campaign_setup → validation → approval
- **State Management**: Extends `KigoProAgentState` with offer-specific fields
- **Human-in-the-loop**: Approval workflow with interrupt before final launch

### Frontend Implementation

**Files Created:**

1. **Page Component**

   - `/app/offer-manager/page.tsx` - Main route for Offer Manager

2. **Feature Components**
   - `/components/features/offer-manager/OfferManagerView.tsx` - Main view with CoAgent integration
   - `/components/features/offer-manager/OfferProgressTracker.tsx` - Visual progress indicator
   - `/components/features/offer-manager/OfferCreationForm.tsx` - Interactive form with AI assistance
   - `/components/features/offer-manager/OfferRecommendations.tsx` - Context-aware AI suggestions
   - `/components/features/offer-manager/OfferApprovalDialog.tsx` - Human approval interface

**Files Modified:**

- `/components/organisms/Sidebar/Sidebar.tsx` - Added "Offer Manager" navigation link with GiftIcon

**Key Features:**

- **CoAgent Integration**: Real-time state sync with LangGraph backend using `useCoAgent`
- **Live Progress Updates**: `useCoAgentStateRender` for streaming progress indicators
- **Interactive Actions**: `useCopilotAction` for approval workflows
- **Context-Aware AI**: "Ask AI" buttons throughout the form for instant guidance
- **Polished UI**: Follows existing design system with Cards, Buttons, and consistent styling

## 🔄 User Flow

### 1. Access Offer Manager

- Navigate via sidebar: "Offer Manager" (GiftIcon)
- Shows dashboard with active offers, drafts, and metrics

### 2. Create New Offer

- Click "Create New Offer" button
- AI Copilot sidebar is always visible for assistance

### 3. Workflow Steps

#### **Step 1: Goal Setting (20% progress)**

- Define business objective
- Select program type (John Deere, Yardi, or General)
- AI asks clarifying questions about target audience

#### **Step 2: Offer Creation (40% progress)**

- AI provides offer type recommendations
- Suggests optimal offer values based on industry benchmarks
- Merchant can accept or customize recommendations

#### **Step 3: Campaign Setup (60% progress)**

- Configure delivery channels (in-app, email, push, geofence)
- Set campaign duration and targeting
- AI provides multi-channel strategy recommendations

#### **Step 4: Validation (80% progress)**

- Automatic brand guideline compliance check
- Business rule validation
- Display passed checks, warnings, and blocking issues

#### **Step 5: Approval (90% progress)**

- Human-in-the-loop approval dialog
- Review offer summary and validation results
- Approve to launch or reject to revise

### 4. Launch

- Upon approval, offer is activated
- Campaign begins delivery to target audience

## 🧩 CoAgent Integration

### Real-Time State Rendering

```tsx
useCoAgentStateRender({
  name: "supervisor",
  render: ({ state, nodeName, status }) => {
    // Renders progress toast when in offer_manager_agent
    // Shows current phase, progress percentage, and status
  },
});
```

### State Synchronization

```tsx
const { state, setState } = useCoAgent<OfferManagerState>({
  name: "supervisor",
  initialState: {
    /* offer-specific fields */
  },
});
```

### Interactive Actions

```tsx
useCopilotAction({
  name: "launchOffer",
  description: "Launch the promotional offer",
  handler: async ({ offer_config, campaign_setup }) => {
    // Triggers approval dialog
  },
});
```

## 🎨 UI Components

### Component Hierarchy

```
OfferManagerView (Main Container)
├── OfferProgressTracker (5-step indicator)
├── OfferCreationForm (Interactive form with AI assist)
│   └── "Ask AI 💡" buttons per field
├── OfferRecommendations (Sidebar suggestions)
│   ├── Context-aware tips
│   └── Program-specific guidance
└── OfferApprovalDialog (Human approval)
    ├── Offer summary
    ├── Validation results
    └── Approve/Reject buttons
```

### Design Patterns

- **Cards**: Primary container for all sections
- **Progress Indicators**: Step-by-step tracker with checkmarks
- **Form Fields**: Input, Select, Label components from design system
- **Buttons**: Primary, outline, and ghost variants
- **Icons**: Heroicons outline style (GiftIcon, SparklesIcon, etc.)
- **Colors**: Primary brand, status colors (success, error, warning)

## 🚀 Testing the Workflow

### Prerequisites

1. Backend server running: `cd backend && source venv/bin/activate && python copilotkit_server.py`
2. LangGraph Studio (optional): `langgraph dev`
3. Frontend running: `npm run dev`

### Test Scenarios

#### Scenario 1: Basic Offer Creation

```
User: "I want to create a new promotion"
AI: Routes to offer_manager_agent → Asks about business objective
User: "Increase Q4 sales by 20%"
AI: Provides offer recommendations → Guides through campaign setup
User: Approves offer
AI: Validates and launches
```

#### Scenario 2: Program-Specific Offer

```
User: "Create a John Deere seasonal promotion"
AI: Detects program_type=john_deere
AI: Provides John Deere-specific recommendations
AI: Suggests seasonal timing and equipment financing offers
```

#### Scenario 3: Approval Rejection

```
User: Completes offer setup
AI: Presents approval dialog
User: Rejects to revise
AI: Continues conversation without launching
User: Makes adjustments and resubmits
```

## 📊 MVP Feature Scope

### ✅ Implemented

- [x] LangGraph agent extending supervisor
- [x] Intent detection for offer management
- [x] Multi-step workflow (5 phases)
- [x] Real-time progress tracking
- [x] Human-in-the-loop approval
- [x] CoAgent hooks for state sync
- [x] Interactive form with AI assistance
- [x] Context-aware recommendations
- [x] Sidebar navigation integration
- [x] Program type detection (John Deere, Yardi)

### 🔮 Future Enhancements (Post-MVP)

- [ ] Offer templates library
- [ ] A/B testing integration
- [ ] Performance analytics dashboard
- [ ] Bulk offer creation
- [ ] Scheduled offer activation
- [ ] ROI prediction models
- [ ] Integration with existing campaign manager
- [ ] Offer versioning and history
- [ ] Advanced targeting rules
- [ ] Real-time offer performance tracking

## 🔍 Key Differences from Research Canvas Example

### Similarities (Borrowed Patterns)

- CoAgent state management with `useCoAgent`
- Real-time rendering with `useCoAgentStateRender`
- Interactive actions with `useCopilotAction`
- Multi-node LangGraph workflow

### Differences (Offer Manager Specifics)

- **Workflow**: 5-phase offer creation vs. research document management
- **State**: Offer-specific fields (business_objective, offer_config, campaign_setup)
- **Approval**: Human-in-the-loop approval gate vs. autonomous agent decisions
- **Integration**: Extends existing supervisor vs. standalone workflow
- **Domain**: E-commerce promotions vs. research tasks

## 📝 Next Steps

1. **User Testing**: Gather feedback on workflow UX
2. **Iteration**: Refine AI recommendations based on real usage
3. **Integration**: Connect to actual offer delivery systems
4. **Analytics**: Build post-launch performance tracking
5. **Templates**: Create offer templates for common use cases
6. **Documentation**: Add user guides and training materials

## 🎯 Success Metrics

- **Offer Creation Time**: Target < 5 minutes (vs. 30+ minutes manual)
- **AI Assistance Usage**: Track "Ask AI" button clicks per session
- **Approval Rate**: Monitor approve vs. reject ratio
- **Validation Pass Rate**: % of offers passing all checks first time
- **User Satisfaction**: NPS score for Offer Manager feature

---

**Implementation Date**: October 13, 2025
**Version**: MVP 1.0
**Status**: ✅ Complete and Ready for Testing
