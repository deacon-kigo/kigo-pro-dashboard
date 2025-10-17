# CopilotKit → LangGraph Routing Fix

## 🐛 **Problem**

CopilotKit ChatUI was bypassing LangGraph and falling back to Anthropic directly, responding with legacy merchant context (McDonald's, CVS, Target) instead of the current merchant context (John Deere).

## 🔍 **Root Cause**

1. **Frontend Actions Interference**: `NavigationBridge` was calling:

   - `useCopilotActions()` - Registered frontend actions with legacy merchant data
   - `useMarketingInsightsCopilot()` - More frontend actions
   - `useCopilotReadable()` - Provided context to frontend

2. **Result**: When these frontend actions were registered, CopilotKit would:

   - See the actions available
   - Execute them directly using `AnthropicAdapter`
   - **Bypass LangGraph entirely**

3. **API Route Configuration**: Used `LangGraphHttpAgent` with explicit `agents` array, but this wasn't preventing the frontend action fallback.

## ✅ **Solution**

Based on the [CopilotKit travel example](https://github.com/CopilotKit/CopilotKit/tree/main/examples/coagents-travel):

### **1. Removed Frontend Actions**

**File**: `lib/copilot-kit/provider.tsx`

```tsx
// BEFORE (Problematic):
useCopilotActions(); // ❌ Registers frontend actions with legacy context
useMarketingInsightsCopilot(); // ❌ More frontend actions
useCopilotReadable({ ... }); // ❌ Provides context to frontend

// AFTER (Fixed):
// All commented out - LangGraph handles everything server-side
```

**Why this matters:**

- Frontend actions bypass LangGraph
- CopilotKit executes them directly via AnthropicAdapter
- Legacy context (McDonald's, CVS) was hardcoded in these actions

### **2. Updated API Route Pattern**

**File**: `app/api/copilotkit/route.ts`

```typescript
// BEFORE (agents array):
const runtime = new CopilotRuntime({
  agents: {
    supervisor: new LangGraphHttpAgent({
      url: langGraphUrl,
    }),
  },
});

// AFTER (remoteEndpoints array - matches travel example):
const remoteEndpoint = copilotKitEndpoint({
  url: langGraphUrl,
});

const runtime = new CopilotRuntime({
  remoteEndpoints: [remoteEndpoint],
});
```

**Why this matters:**

- `copilotKitEndpoint()` is the recommended pattern from CopilotKit examples
- `remoteEndpoints` ensures requests are properly routed
- ServiceAdapter (Anthropic) now only serves as fallback

## 📊 **Architecture Comparison**

### **❌ Old (Broken) Architecture:**

```
User Input → CopilotKit
              ↓
         Frontend Actions? (useCopilotActions)
              ↓ YES
         AnthropicAdapter (WRONG!)
              ↓
         Legacy Context (McDonald's, CVS)
```

### **✅ New (Fixed) Architecture:**

```
User Input → CopilotKit
              ↓
         No Frontend Actions
              ↓
         remoteEndpoint (copilotKitEndpoint)
              ↓
         LangGraph Backend (http://localhost:8000)
              ↓
         Supervisor Agent → Offer Manager Agent
              ↓
         Current Context (John Deere, etc.)
```

## 🧪 **Testing**

### **Before Fix:**

```
User: "Create a 20% discount for John Deere"
CopilotKit: "John Deere is not available. Choose from: McDonald's, CVS, Target..."
```

### **After Fix:**

```
User: "Create a 20% discount for John Deere"
LangGraph: "Great! Let me help you create that offer. A few questions..."
```

## 📝 **Key Learnings**

1. **Don't Mix Frontend and Backend Actions**: When using LangGraph agents, avoid registering frontend actions with `useCopilotActions()`. Let LangGraph handle everything.

2. **Use Correct Endpoint Pattern**: Use `copilotKitEndpoint()` with `remoteEndpoints` array, not `LangGraphHttpAgent` with `agents` object.

3. **ServiceAdapter is Fallback Only**: The `AnthropicAdapter` should only be used when LangGraph is unreachable, not for executing frontend actions.

4. **Follow Official Examples**: The [CopilotKit examples](https://github.com/CopilotKit/CopilotKit/tree/main/examples) are the best reference for proper integration patterns.

## 🔗 **References**

- [CopilotKit Travel Example](https://github.com/CopilotKit/CopilotKit/tree/main/examples/coagents-travel)
- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)

## 🐛 **Additional Issue: Missing GET Endpoint**

### **Problem**

After removing frontend actions, CopilotKit was failing with:

```
ERROR: Failed to fetch actions from url
status: 405
body: "{"detail":"Method Not Allowed"}"
```

### **Root Cause**

CopilotKit's `copilotKitEndpoint()` requires the backend to implement:

- **GET /copilotkit** - Fetch available agents/actions
- **POST /copilotkit** - Handle chat messages
- **OPTIONS /copilotkit** - CORS preflight

Our backend only had POST and OPTIONS, missing the GET handler.

### **Solution**

Added GET endpoint to `backend/copilotkit_server.py`:

```python
@app.get("/copilotkit")
async def copilotkit_get():
    """Handle GET requests from CopilotKit to fetch available actions/agents"""
    print("🔵 [LangGraph Backend] GET /copilotkit - Fetching actions")
    return {
        "agents": [{
            "name": "supervisor",
            "description": "Supervisor agent for offer management and campaign creation"
        }],
        "actions": []  # No frontend actions - all handled by LangGraph
    }
```

## ✅ **Verification Steps**

1. **Verify Backend GET Endpoint**:

   ```bash
   curl http://localhost:8000/copilotkit
   # Should return: {"agents": [{"name": "supervisor", ...}], "actions": []}
   ```

2. **Hard Refresh Browser**: `Cmd + Shift + R`

3. **Open CopilotKit DevConsole**: (bottom-right, now enabled)

4. **Send Test Message**: "Create a 20% discount for John Deere"

5. **Check BOTH Terminals**:
   - **Frontend (3001)**: Should see POST logs
   - **Backend (8000)**: Should see GET + POST logs
6. **Verify Response**: Should come from LangGraph (not legacy context)
