# Perplexity-Style CoAgent UX Implementation Guide

**Version**: 1.0  
**Last Updated**: October 16, 2025  
**Status**: 🚧 Implementation Guide

---

## 📋 Overview

This guide details how to build a **Perplexity-style conversational AI UX** for the Kigo PRO Offer Manager using:

- **CopilotKit** (React UI + Agent integration)
- **LangGraph** (Python state machine)
- **Real-time step streaming** (transparent AI execution)
- **Human-in-the-loop** (HITL) approval workflows

---

## 🎯 Key Patterns from CopilotKit Examples

### 1. **AI Researcher Pattern** (`open-research-ANA`)

The AI researcher demonstrates how to:

- Show **thinking steps** as they execute
- Stream **intermediate updates** to the UI
- Provide **expandable progress viewer** (collapsed by default)
- Handle **multi-step research workflows**

**Key Files:**

```
agent/graph.py       # LangGraph workflow with step tracking
agent/state.py       # State structure with steps[] array
frontend/            # React components for real-time rendering
```

### 2. **Multi-Agent Canvas Pattern** (`open-multi-agent-canvas`)

The multi-agent canvas shows:

- **Multiple agents** working together
- **Agent-specific state** visualization
- **Canvas-based** interaction model
- **MCP integration** for deep research

---

## 🏗️ Architecture Components

### Backend (Python + LangGraph)

```
backend/app/agents/
├── supervisor.py            # Routes requests to agents
├── offer_manager.py         # Main offer agent (ENHANCED)
│   ├── OfferStep (TypedDict)      # Step structure
│   ├── OfferManagerState          # Extended state
│   ├── handle_goal_setting()      # Updates steps[]
│   ├── handle_offer_creation()    # Updates steps[]
│   ├── handle_campaign_setup()    # Updates steps[]
│   ├── handle_validation()        # Updates steps[]
│   └── handle_approval()          # Updates steps[]
└── tools/
    └── research_tools.py    # Optional: External research
```

### Frontend (Next.js + CopilotKit)

```
components/features/offer-manager/
├── types.ts                       # TypeScript interfaces
├── OfferProgressViewer.tsx        # Expandable step tracker
├── OfferConversationView.tsx      # Chat interface
├── OfferManagerView.tsx           # Main container
├── OfferApprovalDialog.tsx        # HITL approval
└── steps/
    └── (existing step components)
```

---

## 📊 State Structure

### Step Definition (Perplexity Pattern)

```typescript
interface OfferStep {
  id: string; // "goal_setting", "offer_creation", etc.
  description: string; // "Understanding your business objectives"
  status: "pending" | "running" | "complete" | "error";
  type: string; // Step type for routing
  updates: string[]; // Real-time messages
  result?: any; // Step output data
  metadata?: {
    // Optional metadata
    duration?: number;
    sources?: string[];
    confidence?: number;
  };
}
```

### Offer Manager State (Extended)

```typescript
interface OfferManagerState {
  // Core messaging
  messages: BaseMessage[];

  // Business context
  business_objective?: string;
  program_type?: string; // "john_deere" | "yardi" | "general"

  // Traditional state (backward compatible)
  offer_config?: any;
  campaign_setup?: any;
  workflow_step?: string;
  validation_results?: any[];

  // NEW: Perplexity-style streaming
  steps: OfferStep[]; // ← Key addition for transparency

  // NEW: Final answer/summary
  answer?: {
    markdown: string;
    offer_config: any;
    campaign_setup: any;
    next_steps: string[];
  };

  // Approval workflow
  requires_approval?: boolean;
  approval_status?: string;
  pending_action?: any;
}
```

---

## 🔄 Backend Implementation

### 1. Enhanced Step Tracking

**Pattern**: Each handler function updates the `steps` array

```python
async def handle_goal_setting(state: OfferManagerState, config: RunnableConfig) -> Dict:
    """Guide user through business goal setting"""
    steps = state.get("steps", [])
    messages = state.get("messages", [])

    # Initialize or update step
    goal_step = next((s for s in steps if s["id"] == "goal_setting"), None)

    if not goal_step:
        # Create new step
        goal_step = {
            "id": "goal_setting",
            "description": "Understanding your business objectives",
            "status": "running",
            "type": "goal_setting",
            "updates": ["🔍 Analyzing your request..."],
            "result": None,
            "metadata": {"start_time": datetime.now().isoformat()}
        }
        steps.append(goal_step)
    else:
        # Update existing step
        goal_step["status"] = "running"
        goal_step["updates"].append("📝 Gathering context...")

    # LLM call for goal understanding
    llm = get_llm()
    response = await llm.ainvoke([
        SystemMessage(content=get_goal_setting_prompt(state)),
        HumanMessage(content=get_latest_message(messages))
    ])

    # Extract structured data from response
    goals = extract_goals(response.content)

    # Update step with result
    goal_step["updates"].append("✅ Goals captured")
    goal_step["status"] = "complete"
    goal_step["result"] = {
        "program_type": goals.get("program_type"),
        "objective": goals.get("objective"),
        "constraints": goals.get("constraints")
    }

    # Emit intermediate state (key for real-time updates!)
    await config.get("configurable", {}).get("emit_intermediate_state", lambda x: None)({
        **state,
        "steps": steps,
        "messages": messages + [AIMessage(content=response.content)]
    })

    return {
        **state,
        "steps": steps,
        "messages": messages + [AIMessage(content=response.content)],
        "workflow_step": "offer_creation",  # Advance workflow
        "business_objective": goals.get("objective"),
        "program_type": goals.get("program_type"),
    }
```

### 2. Multi-Step Research Pattern

**Inspired by AI Researcher example:**

```python
async def handle_offer_research(state: OfferManagerState, config: RunnableConfig) -> Dict:
    """Research best practices and benchmarks (Perplexity-style)"""
    steps = state.get("steps", [])

    # Create research step with sub-steps
    research_step = {
        "id": "research",
        "description": "Researching offer strategies",
        "status": "running",
        "type": "research",
        "updates": [],
        "result": None,
        "metadata": {
            "sub_steps": [
                {"id": "industry_benchmarks", "status": "pending"},
                {"id": "competitor_analysis", "status": "pending"},
                {"id": "historical_performance", "status": "pending"}
            ]
        }
    }
    steps.append(research_step)

    # Execute sub-steps with streaming updates
    for sub_step in research_step["metadata"]["sub_steps"]:
        sub_step["status"] = "running"
        research_step["updates"].append(f"🔎 Analyzing {sub_step['id']}...")

        # Emit state after each sub-step update
        await emit_state(config, state, steps)

        # Simulate research (replace with actual research logic)
        await asyncio.sleep(0.5)  # Simulate processing
        sub_step["status"] = "complete"
        research_step["updates"].append(f"✅ {sub_step['id']} complete")

    research_step["status"] = "complete"
    research_step["result"] = {
        "industry_avg_discount": "15-25%",
        "recommended_duration": "7-14 days",
        "predicted_redemption": "3-5%"
    }

    return {"steps": steps, **state}
```

### 3. LangGraph Workflow Structure

```python
from langgraph.graph import StateGraph, START, END

def create_offer_manager_graph():
    """Create LangGraph workflow with step-based execution"""

    workflow = StateGraph(OfferManagerState)

    # Add nodes for each step
    workflow.add_node("goal_setting", handle_goal_setting)
    workflow.add_node("research", handle_offer_research)
    workflow.add_node("offer_creation", handle_offer_creation)
    workflow.add_node("campaign_setup", handle_campaign_setup)
    workflow.add_node("validation", handle_validation)
    workflow.add_node("approval", handle_approval_workflow)

    # Define edges (linear for MVP, can be conditional later)
    workflow.add_edge(START, "goal_setting")
    workflow.add_edge("goal_setting", "research")
    workflow.add_edge("research", "offer_creation")
    workflow.add_edge("offer_creation", "campaign_setup")
    workflow.add_edge("campaign_setup", "validation")
    workflow.add_edge("validation", "approval")
    workflow.add_edge("approval", END)

    return workflow.compile(
        checkpointer=memory_saver,  # Enable state persistence
        interrupt_before=["approval"]  # Human-in-the-loop gate
    )
```

---

## 🎨 Frontend Implementation

### 1. OfferProgressViewer Component

**Inspired by Perplexity's expandable step viewer:**

```tsx
// components/features/offer-manager/OfferProgressViewer.tsx

import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface OfferStep {
  id: string;
  description: string;
  status: "pending" | "running" | "complete" | "error";
  type: string;
  updates: string[];
  result?: any;
  metadata?: any;
}

interface OfferProgressViewerProps {
  steps: OfferStep[];
  isCollapsed?: boolean;
}

export default function OfferProgressViewer({
  steps,
  isCollapsed: initialCollapsed = true,
}: OfferProgressViewerProps) {
  const [isExpanded, setIsExpanded] = useState(!initialCollapsed);

  // Calculate progress
  const completedSteps = steps.filter((s) => s.status === "complete").length;
  const totalSteps = steps.length;
  const progressPercent =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const currentStep = steps.find((s) => s.status === "running");

  const getStepIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "running":
        return <ClockIcon className="w-5 h-5 text-blue-500 animate-pulse" />;
      case "error":
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Collapsed Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isExpanded ? (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {currentStep ? currentStep.description : "Ready to start"}
              </div>
              <div className="text-xs text-gray-500">
                {completedSteps} of {totalSteps} steps complete
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {Math.round(progressPercent)}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Expanded Steps View */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {step.description}
                </div>

                {/* Step updates (live stream) */}
                {step.updates && step.updates.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {step.updates.map((update, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-600 flex items-start space-x-2 animate-fadeIn"
                      >
                        <span className="text-gray-400">└─</span>
                        <span>{update}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step result (when complete) */}
                {step.status === "complete" && step.result && (
                  <div className="mt-2 p-2 bg-white rounded border border-gray-200 text-xs text-gray-700">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(step.result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. OfferConversationView Component

**Natural language chat interface:**

```tsx
// components/features/offer-manager/OfferConversationView.tsx

import React from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { SparklesIcon, UserIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";

export default function OfferConversationView() {
  const { messages, isLoading, append } = useCopilotChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    append({ role: "user", content });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex space-x-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-blue-500"
                    : "bg-gradient-to-br from-purple-500 to-indigo-600"
                }`}
              >
                {message.role === "user" ? (
                  <UserIcon className="w-5 h-5 text-white" />
                ) : (
                  <SparklesIcon className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <ConversationInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

function ConversationInput({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe your offer goals..."
        disabled={disabled}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </form>
  );
}
```

### 3. Updated OfferManagerView (Main Container)

```tsx
// components/features/offer-manager/OfferManagerView.tsx

"use client";

import React, { useState } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import { OfferManagerState } from "./types";
import OfferProgressViewer from "./OfferProgressViewer";
import OfferConversationView from "./OfferConversationView";
import OfferApprovalDialog from "./OfferApprovalDialog";
import OfferManagerDashboard from "./OfferManagerDashboard";

export default function OfferManagerView() {
  const [mode, setMode] = useState<"dashboard" | "create">("dashboard");
  const [showApproval, setShowApproval] = useState(false);

  // Connect to supervisor agent (routes to offer_manager_agent)
  const { state } = useCoAgent<OfferManagerState>({
    name: "supervisor",
    initialState: {
      messages: [],
      steps: [],
      workflow_step: "goal_setting",
      business_objective: "",
      program_type: "general",
      offer_config: {},
      campaign_setup: {},
    },
  });

  // Check if approval is needed
  React.useEffect(() => {
    if (state?.requires_approval && !showApproval) {
      setShowApproval(true);
    }
  }, [state?.requires_approval]);

  if (mode === "dashboard") {
    return <OfferManagerDashboard onCreateOffer={() => setMode("create")} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Offer</h1>
            <p className="text-sm text-gray-500">
              Powered by AI · {state?.program_type || "General"} Program
            </p>
          </div>
          <button
            onClick={() => setMode("dashboard")}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-hidden">
        {/* Left: Progress Viewer */}
        <div className="col-span-1">
          <OfferProgressViewer steps={state?.steps || []} isCollapsed={false} />
        </div>

        {/* Right: Conversation */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <OfferConversationView />
        </div>
      </div>

      {/* Approval Dialog */}
      {showApproval && state?.pending_action && (
        <OfferApprovalDialog
          isOpen={showApproval}
          onClose={() => setShowApproval(false)}
          offerData={state.offer_config}
          campaignData={state.campaign_setup}
          onApprove={() => {
            // Send approval action to agent
            setShowApproval(false);
          }}
          onReject={() => {
            setShowApproval(false);
          }}
        />
      )}
    </div>
  );
}
```

---

## 🔌 Real-Time Streaming Integration

### Backend: Emit Intermediate State

```python
from langgraph.checkpoint.memory import MemorySaver

# Enable intermediate state emission
memory_saver = MemorySaver()

graph = create_offer_manager_graph()
compiled_graph = graph.compile(
    checkpointer=memory_saver,
    interrupt_before=["approval"]  # HITL gate
)

# Helper function to emit state
async def emit_state(config: RunnableConfig, state: Dict, steps: List[Dict]):
    """Emit intermediate state for real-time UI updates"""
    emit_fn = config.get("configurable", {}).get("emit_intermediate_state")
    if emit_fn:
        await emit_fn({**state, "steps": steps})
```

### Frontend: Real-Time State Subscription

```tsx
const { state } = useCoAgent<OfferManagerState>({
  name: "supervisor",
  // State automatically updates as backend streams!
});

// state.steps updates in real-time as agent executes
// No manual WebSocket code needed - CopilotKit handles it
```

---

## 🎨 Design Principles (Perplexity-Inspired)

1. **Simplicity First**: Start with one input field, not 10 form fields
2. **Transparency**: Show AI's work in expandable viewer, don't hide it
3. **Recognition > Recall**: Suggest options, don't make users remember
4. **Progressive Disclosure**: Collapsed by default, expand on demand
5. **Conversation-First**: Feels like talking to an expert
6. **Real-Time Feedback**: Updates appear as they happen
7. **Human-in-the-Loop**: Clear approval gates for critical actions

---

## 🚀 Implementation Phases

### Phase 1: Backend Step Tracking ✅

- [x] Extend OfferManagerState with steps[] array
- [x] Update handlers to create/update steps
- [x] Add step status tracking (pending/running/complete)
- [x] Add real-time updates array

### Phase 2: Frontend Components 🚧

- [ ] Build OfferProgressViewer (expandable)
- [ ] Build OfferConversationView (chat)
- [ ] Update OfferManagerView (wire components)
- [ ] Add markdown rendering for AI responses

### Phase 3: Real-Time Streaming 📋

- [ ] Enable intermediate state emission in LangGraph
- [ ] Test real-time step updates
- [ ] Verify WebSocket connection stability
- [ ] Add error handling and reconnection logic

### Phase 4: Polish & Test 📋

- [ ] Add animations for step transitions
- [ ] Implement approval dialog trigger
- [ ] Test end-to-end workflow
- [ ] Gather feedback and iterate

---

## 📚 References

### CopilotKit Examples

- **AI Researcher**: `CopilotKit/open-research-ANA` - Step-based search agent
- **Multi-Agent Canvas**: `CopilotKit/open-multi-agent-canvas` - Multi-agent coordination
- **LangGraph Python**: `CopilotKit/with-langgraph-python` - Basic integration

### Documentation

- CopilotKit Docs: https://docs.copilotkit.ai
- LangGraph: https://langchain-ai.github.io/langgraph/
- Perplexity UX Patterns: (Analyzed from open-research-ANA)

---

## 💡 Key Insights

**From AI Researcher Example:**

- Steps are the **unit of transparency** - each step has description, status, updates
- Collapsed by default, **expandable on click** - progressive disclosure
- **Real-time updates array** - stream messages as they happen
- **Result data** stored per step - can show summaries

**From Multi-Agent Canvas:**

- Multiple agents can work **in parallel** or **sequentially**
- Each agent has **its own state** and step tracking
- Canvas provides **spatial context** (not needed for offer manager)
- MCP integration for **deep tool access**

**Pattern to Apply:**

1. Start with **simple linear workflow** (goal → research → create → validate → approve)
2. Add **step tracking** at each node
3. Stream **intermediate updates** as work happens
4. Show **expandable progress viewer** for transparency
5. Enable **human-in-the-loop** at approval gate

---

## 🎯 Success Criteria

- ✅ User sees AI thinking in real-time
- ✅ Steps are visible and understandable
- ✅ Progress is clear at all times
- ✅ Can expand to see details on demand
- ✅ Approval dialog triggers at right time
- ✅ Conversation feels natural
- ✅ Time to first offer < 3 minutes

---

**Next Actions:**

1. Complete Phase 2 frontend components
2. Wire up real-time streaming
3. Test end-to-end with pilot workflow
4. Gather feedback and iterate
