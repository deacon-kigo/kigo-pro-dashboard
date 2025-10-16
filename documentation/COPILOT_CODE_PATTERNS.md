# CopilotKit Code Patterns - From Example Apps

**Source**: CopilotKit/open-research-ANA (AI Researcher)  
**Pattern**: Perplexity-style step-based execution with real-time streaming

---

## 🎯 Core Pattern: Step-Based Streaming

### 1. State Structure (Python - LangGraph)

```python
from typing import TypedDict, Annotated, List, Optional
from langgraph.graph import StateGraph

class ResearchStep(TypedDict):
    """Represents a single step in the research process"""
    id: str
    description: str
    status: str  # "pending" | "running" | "complete" | "error"
    updates: List[str]
    result: Optional[dict]

class AgentState(TypedDict):
    """Main agent state with step tracking"""
    messages: Annotated[List[BaseMessage], add_messages]
    steps: List[ResearchStep]
    answer: Optional[dict]
    sources: List[dict]
```

### 2. Step Creation Pattern

```python
async def research_node(state: AgentState, config: RunnableConfig) -> dict:
    """Research node that tracks progress"""

    # Get or create step
    steps = state.get("steps", [])
    research_step = {
        "id": "research",
        "description": "Searching for information",
        "status": "running",
        "updates": ["🔍 Starting search..."],
        "result": None
    }
    steps.append(research_step)

    # Emit intermediate state (KEY FOR REAL-TIME!)
    await emit_intermediate_state(config, {**state, "steps": steps})

    # Do actual work
    research_step["updates"].append("📚 Found 10 sources...")
    await emit_intermediate_state(config, {**state, "steps": steps})

    # Complete step
    research_step["status"] = "complete"
    research_step["updates"].append("✅ Research complete")
    research_step["result"] = {"sources": sources}

    return {"steps": steps, **state}
```

### 3. Intermediate State Emission

```python
async def emit_intermediate_state(config: RunnableConfig, state: dict):
    """Emit state for real-time UI updates"""
    emit_fn = config.get("configurable", {}).get("emit_intermediate_state")
    if emit_fn:
        await emit_fn(state)

# When creating graph:
graph = create_graph()
compiled = graph.compile(
    checkpointer=MemorySaver(),
    # This enables the emit_intermediate_state callback
)
```

---

## 🎨 Frontend Patterns

### 1. Progress Viewer Component (React + TypeScript)

```tsx
import { useCoAgent } from "@copilotkit/react-core";

interface Step {
  id: string;
  description: string;
  status: "pending" | "running" | "complete" | "error";
  updates: string[];
  result?: any;
}

export default function ProgressViewer() {
  const { state } = useCoAgent<AgentState>({
    name: "research_agent",
  });

  const [expanded, setExpanded] = useState(false);
  const steps = state?.steps || [];

  return (
    <div className="progress-viewer">
      {/* Collapsed header */}
      <div onClick={() => setExpanded(!expanded)}>
        <h3>Progress: {calculateProgress(steps)}%</h3>
        <p>{getCurrentStep(steps)?.description}</p>
      </div>

      {/* Expanded steps */}
      {expanded && (
        <div className="steps-list">
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>
      )}
    </div>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <div className={`step-card status-${step.status}`}>
      <div className="step-header">
        <StepIcon status={step.status} />
        <h4>{step.description}</h4>
      </div>

      {/* Real-time updates */}
      <div className="step-updates">
        {step.updates.map((update, i) => (
          <div key={i} className="update-line">
            └─ {update}
          </div>
        ))}
      </div>

      {/* Result (when complete) */}
      {step.status === "complete" && step.result && (
        <div className="step-result">
          <ResultDisplay data={step.result} />
        </div>
      )}
    </div>
  );
}
```

### 2. Real-Time State Subscription

```tsx
const { state } = useCoAgent<AgentState>({
  name: "my_agent",
  initialState: {
    messages: [],
    steps: [],
    answer: null,
  },
});

// state.steps automatically updates as backend streams!
// React re-renders when state changes
// No manual WebSocket code needed
```

### 3. Conversation Interface Pattern

```tsx
import { useCopilotChat } from "@copilotkit/react-core";

export default function ConversationView() {
  const { messages, isLoading, append } = useCopilotChat();

  const handleSend = (text: string) => {
    append({ role: "user", content: text });
  };

  return (
    <div className="conversation">
      <div className="messages">
        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}
        {isLoading && <ThinkingIndicator />}
      </div>
      <ConversationInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
```

---

## 🔀 Multi-Step Workflow Pattern

```python
from langgraph.graph import StateGraph, START, END

def create_workflow():
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("plan", plan_node)
    workflow.add_node("research", research_node)
    workflow.add_node("analyze", analyze_node)
    workflow.add_node("summarize", summarize_node)

    # Define flow
    workflow.add_edge(START, "plan")
    workflow.add_edge("plan", "research")
    workflow.add_edge("research", "analyze")
    workflow.add_edge("analyze", "summarize")
    workflow.add_edge("summarize", END)

    return workflow.compile(
        checkpointer=MemorySaver(),
        interrupt_before=["summarize"]  # Human-in-the-loop gate
    )

# Each node follows the pattern:
async def plan_node(state: AgentState, config: RunnableConfig) -> dict:
    steps = state.get("steps", [])

    # Create step
    step = create_step("plan", "Planning research strategy")
    steps.append(step)
    await emit(config, state, steps)

    # Do work with streaming updates
    step["updates"].append("Identifying topics...")
    await emit(config, state, steps)

    # Complete
    step["status"] = "complete"
    step["result"] = {"plan": plan_data}

    return {"steps": steps, **state}
```

---

## 🔥 Key Patterns from open-research-ANA

### Pattern 1: Sub-Step Tracking

```python
async def deep_research_node(state: AgentState, config: RunnableConfig):
    """Research with multiple sub-steps"""
    steps = state.get("steps", [])

    research_step = {
        "id": "research",
        "description": "Deep research",
        "status": "running",
        "updates": [],
        "result": None,
        "sub_steps": [
            {"id": "web_search", "status": "pending"},
            {"id": "doc_analysis", "status": "pending"},
            {"id": "fact_check", "status": "pending"}
        ]
    }
    steps.append(research_step)

    # Execute each sub-step
    for sub_step in research_step["sub_steps"]:
        sub_step["status"] = "running"
        research_step["updates"].append(f"🔎 {sub_step['id']}...")
        await emit(config, state, steps)

        # Do work
        result = await execute_sub_step(sub_step["id"])

        sub_step["status"] = "complete"
        sub_step["result"] = result
        research_step["updates"].append(f"✅ {sub_step['id']} done")
        await emit(config, state, steps)

    research_step["status"] = "complete"
    return {"steps": steps}
```

### Pattern 2: Error Handling with Steps

```python
async def safe_node(state: AgentState, config: RunnableConfig):
    """Node with error handling"""
    steps = state.get("steps", [])
    step = create_step("task", "Executing task")
    steps.append(step)

    try:
        # Do work
        result = await do_work()
        step["status"] = "complete"
        step["result"] = result
        step["updates"].append("✅ Success")
    except Exception as e:
        step["status"] = "error"
        step["updates"].append(f"❌ Error: {str(e)}")
        step["result"] = {"error": str(e)}

    return {"steps": steps, **state}
```

### Pattern 3: Conditional Branching

```python
def create_conditional_workflow():
    workflow = StateGraph(AgentState)

    workflow.add_node("check_sources", check_sources_node)
    workflow.add_node("web_search", web_search_node)
    workflow.add_node("document_search", document_search_node)
    workflow.add_node("summarize", summarize_node)

    # Conditional routing based on state
    def route_after_check(state: AgentState) -> str:
        if state.get("needs_web_search"):
            return "web_search"
        elif state.get("needs_doc_search"):
            return "document_search"
        else:
            return "summarize"

    workflow.add_edge(START, "check_sources")
    workflow.add_conditional_edges(
        "check_sources",
        route_after_check,
        {
            "web_search": "web_search",
            "document_search": "document_search",
            "summarize": "summarize"
        }
    )
    workflow.add_edge("web_search", "summarize")
    workflow.add_edge("document_search", "summarize")
    workflow.add_edge("summarize", END)

    return workflow.compile()
```

---

## 🎯 Best Practices

### 1. Step Granularity

**Good - Clear, Actionable Steps:**

```python
steps = [
    {"id": "goal_setting", "description": "Understanding your objectives"},
    {"id": "research", "description": "Researching best practices"},
    {"id": "recommendations", "description": "Creating recommendations"},
    {"id": "validation", "description": "Validating results"}
]
```

**Bad - Too Granular:**

```python
steps = [
    {"id": "step1", "description": "Thinking"},
    {"id": "step2", "description": "Processing"},
    {"id": "step3", "description": "Finishing"}
]
```

### 2. Update Messages

**Good - Informative, Action-Oriented:**

```python
step["updates"] = [
    "🔍 Searching 10,000 articles...",
    "📊 Analyzing top 50 results...",
    "✅ Found 5 relevant sources"
]
```

**Bad - Vague, Technical:**

```python
step["updates"] = [
    "Starting...",
    "Processing...",
    "Done"
]
```

### 3. Result Structure

**Good - Structured, Useful:**

```python
step["result"] = {
    "summary": "Found 5 strategies for increasing sales",
    "recommendations": [
        {"title": "Discount Strategy", "confidence": 0.85},
        {"title": "Bundle Offers", "confidence": 0.78}
    ],
    "sources": ["source1.com", "source2.com"]
}
```

**Bad - Raw, Unstructured:**

```python
step["result"] = "some data"
```

---

## 🚀 Integration Checklist

### Backend (Python + LangGraph)

- [ ] Define step structure (TypedDict)
- [ ] Extend state with steps[] array
- [ ] Create step tracking helpers
- [ ] Add intermediate state emission
- [ ] Update all nodes to track steps
- [ ] Test step streaming

### Frontend (React + TypeScript)

- [ ] Define TypeScript interfaces for steps
- [ ] Create ProgressViewer component
- [ ] Add expand/collapse functionality
- [ ] Style step status indicators
- [ ] Add animations for transitions
- [ ] Test real-time updates

### Integration

- [ ] Connect useCoAgent to backend
- [ ] Verify WebSocket connection
- [ ] Test state synchronization
- [ ] Handle errors gracefully
- [ ] Add loading states
- [ ] Test end-to-end flow

---

## 📊 Performance Considerations

### Backend

- **Emit Frequency**: Don't emit after every tiny update, batch updates when possible
- **State Size**: Keep step updates concise, don't store massive results in steps
- **Checkpointing**: Use MemorySaver for development, PostgreSQL for production

### Frontend

- **Re-render Optimization**: Use React.memo for step cards
- **Virtual Scrolling**: For many steps (>20), use virtualization
- **Animation Performance**: Use CSS transforms for smooth animations

---

## 🔗 Quick Reference

**Key Files to Study:**

- `open-research-ANA/agent/graph.py` - LangGraph workflow
- `open-research-ANA/agent/state.py` - State structure
- `open-research-ANA/frontend/` - React components

**Key Concepts:**

- **Steps**: Unit of transparency and progress
- **Emit Intermediate State**: Real-time streaming
- **useCoAgent**: React hook for state subscription
- **Status Flow**: pending → running → complete/error

**Pattern Summary:**

1. Define step structure
2. Track steps in each node
3. Emit intermediate state
4. Render in expandable viewer
5. Show live updates

---

Happy building! 🚀
