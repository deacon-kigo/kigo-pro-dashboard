# CopilotKit + LangGraph Architecture Patterns & Best Practices

## Overview

This document captures proven patterns for implementing CopilotKit with LangGraph in React/Next.js applications, based on analysis of CoAgents examples and production implementation experience.

**Current Implementation**: Python FastAPI + LangGraph backend with Next.js + CopilotKit frontend.

## Core Architecture Patterns

### Pattern 1: Python LangGraph-First Orchestration ✅ **Current Implementation**

**Concept**: Python LangGraph as master orchestrator calling CopilotKit actions as tools

```python
# Backend: Python FastAPI + LangGraph agents call CopilotKit actions
async def campaign_agent(state: KigoProAgentState) -> KigoProAgentState:
    # Intelligent agent logic using OpenAI
    llm = get_llm()
    intent = state.get("user_intent", "")

    if intent == "ad_creation":
        # Agent decides to navigate user
        ai_response = await llm.ainvoke([
            SystemMessage(content="Help with ad creation..."),
            HumanMessage(content=user_input)
        ])

        # Agent calls CopilotKit action as tool
        return {
            **state,
            "messages": messages + [AIMessage(content=ai_response.content)],
            "workflow_data": {
                "pending_actions": [
                    {
                        "action_name": "navigateToAdCreation",
                        "parameters": {"adType": "display"},
                        "expects_result": True
                    }
                ]
            }
        }
```

```typescript
// Frontend: Next.js API route proxies to Python backend
async function callPythonBackend(message: string, context: any) {
  const response = await fetch("http://localhost:8000/api/copilotkit/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context: extractAppContext(context) }),
  });

  const result = await response.json();

  // Execute actions returned by Python LangGraph
  if (result.actions?.length > 0) {
    await executeActionsFromLangGraph(result.actions);
  }

  return result.message;
}

// CopilotKit still provides action execution
const runtime = new CopilotRuntime({
  actions: [
    {
      name: "handleUserMessage",
      handler: async ({ message, context }) => {
        return await callPythonBackend(message, context || {});
      },
    },
  ],
});
```

**Benefits**:

- ✅ Full LangGraph Studio chat mode support
- ✅ Better Python ecosystem integration (scikit-learn, pandas, etc.)
- ✅ Proven FastAPI + LangGraph pattern from CopilotKit examples
- ✅ LangGraph maintains conversation memory and complex workflows
- ✅ CopilotKit actions serve as tools for UI interaction
- ✅ Complete state synchronization between agent and app
- ✅ Drop-in replacement for existing frontend

### Pattern 2: TypeScript LangGraph Orchestration (Previous)

**Status**: Migrated to Python due to LangGraph Studio limitations

### Pattern 3: Frontend-First Actions ❌ **Anti-Pattern**

**Concept**: CopilotKit AI calls frontend actions directly, bypassing LangGraph

```typescript
// ❌ BAD: Frontend actions called directly by AI
useCopilotAction({
  name: "createComplexWorkflow",
  handler: async ({ params }) => {
    // AI calls this directly, no agent orchestration
    // No conversation memory or complex workflow management
    return "Simple response";
  },
});
```

**Problems**:

- No conversation memory between turns
- Limited to simple single-turn interactions
- No complex workflow orchestration
- Missing agent collaboration capabilities
- Poor error recovery

## Component Architecture

### Python LangGraph Backend Structure

**Current Pattern**: Python FastAPI + LangGraph multi-agent system

```python
# backend/app/agents/supervisor.py
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI

class KigoProAgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    user_intent: str
    context: dict
    agent_decision: str
    workflow_data: dict
    error: Optional[str]

def create_supervisor_workflow():
    workflow = StateGraph(KigoProAgentState)
    workflow.add_node("supervisor", supervisor_agent)
    workflow.add_node("campaign_agent", campaign_agent)
    workflow.add_node("analytics_agent", analytics_agent)
    workflow.add_node("general_assistant", general_assistant)
    workflow.set_entry_point("supervisor")

    # Add conditional edges with explicit mapping for Studio visualization
    workflow.add_conditional_edges(
        "supervisor",
        route_to_agent,
        {
            "campaign_agent": "campaign_agent",
            "analytics_agent": "analytics_agent",
            "general_assistant": "general_assistant",
        }
    )
    workflow.add_edge("campaign_agent", END)
    workflow.add_edge("analytics_agent", END)
    workflow.add_edge("general_assistant", END)

    return workflow.compile()

# Each agent uses OpenAI for intelligent responses
async def campaign_agent(state: KigoProAgentState) -> KigoProAgentState:
    llm = get_llm()  # ChatOpenAI with lazy initialization

    # Intelligent processing with context awareness
    system_prompt = f"""You are a Kigo Pro Campaign Specialist.
    Current context: {state.get('context', {})}
    Help with ad creation step by step."""

    response = await llm.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_input)
    ])

    # Return intelligent response + action calls
    return {
        **state,
        "messages": messages + [AIMessage(content=response.content)],
        "workflow_data": {
            "pending_actions": [
                {
                    "action_name": "navigateToAdCreation",
                    "parameters": {"adType": "display"}
                }
            ]
        }
    }
```

### FastAPI Backend Implementation

```python
# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage

app = FastAPI(title="Kigo Pro LangGraph Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supervisor_workflow = create_supervisor_workflow()

@app.post("/api/copilotkit/chat")
async def handle_copilotkit_chat(request: CopilotKitRequest):
    try:
        app_context = {
            "currentPage": request.context.get("currentPage", "/"),
            "userRole": request.context.get("userRole", "user"),
            "campaignData": request.context.get("campaignData", {}),
        }

        # Invoke LangGraph supervisor workflow
        result = await supervisor_workflow.ainvoke({
            "messages": [HumanMessage(content=request.message)],
            "context": app_context
        })

        # Extract AI response and pending actions
        ai_message = None
        for msg in reversed(result["messages"]):
            if msg.__class__.__name__ == "AIMessage":
                ai_message = msg.content
                break

        pending_actions = []
        if result.get("workflow_data", {}).get("pending_actions"):
            pending_actions = result["workflow_data"]["pending_actions"]

        return CopilotKitResponse(
            message=ai_message or "I'm not sure how to respond to that.",
            actions=pending_actions
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Frontend Integration Pattern

```typescript
// Frontend: CopilotKit actions still available for execution
export function useCopilotActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Navigation Action - Executed when LangGraph requests it
  useCopilotAction({
    name: "navigateToAdCreation",
    description: "Navigate user to ad creation page",
    parameters: [
      { name: "adType", type: "string", required: false },
    ],
    handler: async ({ adType = "display" }) => {
      console.log("[CopilotActions] 🚀 Navigating to ad creation:", adType);

      dispatch(setCurrentPage("/campaign-manager/ads-create"));
      router.push("/campaign-manager/ads-create");

      return `Perfect! I've taken you to the ad creation page for ${adType} ads.`;
    },
  });

  // Other actions (createAd, navigateToAnalytics, etc.)
  // ...
}

// Provider setup - actions registered but only called by LangGraph
function NavigationBridge() {
  useCopilotActions(); // Register actions for LangGraph to call

  useCopilotReadable({
    description: "Complete application state for intelligent assistance",
    value: {
      currentPage: pathname,
      campaignData: campaignState,
      // ... other context
    },
  });

  return <ApprovalWorkflowUI />;
}
```

## State Management Integration

### LangGraph State → Redux Updates Pattern

```typescript
// Frontend action executor called by Python backend response
async function executeActionsFromLangGraph(actions: PendingAction[]) {
  for (const action of actions) {
    try {
      // Find and execute the registered CopilotKit action
      const actionHandler = getRegisteredAction(action.action_name);
      if (actionHandler) {
        const result = await actionHandler.handler(action.parameters);

        // Update Redux state if needed
        if (action.state_updates) {
          action.state_updates.forEach((update) => dispatch(update));
        }
      }
    } catch (error) {
      console.error(`Failed to execute action ${action.action_name}:`, error);
    }
  }
}
```

## **Context Engineering (Future Optimization)**

_Note: These patterns are for future agent refinement after feature parity_

### Context Problems We May Encounter:

1. **Token Accumulation**: Tool observations appending to message history
2. **Context Distraction**: Model overfocusing on long context
3. **Context Confusion**: Irrelevant information affecting behavior
4. **Context Clash**: Contradictory information in context window

### 6 Context Engineering Techniques:

1. **RAG** - Selective information retrieval
2. **Tool Loadout** - Dynamic tool selection based on context
3. **Context Quarantine** - Multi-agent isolation (we're already doing this!)
4. **Context Pruning** - Remove irrelevant info with LLM
5. **Context Summarization** - Compress context (risky - info loss)
6. **Context Offloading** - Store outside LLM context using LangGraph state

### Future Implementation Priorities:

1. **Context Offloading**: Use LangGraph state for conversation memory
2. **Tool Loadout**: Context-aware CopilotKit action selection
3. **Context Pruning**: For very long tool responses (if needed)

## Implementation Priorities

### Phase 1: Feature Parity ⭐ **Current Focus**

1. ✅ Python LangGraph backend with intelligent agents
2. 🔄 LangGraph agents calling CopilotKit actions as tools
3. 🔄 Action execution bridge (Python → Frontend)
4. 🔄 Complete workflow: User message → LangGraph → Actions → UI updates

### Phase 2: Advanced Features

1. Human-in-the-Loop workflows
2. Conversation memory persistence
3. Multi-turn workflow support
4. Error recovery and retry logic

### Phase 3: Optimization

1. Context engineering implementation
2. Performance optimizations
3. Advanced state management
4. Production deployment

## LangGraph Studio Integration

### Benefits of Python Implementation:

- ✅ **Full chat mode support** - Studio works immediately with messages field
- ✅ **Visual graph debugging** - See agent routing and decision flow
- ✅ **Better ecosystem** - Python AI/ML libraries
- ✅ **Proven patterns** - Matches CopilotKit examples

### Studio Configuration:

```json
// backend/langgraph.json
{
  "dependencies": [".", "python-dotenv"],
  "graphs": {
    "supervisor": "./app/agents/supervisor.py:create_supervisor_workflow"
  },
  "env": ".env"
}
```

## Testing Patterns

### Python LangGraph Testing

```python
# Test agent workflows
def test_campaign_agent_workflow():
    workflow = create_supervisor_workflow()

    result = await workflow.ainvoke({
        "messages": [HumanMessage(content="I want to create an ad")],
        "context": {"currentPage": "/", "userRole": "admin"}
    })

    assert result["user_intent"] == "ad_creation"
    assert result["agent_decision"] == "campaign_agent"
    assert "pending_actions" in result["workflow_data"]
```

## Common Pitfalls & Solutions

### Pitfall 1: Mixing TypeScript and Python LangGraph

**Problem**: Inconsistent patterns between JS/TS and Python implementations
**Solution**: Choose Python LangGraph for Studio compatibility and ecosystem benefits

### Pitfall 2: Action Execution Timing

**Problem**: CopilotKit actions called directly instead of through LangGraph
**Solution**: Route ALL messages through Python backend, let LangGraph decide actions

### Pitfall 3: Context Format Mismatches

**Problem**: Python expects different message format than TypeScript
**Solution**: Use proper LangChain message objects (HumanMessage, AIMessage)

### Pitfall 4: Missing LangGraph Studio Visualization

**Problem**: Studio shows disconnected nodes
**Solution**: Use explicit edge mapping in add_conditional_edges

## Performance Considerations

### Python Backend Optimization

- Lazy LLM initialization to avoid startup API calls
- Async/await for all LLM calls
- Proper error handling and fallbacks
- Connection pooling for database operations

### Action Execution Efficiency

- Batch related actions for efficient execution
- Implement action prioritization for time-sensitive operations
- Use async action execution where appropriate

---

_Last Updated: January 2025_  
_Based on: CopilotKit CoAgents analysis, LangGraph best practices, and context engineering research_
