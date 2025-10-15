# Offer Manager: Perplexity-Inspired Agentic UX

**Document Owner**: Design & Engineering
**Date**: October 15, 2025
**Version**: 3.0 (Conversational-First)
**Inspiration**: Perplexity AI Comet Browser

---

## Executive Summary

This redesign transforms the Offer Manager from a **form-based workflow with AI assistance** into a **conversation-first agentic experience** modeled after Perplexity's breakthrough UX patterns.

### Key Paradigm Shift

**Before (Current MVP)**:

```
User fills out form fields → AI provides suggestions in sidebar → User submits
```

**After (Perplexity Model)**:

```
User states goal in natural language → AI creates execution plan →
User approves plan → AI executes with live progress → Results displayed
```

---

## 1. Perplexity UX Principles Applied

### 1.1 Core Principles from Research

| Perplexity Principle       | Application to Offer Manager                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Simplicity**             | Start with single input field: "What offer do you want to create?"                                     |
| **Transparency**           | Show AI's thinking: "Considering 8 similar campaigns...", "Analyzing historical performance..."        |
| **Recognition > Recall**   | Suggest follow-up actions: "Would you like to adjust the discount?", "Shall I create the promo codes?" |
| **Plan-then-Execute**      | AI presents step-by-step plan for approval before creating offer                                       |
| **Human-in-the-Loop**      | User approves plan at key decision points, not just final launch                                       |
| **Progressive Disclosure** | Start simple, add complexity only when needed                                                          |
| **Live Progress**          | Stream AI's work: "Validating brand compliance... ✓", "Generating promo codes... 23/100"               |

### 1.2 The Conversation-First Interface

Instead of **forms**, users have a **conversation** with an AI agent that:

1. Understands their goal in natural language
2. Asks clarifying questions (like Perplexity's error prevention)
3. Creates a structured execution plan
4. Executes the plan with live progress indicators
5. Presents results with inline editing capabilities

---

## 2. Redesigned UX: The Conversational Flow

### 2.1 Landing Experience (Thread-Based)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Kigo PRO                    Offer Manager                   [User ▾] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  📚 Recent Threads                              [+ New Conversation]│ │
│  │  ───────────────────────────────────────────────────────────────── │ │
│  │                                                                     │ │
│  │  🎁 20% Off Parts Campaign                              2 hours ago│ │
│  │     Created offer • Deployed to 5,000 users                        │ │
│  │     [Continue →]                                                   │ │
│  │                                                                     │ │
│  │  💰 Tenant Welcome Bonus                                1 day ago  │ │
│  │     Analyzing performance • 23% redemption rate                    │ │
│  │     [View Results →]                                               │ │
│  │                                                                     │ │
│  │  ⚡ Q4 Lightning Deal                                   3 days ago │ │
│  │     Draft • Pending approval                                       │ │
│  │     [Resume →]                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  🚀 Quick Actions                                                  │ │
│  │  ───────────────────────────────────────────────────────────────── │ │
│  │                                                                     │ │
│  │  [Create offer from template]  [Duplicate best performer]          │ │
│  │  [Analyze campaign performance]  [View all offers]                 │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:

- **Thread-Based**: Each offer creation is a conversation thread (like Perplexity)
- **Resumable**: Pause and come back later
- **Quick Actions**: Common tasks as one-click shortcuts
- **Context Preservation**: Thread maintains full conversation history

---

### 2.2 New Conversation: The Perplexity-Style Input

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Threads                New Conversation                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│                                                                          │
│                                                                          │
│              ┌──────────────────────────────────────────────┐           │
│              │          🎁 Offer Manager AI                 │           │
│              │                                              │           │
│              │   I'll help you create a promotional offer.  │           │
│              │   What are you trying to achieve?            │           │
│              │                                              │           │
│              └──────────────────────────────────────────────┘           │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │ 💬 What offer do you want to create?                             │  │
│   │                                                                   │  │
│   │ Example: "20% off parts for Q4 to increase dealer sales"         │  │
│   │          "Welcome bonus for new tenants at Riverside Property"   │  │
│   │                                                                   │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                  [Ask AI] [Use Template]│  │
│                                                                          │
│                                                                          │
│   Suggested starting points:                                            │
│   • "Create a seasonal promotion for John Deere dealers"                │
│   • "Design a tenant referral bonus for Yardi properties"               │
│   • "Build a flash sale with limited quantity"                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:

- **Single Input Field**: Like Google/Perplexity - no intimidating multi-field form
- **Natural Language**: Users describe their goal conversationally
- **Examples**: Show what good input looks like
- **Suggestions**: Clickable starting points for common scenarios

---

### 2.3 AI Thinking Phase (Transparency)

**User types**: "Create a 20% discount on parts for John Deere dealers this Q4"

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Threads          20% Discount on Parts                [Save] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  👤 You                                                     Just now     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Create a 20% discount on parts for John Deere dealers this Q4      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                                                          │
│  🤖 AI Agent                                       Analyzing... ⏱ 2s    │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 🔍 Understanding your request...                                   │ │
│  │                                                                     │ │
│  │ ✓ Detected program: John Deere (Closed Loop)                      │ │
│  │ ✓ Offer type: Percentage discount                                 │ │
│  │ ✓ Target: Dealer network                                          │ │
│  │ ✓ Timeline: Q4 2025 (Oct-Dec)                                     │ │
│  │                                                                     │ │
│  │ ⏳ Considering 8 similar campaigns...                              │ │
│  │ ⏳ Analyzing historical performance...                             │ │
│  │ ⏳ Checking dealer network capabilities...                         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features** (Perplexity's Transparency):

- **Checkmarks**: Show what AI understood (✓)
- **Live Indicators**: "Considering 8 sources..." style progress
- **Elapsed Time**: Show thinking duration (⏱ 2s)
- **Breakdown**: Explicitly state detected parameters

---

### 2.4 Plan Presentation (Human-in-the-Loop Approval)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Threads          20% Discount on Parts                [Save] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  👤 You                                                     Just now     │
│  │ Create a 20% discount on parts for John Deere dealers this Q4      │ │
│                                                                          │
│  🤖 AI Agent                                                  5s ago     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Great! I've analyzed your goal and here's my recommended plan:     │ │
│  │                                                                     │ │
│  │ ┌──────────────────────────────────────────────────────────────┐  │ │
│  │ │ 📋 EXECUTION PLAN                                            │  │ │
│  │ │                                                               │  │ │
│  │ │ Based on similar campaigns that averaged 18% redemption:     │  │ │
│  │ │                                                               │  │ │
│  │ │ 1️⃣ Offer Configuration                                       │  │ │
│  │ │    • Type: 20% Off Parts & Service                           │  │ │
│  │ │    • Duration: Oct 1 - Dec 31, 2025 (92 days)               │  │ │
│  │ │    • Target: All John Deere dealers (347 locations)          │  │ │
│  │ │    • Budget: ~$180K (estimated 3,000 redemptions @ $60 avg) │  │ │
│  │ │    [Edit →]                                                  │  │ │
│  │ │                                                               │  │ │
│  │ │ 2️⃣ Redemption Method                                         │  │ │
│  │ │    • Promo Code: "PARTS20Q4"                                │  │ │
│  │ │    • Universal code (works at all dealer POS systems)        │  │ │
│  │ │    • Usage: 1 per customer, max 5,000 total                │  │ │
│  │ │    [Edit →]                                                  │  │ │
│  │ │                                                               │  │ │
│  │ │ 3️⃣ Distribution Strategy                                     │  │ │
│  │ │    ✓ Activation Campaign (dealer email + social)             │  │ │
│  │ │    ✓ Hub Airdrops (existing John Deere customers: ~12K)     │  │ │
│  │ │    ✗ Marketplace (closed loop - not applicable)             │  │ │
│  │ │    [Edit →]                                                  │  │ │
│  │ │                                                               │  │ │
│  │ │ 4️⃣ Brand Compliance                                          │  │ │
│  │ │    ✓ John Deere brand guidelines validated                   │  │ │
│  │ │    ✓ Dealer co-op advertising approved                       │  │ │
│  │ │    [View Details →]                                          │  │ │
│  │ │                                                               │  │ │
│  │ │ 📊 Expected Performance:                                      │  │ │
│  │ │    Reach: 12,000 users | Redemptions: 2,160 | ROI: 3.4x     │  │ │
│  │ └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                     │ │
│  │ Does this plan look good?                                          │ │
│  │                                                                     │ │
│  │ [✓ Approve & Execute]  [✏️ Edit Plan]  [🔄 Generate New Plan]    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  💬 Type your response or adjustment...                                 │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                            [Send →]      │
│                                                                          │
│  Suggested responses:                                                   │
│  • "Change the promo code to FALLPARTS20"                               │
│  • "Limit to specific dealers in the Midwest region"                    │
│  • "What if I increase the discount to 25%?"                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features** (Perplexity's Plan-then-Execute):

- **Numbered Steps**: Clear execution plan (like Perplexity's research steps)
- **Inline Editing**: [Edit →] links for each section (no need to restart)
- **Performance Predictions**: Data-driven projections
- **Expandable Details**: [View Details →] for compliance/technical info
- **Suggested Adjustments**: Anticipate follow-up questions (Perplexity's recognition > recall)
- **Conversational Continuation**: User can refine via natural language

---

### 2.5 Execution Phase (Live Progress Streaming)

**User clicks**: [✓ Approve & Execute]

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Threads          20% Discount on Parts                [Save] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Previous conversation collapsed - click to expand]                    │
│                                                                          │
│  🤖 AI Agent                                       Executing... ⏱ 12s   │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ✓ Step 1: Creating offer in database                              │ │
│  │   └─ Offer ID: OFF-2025-Q4-JD-347                                 │ │
│  │                                                                     │ │
│  │ ⏳ Step 2: Validating promo code availability                      │ │
│  │   └─ Checking "PARTS20Q4" across 347 dealer systems...            │ │
│  │   └─ Progress: 156/347 dealers validated ✓                        │ │
│  │                                                                     │ │
│  │ ⏱ Step 3: Setting up activation campaign                          │ │
│  │   └─ Pending...                                                    │ │
│  │                                                                     │ │
│  │ ⏱ Step 4: Preparing airdrop to 12,000 customers                   │ │
│  │   └─ Pending...                                                    │ │
│  │                                                                     │ │
│  │ ━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░░░░░  40% Complete              │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features** (Perplexity's Live Progress):

- **Real-Time Updates**: Stream progress as tasks complete
- **Sub-Task Breakdown**: Show nested progress (e.g., "156/347 dealers")
- **Visual Progress Bar**: Overall completion percentage
- **Status Icons**: ✓ (done), ⏳ (in progress), ⏱ (pending)
- **Detailed Logs**: Expand to see technical details if needed

---

### 2.6 Results with Inline Actions

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Threads          20% Discount on Parts                [Share]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Conversation history - click to expand]                               │
│                                                                          │
│  🤖 AI Agent                                                30s ago      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ✅ Success! Your offer is now live.                                │ │
│  │                                                                     │ │
│  │ ┌──────────────────────────────────────────────────────────────┐  │ │
│  │ │ 🎁 20% Off Parts & Service                                   │  │ │
│  │ │                                                               │  │ │
│  │ │ Offer ID: OFF-2025-Q4-JD-347                                │  │ │
│  │ │ Promo Code: PARTS20Q4                                        │  │ │
│  │ │ Status: 🟢 Active                                            │  │ │
│  │ │ Duration: Oct 1 - Dec 31, 2025                              │  │ │
│  │ │                                                               │  │ │
│  │ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  │ │
│  │ │                                                               │  │ │
│  │ │ 📊 Real-Time Performance                   Updated: Just now │  │ │
│  │ │                                                               │  │ │
│  │ │ Reach:        12,347 users  (target: 12,000) ✓               │  │ │
│  │ │ Redemptions:  23 (0.2%)                                      │  │ │
│  │ │ Revenue:      $1,380 (23 redemptions × $60 avg)             │  │ │
│  │ │                                                               │  │ │
│  │ │ [View Full Dashboard →]                                      │  │ │
│  │ └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                     │ │
│  │ ┌──────────────────────────────────────────────────────────────┐  │ │
│  │ │ 🔗 Campaign Assets                                           │  │ │
│  │ │                                                               │  │ │
│  │ │ Activation URL:                                              │  │ │
│  │ │ https://offers.kigo.io/jd-parts-q4                           │  │ │
│  │ │ [Copy Link] [View Landing Page] [Download QR Code]          │  │ │
│  │ │                                                               │  │ │
│  │ │ Customer Email Template:                                     │  │ │
│  │ │ [Download HTML] [Copy Text] [Preview]                       │  │ │
│  │ └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                     │ │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │
│  │                                                                     │ │
│  │ 💡 What would you like to do next?                                 │ │
│  │                                                                     │ │
│  │ [📊 View Performance Analytics]  [✏️ Edit This Offer]              │ │
│  │ [📋 Create Similar Offer]        [📧 Email Report to Dealers]      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  💬 Ask me anything about this offer...                                 │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                            [Send →]      │
│                                                                          │
│  Suggested questions:                                                   │
│  • "How does this compare to last year's Q4 campaign?"                  │
│  • "Send me an alert if redemptions drop below 15%"                     │
│  • "Create a follow-up offer for customers who redeemed this"           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features** (Perplexity's Results + Actions):

- **Live Performance Metrics**: Real-time updates as offer is redeemed
- **Actionable Results**: Copy links, download assets, view dashboards
- **Inline Editing**: Make changes without starting over
- **Suggested Next Actions**: Anticipate what user might want to do
- **Continued Conversation**: Ask follow-up questions about performance

---

## 3. Perplexity-Inspired Interaction Patterns

### 3.1 Clarifying Questions (Error Prevention)

When AI detects ambiguity:

```
🤖 AI Agent
┌────────────────────────────────────────────────────────────────────┐
│ I need a bit more information to create the best offer:            │
│                                                                     │
│ ❓ You mentioned "dealers" - did you mean:                         │
│    ( ) All John Deere dealers nationwide (347 locations)           │
│    ( ) Specific regional dealers (please specify)                  │
│    ( ) Individual dealer (please provide dealer ID)                │
│                                                                     │
│ ❓ For the 20% discount, should it apply to:                       │
│    ( ) All parts and service                                       │
│    ( ) Parts only (exclude labor)                                  │
│    ( ) Specific product categories                                 │
│                                                                     │
│ [Submit Answers]                                                   │
└────────────────────────────────────────────────────────────────────┘
```

**Perplexity Pattern**: Proactive clarification prevents misunderstandings

---

### 3.2 Expandable Research (Transparency)

```
🤖 AI Agent
┌────────────────────────────────────────────────────────────────────┐
│ Based on analysis of 8 similar campaigns:                          │
│ [▼ Show me how you analyzed this]                                  │
│                                                                     │
│ (User clicks expand)                                               │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ 📊 Campaign Analysis Details                                    ││
│ │                                                                  ││
│ │ Reference campaigns (Oct 2024 - Sept 2025):                     ││
│ │ 1. "Fall Parts Sale 2024" - 18% redemption, $156K revenue       ││
│ │ 2. "Service Special Q1 2025" - 15% redemption, $98K revenue     ││
│ │ 3. "Spring Maintenance Promo" - 22% redemption, $203K revenue   ││
│ │ ... [5 more campaigns]                                           ││
│ │                                                                  ││
│ │ Average performance:                                             ││
│ │ • Redemption rate: 18.3% ± 3.1%                                ││
│ │ • Average transaction value: $58.40                             ││
│ │ • ROI: 3.2x ± 0.6x                                              ││
│ │                                                                  ││
│ │ [View Full Analysis Report →]                                   ││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

**Perplexity Pattern**: Expandable sections for users who want to verify AI reasoning

---

### 3.3 Follow-Up Suggestions (Recognition > Recall)

```
🤖 AI Agent
┌────────────────────────────────────────────────────────────────────┐
│ Your offer is live! Here are some things you might want to explore:│
│                                                                     │
│ • How does this compare to my best-performing campaign?            │
│ • What would happen if I increased the discount to 25%?            │
│ • Create a complementary offer for customers who redeem this       │
│ • Send me a weekly performance summary                             │
│ • Pause this offer if redemption rate drops below 15%              │
│                                                                     │
│ (User can click any suggestion to continue conversation)           │
└────────────────────────────────────────────────────────────────────┘
```

**Perplexity Pattern**: Predict next questions to reduce cognitive load

---

## 4. Technical Implementation

### 4.1 Component Architecture

```tsx
// Main conversational interface
<OfferManagerConversation>
  <ThreadList /> // Left sidebar: conversation history
  <ConversationView>
    {" "}
    // Main area: active conversation
    <MessageStream>
      {" "}
      // Chat messages
      <UserMessage />
      <AgentMessage>
        <ThinkingIndicator /> // "Considering 8 sources..."
        <PlanCard /> // Execution plan with approval
        <ProgressStream /> // Live task execution
        <ResultsCard /> // Final results with actions
      </AgentMessage>
    </MessageStream>
    <InputArea>
      <NaturalLanguageInput /> // Single text field
      <SuggestedResponses /> // Clickable suggestions
    </InputArea>
  </ConversationView>
  <InlineEditor>
    {" "}
    // Right drawer: edit plan details
    <EditOfferConfig />
    <EditRedemption />
    <EditCampaign />
  </InlineEditor>
</OfferManagerConversation>
```

### 4.2 State Management (Conversation-Based)

```typescript
interface ConversationState {
  thread_id: string;
  messages: Message[];

  // Agent state machine
  phase: "understanding" | "planning" | "approval" | "executing" | "complete";

  // Plan (presented for approval)
  execution_plan: {
    steps: ExecutionStep[];
    editable: boolean;
    approved: boolean;
  };

  // Live execution
  current_step: number;
  step_progress: Record<string, number>; // step_id -> percentage

  // Results
  created_offer_id?: string;
  created_campaign_id?: string;
  live_metrics?: LiveMetrics;
}

interface Message {
  role: "user" | "agent";
  content: string;
  metadata?: {
    thinking_visible?: boolean;
    plan?: ExecutionPlan;
    progress?: ProgressUpdate;
    results?: ResultsData;
  };
}
```

### 4.3 Streaming Protocol

```typescript
// Server-Sent Events for live progress
const eventSource = new EventSource("/api/offer-manager/stream");

eventSource.addEventListener("thinking", (event) => {
  // "Considering 8 similar campaigns..."
  updateThinkingIndicator(event.data);
});

eventSource.addEventListener("plan", (event) => {
  // Present execution plan for approval
  showApprovalDialog(JSON.parse(event.data));
});

eventSource.addEventListener("progress", (event) => {
  // "Step 2: Validating promo codes... 156/347"
  updateProgressBar(JSON.parse(event.data));
});

eventSource.addEventListener("complete", (event) => {
  // Show final results
  displayResults(JSON.parse(event.data));
});
```

---

## 5. Comparison: Old vs. New UX

| Aspect           | Old (Form-Based)             | New (Perplexity-Style)         |
| ---------------- | ---------------------------- | ------------------------------ |
| **Entry Point**  | Multi-field form             | Single natural language input  |
| **AI Role**      | Sidebar assistant            | Center-stage agent             |
| **User Intent**  | Must fit into form fields    | Expressed naturally            |
| **Workflow**     | Linear form steps            | Conversational with branching  |
| **Transparency** | Hidden AI reasoning          | Live thinking process visible  |
| **Approval**     | End of workflow only         | Plan approval before execution |
| **Progress**     | Step indicator (20%, 40%...) | Live streaming with sub-tasks  |
| **Results**      | Static summary               | Live metrics + inline actions  |
| **Editing**      | Go back to form              | Inline editing in conversation |
| **Context**      | Lost on navigation           | Preserved in thread            |

---

## 6. Implementation Roadmap

### Phase 1: Conversation Infrastructure (Weeks 1-2)

- Thread-based conversation storage
- Message streaming system (SSE)
- Natural language intent parsing
- Conversation history UI

### Phase 2: Agent Enhancements (Weeks 3-4)

- Plan generation with approval gates
- Live progress streaming
- Inline editing capabilities
- Clarifying questions engine

### Phase 3: Polish & Performance (Weeks 5-6)

- Suggested responses (ML-powered)
- Expandable research details
- Performance optimizations
- Mobile responsive design

---

## 7. Success Metrics

### User Engagement

- **Input Quality**: % of users who provide sufficient detail in first message
- **Approval Rate**: % of plans approved without edits
- **Thread Completion**: % of conversations that reach "complete" phase
- **Return Rate**: % of users who resume threads

### UX Quality

- **Time to First Plan**: < 5 seconds from input submission
- **Clarification Rate**: < 20% of conversations need clarifying questions
- **Edit Rate**: < 30% of plans edited before approval
- **User Satisfaction**: NPS > 9.0

---

## 8. Key Takeaways

### What Makes This "Perplexity-Like"?

1. **Conversation-First**: Start with natural language, not forms
2. **Transparent Thinking**: Show AI's reasoning process
3. **Plan-then-Execute**: Get approval before acting
4. **Live Progress**: Stream execution with real-time updates
5. **Expandable Details**: For users who want to verify
6. **Suggested Next Steps**: Anticipate user needs
7. **Thread-Based**: Resumable, persistent context

### Why This is Better

- **Lower Cognitive Load**: No form fields to understand
- **Faster Time-to-Value**: Get to results quicker
- **Higher Trust**: See exactly what AI is doing
- **More Flexible**: Can course-correct mid-flow
- **Better Context**: Conversation preserves full history

---

**Document Status**: Ready for Prototype Development
**Next Step**: Build conversation UI components in kigo-pro-dashboard
**Owner**: Design & Engineering Team
