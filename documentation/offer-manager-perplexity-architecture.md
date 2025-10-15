# Offer Manager - Perplexity-Style Multi-Agent Architecture

**Version**: 2.0 (Perplexity UX Pattern)
**Last Updated**: October 15, 2025
**Status**: ✅ Implemented

---

## 🎯 Executive Summary

The Offer Manager is an **AI-native conversational interface** for creating promotional offers, inspired by Perplexity AI's research agent UX. Unlike traditional form-based tools, it uses **natural language interaction** with **transparent step-by-step execution** visible to the user.

### Key Differentiators

| Traditional Approach                   | Perplexity-Style Approach                                     |
| -------------------------------------- | ------------------------------------------------------------- |
| Multi-step forms with "Ask AI" sidebar | Single natural language input field                           |
| Hidden agent logic                     | Transparent, expandable step viewer                           |
| Form submission → Results              | Conversation → AI plans → Execute with live updates → Results |
| Static progress bar                    | Real-time streaming step updates                              |
| Forms feel like data entry             | Conversation feels like collaboration                         |

---

## 🏗️ Architecture Overview

### System Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js 15)                   │
│  ┌──────────────────┐  ┌─────────────────────────────────┐  │
│  │ Conversation UI  │  │  Expandable Progress Viewer     │  │
│  │  - Natural lang  │  │  - Collapsed by default         │  │
│  │  - Chat-style    │  │  - Click to see agent work      │  │
│  └────────┬─────────┘  └─────────────┬───────────────────┘  │
│           │                          │                       │
│           └──────────────┬───────────┘                       │
│                          │                                   │
│                    useCoAgent (CopilotKit)                   │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │ WebSocket/SSE Streaming
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          │                                   │
│              CopilotKit Runtime (FastAPI)                    │
│                          │                                   │
│           ┌──────────────┴──────────────┐                   │
│           │                              │                   │
│      Supervisor Agent              LangGraph Workflow        │
│      (Intent Router)               (State Machine)           │
│           │                              │                   │
│           └─────────► Offer Manager ◄────┘                   │
│                      Agent (Steps)                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Core Pattern: Co-Agent Agent-in-the-Loop

Based on CopilotKit's **CoAgent** pattern (not just "Copilot"), where:

1. **Agent AND User share state** bidirectionally
2. **Agent executes autonomously** while streaming progress
3. **User can intervene** at any decision point
4. **State persists** across conversation turns (LangGraph checkpointing)

This is **human-in-the-loop** (HITL) by design, not autonomous agents.

---

## 📊 State Architecture

### Agent State Structure

```typescript
interface OfferManagerState extends KigoProAgentState {
  // Business context
  business_objective?: string;
  program_type?: string; // Auto-detected or user-specified

  // Traditional fields (backward compatible)
  offer_config?: any;
  campaign_setup?: any;
  validation_results?: any[];

  // NEW: Perplexity-style streaming
  steps: OfferStep[]; // ← Key addition for transparency
  answer?: {
    markdown: string;
    offer_config: any;
    campaign_setup: any;
  };

  // Approval workflow
  requires_approval?: boolean;
  approval_status?: string;
  pending_action?: any;
}
```

### Step Tracking (Perplexity Pattern)

```typescript
interface OfferStep {
  id: string; // "goal_setting", "offer_creation", etc.
  description: string; // "Understanding your business objectives"
  status: "pending" | "running" | "complete";
  type: string; // Step type for routing
  updates: string[]; // Real-time messages: ["Analyzing...", "Done"]
  result?: any; // Step output data
}
```

**Why this matters:**

- Frontend displays these steps in **expandable progress viewer**
- User can click to see "what the AI is doing right now"
- Each `update` appears in real-time as agent works

---

## 🔄 User Experience Flow

### 1. Landing State (Empty Canvas)

```
┌─────────────────────────────────────────────────────┐
│  What offer would you like to create?               │
│                                                     │
│  [Single input field like Google/Perplexity]       │
│  "Create a 20% discount for new customers..."      │
│                                                     │
│  Example prompts:                                  │
│  • "Boost Q4 sales with seasonal promotion"       │
│  • "Cashback offer for John Deere dealers"        │
└─────────────────────────────────────────────────────┘
```

### 2. Agent Starts Execution

```
┌─────────────────────────────────────────────────────┐
│  User: Create a 20% discount to boost Q4 sales     │
│                                                     │
│  [AI is thinking...]                               │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔵 Understanding your goals... 20% ▶        │   │ ← Collapsed
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 3. User Expands Progress (Transparency)

```
┌─────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔵 Understanding your goals... 20% 🔽       │   │ ← Expanded
│  │                                             │   │
│  │  ✅ Goal Setting                            │   │
│  │     └─ Analyzing request...                │   │
│  │     └─ Goals captured                      │   │
│  │                                             │   │
│  │  🔵 Offer Creation (running)                │   │
│  │     └─ Analyzing similar offers...         │   │
│  │     └─ Researching benchmarks...           │   │ ← Live updates
│  │                                             │   │
│  │  ⏳ Campaign Setup (pending)                │   │
│  │  ⏳ Validation (pending)                    │   │
│  │  ⏳ Approval (pending)                      │   │
│  │                                             │   │
│  │  [████████░░░░░░░░] 40%                     │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 4. Conversation Continues

```
┌─────────────────────────────────────────────────────┐
│  User: Create 20% discount for Q4                  │
│                                                     │
│  AI: I'll help you create that offer. I've         │
│      analyzed similar campaigns and recommend:     │
│                                                     │
│      1. 20% discount on first purchase             │
│      2. Valid October 1 - December 31              │
│      3. Target: New customers only                 │
│                                                     │
│      Does this align with your goals?              │
│                                                     │
│  [User can type naturally to refine]               │
└─────────────────────────────────────────────────────┘
```

---

## 🧩 Technical Implementation

### Backend: Step-Based Execution

Each handler updates the `steps` array:

```python
async def handle_goal_setting(state: OfferManagerState) -> Dict:
    steps = state.get("steps", [])

    # Initialize step
    if not steps:
        steps = [{
            "id": "goal_setting",
            "description": "Understanding your business objectives",
            "status": "running",
            "type": "goal_setting",
            "updates": ["Analyzing your request..."],
            "result": None
        }]

    # Do LLM work...
    llm = get_llm()
    response = await llm.ainvoke([...])

    # Update step with result
    for step in steps:
        if step["id"] == "goal_setting":
            step["updates"].append("Goals captured")
            step["result"] = {"program_type": program_type}

    return {
        **state,
        "steps": steps,  # ← Frontend receives this via streaming
        "messages": messages + [ai_response],
    }
```

**Key insight**: Every return from a handler triggers a state update that streams to the frontend via `useCoAgent`.

### Frontend: Real-Time Rendering

```tsx
const { state } = useCoAgent<OfferManagerState>({
  name: "supervisor",
});

// state.steps automatically updates as backend executes
<OfferProgressViewer steps={state?.steps || []} />;
```

The `OfferProgressViewer` component:

- **Collapsed by default** (shows current step only)
- **Expandable on click** (shows all steps + progress bar)
- **Auto-scrolls** to active step
- **Live updates** as `steps[].updates` changes

### Streaming Pattern (CopilotKit)

```
Backend Update                Frontend Effect
─────────────────            ──────────────────
steps[0].status="running"  → Progress viewer shows spinner
steps[0].updates.push(...)  → New message appears
steps[0].status="complete" → Checkmark appears
steps[1].status="running"  → Next step activates
```

No manual WebSocket code needed - CopilotKit handles this.

---

## 🎨 UI Components

### Component Hierarchy

```
OfferManagerView (Main Container)
├── [Dashboard Mode] OfferManagerDashboard
│   └── Stats + List of existing offers
│
└── [Creation Mode] Conversation Interface
    ├── OfferProgressViewer (Expandable step tracker)
    │   ├── Collapsed: Current step + % complete
    │   └── Expanded: All steps + live updates
    │
    ├── OfferConversationView (Chat interface)
    │   ├── Message thread (user + AI)
    │   ├── AI thinking indicator
    │   └── Single input field (natural language)
    │
    └── OfferApprovalDialog (Human-in-the-loop)
        └── Review → Approve/Reject
```

### Design Principles (Perplexity-Inspired)

1. **Simplicity**: One input field, not 10 form fields
2. **Transparency**: Show AI's work, don't hide it
3. **Recognition > Recall**: Suggest next actions, don't make user think
4. **Progressive Disclosure**: Start simple, reveal complexity on demand
5. **Conversation-First**: Feels like talking to an expert, not filling a form

---

## 🔧 LangGraph Workflow

### Simplified Pattern (No Complex Graph)

We keep your **existing supervisor pattern** - no drastic changes:

```python
# Supervisor routes intent to offer_manager_agent
workflow.add_edge("supervisor" → "offer_manager_agent")

# Offer manager handles steps internally (linear for MVP)
async def offer_manager_agent(state, config):
    current_step = determine_workflow_step(state)

    if current_step == "goal_setting":
        return await handle_goal_setting(state)
    elif current_step == "offer_creation":
        return await handle_offer_creation(state)
    # ... etc
```

**Why not a complex graph?** You requested **simple and debuggable**. We use:

- **Single agent** (`offer_manager_agent`)
- **Handler functions** for each step
- **State-based routing** (check `workflow_step` field)

This is easier to debug than multi-node conditional graphs.

### Future: Step-Based Graph (Optional)

If you want true Perplexity-style dynamic planning:

```python
# Step 1: AI generates execution plan
steps = await plan_steps_node(state)  # LLM outputs: ["research", "draft", "validate"]

# Step 2: Execute each step
for step in steps:
    if step.type == "research":
        await research_node(state)
    # ...
```

See CopilotKit's AI Researcher example for this pattern. **Not needed for MVP**.

---

## 📦 File Structure

### Backend

```
backend/
└── app/
    └── agents/
        ├── supervisor.py           # (Unchanged) Routes to agents
        └── offer_manager.py        # (Extended) Added steps[] tracking
            ├── OfferStep (TypedDict)
            ├── OfferManagerState (Extended with steps, answer)
            ├── handle_goal_setting()     # Updates steps[0]
            ├── handle_offer_creation()   # Updates steps[1]
            ├── handle_validation()       # Updates steps[2]
            └── handle_approval_workflow() # Updates steps[3]
```

### Frontend

```
components/features/offer-manager/
├── types.ts                       # NEW: OfferStep, OfferManagerState
├── OfferProgressViewer.tsx        # NEW: Expandable step tracker
├── OfferConversationView.tsx      # NEW: Chat interface
├── OfferManagerView.tsx           # MODIFIED: Uses new components
├── OfferApprovalDialog.tsx        # (Existing) Approval UI
└── OfferManagerDashboard.tsx      # (Existing) List view
```

---

## 🚀 Implementation Checklist

### ✅ Completed (Phase 1)

- [x] Extended `OfferManagerState` with `steps[]` array
- [x] Updated all handlers to track step progress
- [x] Created `OfferProgressViewer` (expandable component)
- [x] Created `OfferConversationView` (chat interface)
- [x] Added TypeScript types for `OfferStep`
- [x] Integrated `useCoAgent` for real-time state sync

### 🔲 To Complete (Phase 2)

- [ ] Update `OfferManagerView` to switch between modes:
  - Dashboard mode (list of offers)
  - Conversation mode (new components)
- [ ] Wire up conversation input to LangGraph backend
- [ ] Test step streaming end-to-end
- [ ] Add markdown rendering for AI responses
- [ ] Implement approval dialog trigger from steps

### 🔮 Future Enhancements

- [ ] **Dynamic step planning**: Let AI decide steps (like AI Researcher)
- [ ] **Multi-agent coordination**: Research agent + Draft agent + Validation agent
- [ ] **Intermediate state emission**: Use `emit_intermediate_state` for sub-step updates
- [ ] **Thread-based sessions**: Save conversation history per offer
- [ ] **Agent memory**: Remember user preferences across sessions

---

## 📚 Key Learnings from CopilotKit Research

### 1. CoAgent vs. Copilot

- **Copilot**: AI assists user (sidebar, suggestions)
- **CoAgent**: AI and user work together (shared state, bidirectional)

We use **CoAgent pattern** because the agent needs to:

- Execute multi-step workflows autonomously
- Update UI state in real-time
- Wait for human approval at gates

### 2. Step-Based Streaming

CopilotKit's AI Researcher shows this pattern:

```typescript
// Agent outputs steps array
state.steps = [
  { description: "Searching...", status: "running", updates: ["Found 10 results"] },
  { description: "Analyzing...", status: "pending", updates: [] },
]

// Frontend renders each step with live updates
{steps.map(step => <StepCard step={step} />)}
```

This is **more transparent** than just showing "40% complete".

### 3. Conversation-First UX

Traditional: Form → Submit → Wait → Results
Perplexity: Input → AI thinks (visible) → Plan → Execute (visible) → Results

The **visibility of intermediate steps** is the key differentiator.

---

## 🎯 Success Metrics

### User Experience

- **Time to first offer**: < 3 minutes (vs. 15+ minutes with forms)
- **Completion rate**: > 80% (measure drop-offs)
- **User satisfaction**: NPS > 50

### Technical Performance

- **Step streaming latency**: < 500ms per update
- **LLM response time**: < 3s per handler
- **Frontend render time**: < 100ms per state update

### Business Impact

- **Offers created per week**: 2x increase vs. old tool
- **Error rate**: < 5% (validation catches issues)
- **Approval time**: < 5 minutes (human review)

---

## 🐛 Debugging Guide

### Common Issues

**Issue**: Steps not updating in real-time
**Fix**: Check `useCoAgent` is using correct agent name (`"supervisor"`)

**Issue**: Expandable progress viewer stays collapsed
**Fix**: Verify `steps` array is populated in state

**Issue**: Conversation messages not showing
**Fix**: Check `useCopilotChat()` hook and message format

### Development Tools

```bash
# Backend logs
cd backend && poetry run demo
# Watch for: "[Offer Manager] 🎁 Program: general, Step: goal_setting"

# Frontend state inspection
# Open browser console, check: window.__COPILOT_STATE__

# LangGraph Studio (visual debugger)
langgraph dev
# Load ./backend/app/agents and trace execution graph
```

---

## 📖 References

### CopilotKit Examples

- **AI Researcher**: `examples/coagents-ai-researcher/` - Step-based search agent
- **Shared State**: `examples/coagents-shared-state/` - State synchronization
- **Research Canvas**: `examples/coagents-research-canvas/` - Multi-document agent

### Documentation

- CopilotKit Docs: https://docs.copilotkit.ai
- LangGraph: https://langchain-ai.github.io/langgraph/
- Perplexity UX Analysis: (ChatGPT research provided)

---

## 🎉 Summary

This architecture implements a **Perplexity-style conversational agent UX** while maintaining:

1. ✅ **Simple, debuggable architecture** (supervisor pattern, no complex graph)
2. ✅ **Incremental changes** (extended existing handlers, not rewritten)
3. ✅ **Scalable foundation** (can add dynamic planning, multi-agent later)
4. ✅ **Transparent execution** (users see what AI is doing in real-time)
5. ✅ **Natural interaction** (conversation-first, not form-filling)

The key innovation is **step-based streaming** with **progressive disclosure** - users get the power of autonomous agents with the control of human-in-the-loop systems.

---

**Next**: Complete Phase 2 implementation (wire up OfferManagerView) and test end-to-end flow.
