# Kigo Pro Dashboard - CopilotKit + LangGraph Implementation Notes

## Project Overview

This document captures the specific implementation details for the Kigo Pro dashboard's CopilotKit + LangGraph integration, including current state, working features, and project-specific considerations.

## Current Implementation Status

### ❌ **Current Issue: Incorrect Architecture**

- **Problem**: LangGraph agents are built but NOT being used
- **Current Flow**: CopilotKit AI → Frontend Actions (bypassing LangGraph entirely)
- **Result**: No conversation memory, no complex workflows, no agent collaboration

### ✅ **Built and Ready (LangGraph Assets)**

- **Multi-Agent System**: Supervisor, Campaign, Analytics, Filter, Merchant agents
- **Complex Workflows**: Multi-step ad creation with conversation flow
- **State Management**: Sophisticated LangGraph state structure
- **Business Logic**: Requirements extraction, progress tracking, validation
- **Intent Detection**: LLM-based user intent classification

### 🚧 **Needs Integration**

- **Backend Routing**: Route CopilotKit messages to LangGraph supervisor
- **Action Execution**: LangGraph agents calling CopilotKit actions as tools
- **State Synchronization**: CoAgents shared state between LangGraph and frontend
- **Error Recovery**: LangGraph handling action execution failures

## Required Architecture Fix

### **Correct Flow (Needed)**

```
User Input → CopilotKit → LangGraph Supervisor → Specialist Agents → Call CopilotKit Actions → UI Updates
```

### **Current Flow (Wrong)**

```
User Input → CopilotKit AI → Frontend Actions → Redux (No LangGraph)
```

## LangGraph Agent System Analysis

### **Supervisor Agent** (`services/agents/supervisor.ts`)

- **Purpose**: Analyzes intent and routes to specialist agents
- **Capabilities**: Intent detection, agent routing, context management
- **Status**: ✅ Built, ❌ Not integrated

### **Campaign Agent** (`services/agents/campaign-agent.ts`)

- **Purpose**: Handles complex ad creation workflows
- **Capabilities**:
  - Multi-step conversation flow (name → merchant → offer → create)
  - Requirements extraction and validation
  - Progress tracking across turns
  - Redux integration (currently direct store.dispatch)
- **Current Issue**: Calls Redux directly instead of via CopilotKit actions
- **Status**: ✅ Sophisticated workflow built, ❌ Needs action integration

### **Other Agents** (Analytics, Filter, Merchant)

- **Status**: ✅ Stub implementations ready for enhancement

## Redux State Integration Analysis

### **Current Redux Structure (Source of Truth)**

```typescript
{
  ui: {
    currentPage: string,           // LangGraph needs this context
    notifications: Notification[], // Actions update this
    activeModal: Modal | null,     // Actions control this
    isLoading: boolean            // Agent workflows control this
  },
  campaign: {
    currentStep: number,          // LangGraph tracks workflow progress
    formData: {
      ads: Ad[],                  // Agents create and modify ads
      budget: Budget,             // Agents analyze and recommend
      basicInfo: BasicInfo        // Agents extract from conversation
    }
  },
  agent: {
    activeWorkflows: Record<>,    // LangGraph workflow tracking
    interactions: [],             // LangGraph conversation history
    sharedContext: {}            // Bidirectional state sync
  }
}
```

### **Required State Bridge**

```typescript
// LangGraph agents need context FROM Redux
const appContext = {
  currentPage: reduxState.ui.currentPage,
  campaignData: reduxState.campaign.formData,
  userRole: reduxState.user.profile.role,
  // Complete app context
};

// LangGraph agents update Redux VIA CopilotKit actions
return {
  pendingActions: [
    {
      actionName: "createAd",
      parameters: { adData },
      stateUpdates: [
        { type: "campaign/addAd", payload: adData },
        { type: "ui/addNotification", payload: successMessage },
      ],
    },
  ],
};
```

## Business Logic and Domain Knowledge

### **Available Merchants**: McDonald's, Starbucks, Target, CVS

### **Supported Ad Types**: display, video, social

### **Default Costs**: $0.50 per activation, $2.00 per redemption

### **Campaign Agent Workflow** (Already Built)

1. **Intent Detection**: "Create an ad" → navigate to ad creation
2. **Requirements Gathering**: Name, merchant, offer, media type, costs
3. **Progress Tracking**: Show completion status across conversation turns
4. **Validation**: Ensure all required fields before creation
5. **Ad Creation**: Generate complete ad object and add to campaign
6. **Confirmation**: Success notification and next steps

## Implementation Plan

### **Phase 1: Backend Integration** (Priority 1)

1. **Update API Route** (`app/api/copilotkit/route.ts`)

   ```typescript
   // Route ALL messages to LangGraph
   const runtime = new CopilotRuntime({
     actions: [
       {
         name: "handleUserMessage",
         handler: async ({ message, context }) => {
           const workflow = createSupervisorWorkflow();
           return await workflow.invoke({
             messages: [new HumanMessage(message)],
             appContext: extractAppContext(context),
           });
         },
       },
     ],
   });
   ```

2. **Context Extraction** (`lib/copilot-kit/context-extractor.ts`)
   ```typescript
   export function extractAppContext(request) {
     return {
       currentPage: request.headers["x-current-page"],
       campaignData: JSON.parse(request.headers["x-campaign-data"] || "{}"),
       userRole: request.headers["x-user-role"],
       // Extract complete Redux state context
     };
   }
   ```

### **Phase 2: Action Integration** (Priority 1)

3. **Action Execution Bridge** (`lib/copilot-kit/action-executor.ts`)

   ```typescript
   export async function executeQueuedActions(actions: QueuedAction[]) {
     for (const action of actions) {
       try {
         const result = await executeAction(action);
         // Update Redux based on action.stateUpdates
         // Report success back to LangGraph
       } catch (error) {
         // Report failure back to LangGraph for recovery
       }
     }
   }
   ```

4. **Campaign Agent Enhancement**
   - Replace direct `store.dispatch()` calls with `pendingActions`
   - Add action result expectations
   - Enhance error recovery workflows

### **Phase 3: State Synchronization** (Priority 2)

5. **CoAgents Integration**

   ```typescript
   // Frontend shared state
   const { state, setState } = useCoAgent<CampaignState>("campaign_agent");

   // LangGraph state emission
   await copilotkit_emit_state(config, {
     currentStep: "gathering_requirements",
     progress: 0.6,
     adRequirements: extractedData,
   });
   ```

6. **UI State Rendering**
   ```typescript
   useCoAgentStateRender({
     name: "campaign_agent",
     render: ({ state }) => (
       <CampaignProgress
         step={state.currentStep}
         progress={state.progress}
         requirements={state.adRequirements}
       />
     )
   });
   ```

## Testing Scenarios (Updated for LangGraph)

| User Input                              | Expected LangGraph Flow                               | Expected Result                    |
| --------------------------------------- | ----------------------------------------------------- | ---------------------------------- |
| "i want to create an ad"                | Supervisor → Campaign Agent → Navigation Action       | Navigate + start conversation flow |
| "create ad for McDonald's with 20% off" | Campaign Agent → Extract requirements → Create Action | Ad created with full details       |
| "show me analytics"                     | Supervisor → Analytics Agent → Navigation Action      | Navigate to analytics dashboard    |
| "I need approval for budget change"     | Supervisor → Human-in-Loop Action                     | Approval workflow UI appears       |

### **Multi-turn Conversation Test**

```
User: "create an ad"
Agent: "I'll help you create an ad! Let me take you to the ad creation page."
→ Action: navigateToAdCreation
→ LangGraph State: conversationPhase = "ad_creation_started"

User: "McDonald's"
Agent: "Great choice! McDonald's is a popular merchant. What offer would you like to promote?"
→ LangGraph State: adRequirements = { merchant: "McDonald's" }

User: "20% off meals"
Agent: "Perfect! 20% off meals is an attractive offer. What should we name this ad?"
→ LangGraph State: adRequirements = { merchant: "McDonald's", offer: "20% off meals" }

User: "Summer Sale"
Agent: "Excellent! Creating your 'Summer Sale' ad for McDonald's..."
→ Action: createAd with complete parameters
→ LangGraph State: conversationPhase = "ad_created"
```

## Error Scenarios (LangGraph Handled)

### **Action Execution Failures**

- **Navigation fails** → LangGraph agent tries alternative approach
- **Ad creation fails** → Agent suggests corrections or manual creation
- **Permission denied** → Agent escalates to approval workflow

### **Conversation Recovery**

- **User changes mind mid-flow** → Agent adapts workflow dynamically
- **Invalid requirements** → Agent guides user to provide correct information
- **Timeout/interruption** → Agent resumes from last known state

## Performance Considerations

### **State Optimization**

- Only emit essential state changes to frontend
- Compress large datasets before transmission
- Use selective Redux updates

### **Action Batching**

- Group related actions for efficient execution
- Prioritize time-sensitive operations
- Implement retry logic for failed actions

## Current File Structure

### **Core LangGraph Files (Built, Not Used)**

```
services/agents/
├── supervisor.ts              # Master routing agent
├── campaign-agent.ts          # Ad creation workflows
├── analytics-agent.ts         # Analytics assistance (stub)
├── filter-agent.ts           # Filter management (stub)
└── merchant-agent.ts         # Merchant support (stub)

services/ai/
├── intent-detection.ts       # LLM-based intent classification
└── response-templates.ts     # Structured response system
```

### **Frontend Integration Files (Need Updates)**

```
lib/hooks/
├── useCopilotActions.ts      # Actions (currently bypassing LangGraph)
├── useHumanInTheLoop.ts      # HITL workflows
└── useSuggestionPills.ts     # Contextual suggestions

lib/copilot-kit/
└── provider.tsx              # Integration hub (needs LangGraph connection)

app/api/copilotkit/
└── route.ts                  # API endpoint (needs LangGraph routing)
```

## Next Steps Priority Order

### **Immediate (This Sprint)**

1. ✅ **Route API messages to LangGraph** supervisor
2. ✅ **Add context extraction** from frontend to LangGraph
3. ✅ **Implement action execution** bridge
4. ✅ **Test basic LangGraph flow** with campaign agent

### **Short-term (Next Sprint)**

1. ✅ **Enhanced state synchronization** with CoAgents
2. ✅ **Error recovery workflows** in LangGraph agents
3. ✅ **Human-in-the-loop integration** with approval flows
4. ✅ **Performance optimization** for action execution

### **Medium-term (Next Month)**

1. ✅ **Advanced multi-agent workflows** (Analytics, Filter agents)
2. ✅ **Complex conversation management** across multiple sessions
3. ✅ **Integration testing** for complete user journeys
4. ✅ **Production deployment** and monitoring

## Expected Benefits After Integration

### **Conversation Intelligence**

✅ Multi-turn memory and context awareness  
✅ Complex workflow orchestration across sessions  
✅ Intelligent agent collaboration and routing

### **Enhanced User Experience**

✅ Guided workflows with progress tracking  
✅ Context-aware suggestions and assistance  
✅ Seamless transitions between different tasks

### **Robust Error Handling**

✅ Automatic recovery from failed actions  
✅ Graceful degradation when services unavailable  
✅ Human escalation when automation insufficient

---

_Last Updated: January 2025_  
_Architecture Status: 🔄 LangGraph Built → Integration Required_  
_Priority: 🚨 Critical - Core architecture needs fixing_
