# CopilotKit + LangGraph Architecture Patterns & Best Practices

## Overview

This document captures proven patterns for implementing CopilotKit with LangGraph in React/Next.js applications, based on analysis of CoAgents examples and production implementation experience.

## Core Architecture Patterns

### Pattern 1: LangGraph-First Orchestration ✅ **Recommended**

**Concept**: LangGraph as master orchestrator calling CopilotKit actions as tools

```typescript
// ✅ CORRECT: LangGraph orchestrates, CopilotKit actions as tools
// Backend API Route
const runtime = new CopilotRuntime({
  actions: [
    {
      name: "handleUserMessage",
      handler: async ({ message, context }) => {
        // Route ALL messages to LangGraph supervisor
        const workflow = createSupervisorWorkflow();
        const result = await workflow.invoke({
          messages: [new HumanMessage(message)],
          context: extractAppContext(context),
        });

        // Execute actions requested by LangGraph
        if (result.workflowData?.pendingActions) {
          await executeQueuedActions(result.workflowData.pendingActions);
        }

        return result.messages[result.messages.length - 1].content;
      },
    },
  ],
});
```

**Benefits**:

- LangGraph maintains conversation memory and complex workflows
- CopilotKit actions serve as tools for UI interaction
- Complete state synchronization between agent and app
- Proper error handling and recovery workflows
- Scalable for multi-agent systems

### Pattern 2: Frontend-First Actions ❌ **Anti-Pattern**

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

### LangGraph Agent Structure

**Pattern**: Multi-agent system with supervisor routing

```typescript
// services/agents/supervisor.ts
const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("supervisor", supervisorAgent)
  .addNode("campaign_agent", campaignAgent)
  .addNode("analytics_agent", analyticsAgent)
  .addConditionalEdges("supervisor", routeToAgent)
  .addEdge("campaign_agent", END);

// Each agent can call CopilotKit actions
const campaignAgent = async (state: AgentState) => {
  // Complex workflow logic
  const analysis = await analyzeUserRequirements(state);

  return {
    messages: [...state.messages, response],
    workflowData: {
      pendingActions: [
        {
          actionName: "navigateToAdCreation",
          parameters: { adType: analysis.recommendedType },
          expectsResult: true,
        },
      ],
    },
  };
};
```

### State Management Integration

**Pattern**: Shared state between LangGraph and application

```typescript
// Frontend: CoAgents shared state
const { state, setState } = useCoAgent<CampaignState>("campaign_agent");

// LangGraph: Emit state updates
await copilotkit_emit_state(config, {
  currentStep: "gathering_requirements",
  adRequirements: extractedRequirements,
  progress: 0.3
});

// Frontend: Render agent state in UI
useCoAgentStateRender({
  name: "campaign_agent",
  render: ({ state }) => (
    <ProgressBar
      step={state.currentStep}
      progress={state.progress}
      requirements={state.adRequirements}
    />
  )
});
```

### Action Execution Bridge

**Pattern**: LangGraph requests actions, frontend executes and reports back

```typescript
// lib/copilot-kit/action-executor.ts
export async function executeQueuedActions(actions: QueuedAction[]) {
  const results = [];

  for (const action of actions) {
    try {
      const result = await executeAction(action);
      results.push({
        actionName: action.actionName,
        success: true,
        result,
      });

      // Update Redux state
      if (action.stateUpdates) {
        action.stateUpdates.forEach((update) => {
          dispatch(update);
        });
      }
    } catch (error) {
      results.push({
        actionName: action.actionName,
        success: false,
        error: error.message,
      });
    }
  }

  // Report results back to LangGraph
  return results;
}
```

### Backend Runtime Configuration

**Pattern**: Minimal backend that routes to LangGraph

```typescript
// app/api/copilotkit/route.ts
const runtime = new CopilotRuntime({
  actions: [
    {
      name: "handleUserMessage",
      description: "Process all user messages through LangGraph system",
      parameters: [
        { name: "message", type: "string", required: true },
        { name: "context", type: "object", required: false },
      ],
      handler: async ({ message, context }) => {
        // Extract app context
        const appContext = {
          currentPage: context?.currentPage || "/",
          userRole: context?.userRole || "user",
          campaignData: context?.campaignData || {},
          uiState: context?.uiState || {},
        };

        // Initialize LangGraph workflow
        const workflow = createSupervisorWorkflow();

        const result = await workflow.invoke({
          messages: [new HumanMessage(message)],
          appContext,
          sessionId: context?.sessionId || generateSessionId(),
        });

        // Execute any requested actions
        if (result.workflowData?.pendingActions) {
          const actionResults = await executeQueuedActions(
            result.workflowData.pendingActions
          );

          // Store results for next agent turn
          await storeActionResults(context?.sessionId, actionResults);
        }

        return result.messages[result.messages.length - 1].content;
      },
    },
  ],
});
```

## AI Instructions Best Practices

### LangGraph-Aware Instructions

```typescript
// ✅ GOOD: Instructions that leverage LangGraph capabilities
instructions={`You are a sophisticated AI assistant powered by LangGraph multi-agent system.

🧠 **Your Capabilities:**
• Multi-turn conversation memory and context awareness
• Complex workflow orchestration across multiple steps
• Collaboration with specialist agents (Campaign, Analytics, Filter)
• Human-in-the-loop breakpoints for important decisions
• Real-time state synchronization with the application

🎯 **How You Work:**
• Analyze user intent and route to appropriate specialist agent
• Maintain complete conversation context across all interactions
• Call CopilotKit actions when UI changes are needed
• Use specialist agents for complex domain-specific tasks
• Implement approval workflows for sensitive operations

🚀 **Available Actions:**
• navigateToAdCreation - Take users to ad creation page
• createAd - Create ads with full campaign details
• requestApproval - Show human-in-the-loop approval UI
• updateCampaignState - Modify ongoing campaign workflows

**Remember**: You orchestrate complex workflows, not just simple responses.`}
```

## State Management Patterns

### LangGraph State Structure

```typescript
interface EnhancedAgentState {
  // Core LangGraph state
  messages: BaseMessage[];
  userIntent: string;
  agentDecision: string;
  conversationPhase: string;

  // Complete app context
  appContext: {
    ui: {
      currentPage: string;
      activeModal: string | null;
      isLoading: boolean;
    };
    campaign: {
      currentStep: number;
      formData: any;
      ads: any[];
    };
    user: {
      role: string;
      permissions: string[];
    };
  };

  // Action coordination
  pendingActions: CopilotAction[];
  actionResults: ActionResult[];

  // Workflow state
  workflowData: {
    phase: string;
    requirements: any;
    progress: number;
    errors: any[];
  };
}
```

### Redux Integration Pattern

```typescript
// LangGraph agents can read Redux state via context
const campaignAgent = async (state: AgentState) => {
  const { appContext } = state;
  const currentAds = appContext.campaign.ads;
  const userRole = appContext.user.role;

  // Make decisions based on app state
  if (currentAds.length > 5 && userRole === "basic") {
    return {
      agentDecision: "require_upgrade",
      pendingActions: [
        {
          actionName: "showUpgradeModal",
          parameters: { reason: "ad_limit_reached" },
        },
      ],
    };
  }

  // Continue normal workflow
  return {
    /* ... */
  };
};
```

## Advanced Patterns

### Human-in-the-Loop Workflows

```typescript
// LangGraph agent requests human approval
const campaignAgent = async (state: AgentState) => {
  if (state.workflowData.requiresApproval) {
    return {
      messages: [...state.messages, approvalRequest],
      pendingActions: [{
        actionName: "requestApproval",
        parameters: {
          workflowType: "campaign_creation",
          data: state.workflowData.campaignData,
          approvalLevel: "manager"
        },
        expectsResult: true // Wait for human decision
      }]
    };
  }
};

// Frontend renders approval UI
useCopilotAction({
  name: "requestApproval",
  renderAndWait: ({ args, handler }) => (
    <ApprovalWorkflowUI
      workflowType={args.workflowType}
      data={args.data}
      onApprove={(decision) => handler({ approved: true, decision })}
      onReject={(reason) => handler({ approved: false, reason })}
    />
  )
});
```

### Error Recovery Patterns

```typescript
// LangGraph handles errors and recovery
const errorRecoveryAgent = async (state: AgentState) => {
  const failedActions = state.actionResults.filter((r) => !r.success);

  if (failedActions.length > 0) {
    const recoveryStrategy = determineRecoveryStrategy(failedActions);

    return {
      agentDecision: "error_recovery",
      workflowData: {
        recoveryStrategy,
        retryAttempts: state.workflowData.retryAttempts + 1,
      },
      pendingActions: generateRecoveryActions(recoveryStrategy),
    };
  }
};
```

## Testing Patterns

### LangGraph Workflow Testing

```typescript
describe("Campaign Agent Workflow", () => {
  it("should handle ad creation workflow", async () => {
    const workflow = createSupervisorWorkflow();

    const result = await workflow.invoke({
      messages: [new HumanMessage("Create an ad for McDonald's")],
      appContext: mockAppContext,
    });

    expect(result.agentDecision).toBe("campaign_agent");
    expect(result.pendingActions).toContainEqual({
      actionName: "navigateToAdCreation",
      parameters: expect.objectContaining({
        adType: expect.any(String),
      }),
    });
  });
});
```

## Common Pitfalls & Solutions

### Pitfall 1: Bypassing LangGraph

**Problem**: Calling CopilotKit actions directly from AI
**Solution**: Route all messages through LangGraph supervisor

### Pitfall 2: State Synchronization Issues

**Problem**: Frontend and agent state becoming inconsistent
**Solution**: Use CoAgents shared state pattern with proper emission

### Pitfall 3: Missing Conversation Memory

**Problem**: Each interaction starting fresh
**Solution**: Maintain complete conversation history in LangGraph state

### Pitfall 4: Poor Error Handling

**Problem**: Actions fail silently or break the workflow
**Solution**: Implement comprehensive error recovery in LangGraph agents

## Performance Considerations

### State Optimization

- Only emit necessary state changes to frontend
- Use selective state updates rather than full state replacement
- Implement state compression for large datasets

### Action Batching

- Group related actions for efficient execution
- Implement action prioritization for time-sensitive operations
- Use async action execution where appropriate

---

_Last Updated: January 2025_  
_Based on: CoAgents documentation analysis & LangGraph best practices_
