# CopilotKit → LangGraph Connection Debug

**Date**: October 16, 2025  
**Issue**: CopilotKit responses don't match LangGraph Studio output  
**Status**: 🔧 Debugging in progress

---

## 🔍 Problem Identified

CopilotKit is returning responses with **legacy merchant context** (McDonald's, CVS, Target) instead of routing through your LangGraph backend.

### Evidence:

- **LangGraph Studio Response** ✅: "Hello! I'd be happy to help you create an effective promotional offer for John Deere members..."
- **CopilotKit Response** ❌: "I notice that John Deere is not in the list of available merchants... McDonald's, CVS Health, Target, Starbucks..."

This means CopilotKit is falling back to Anthropic with injected context instead of using your LangGraph agent.

---

## 🔧 Fixes Applied

### 1. **Added Frontend Logging** (`/app/api/copilotkit/route.ts`)

```typescript
export const POST = async (req: NextRequest) => {
  console.log("🔵 [CopilotKit API] POST request received");
  console.log(`🔗 [CopilotKit API] LangGraph URL: ${langGraphUrl}`);

  // Force using agents when available
  agents: ["supervisor"], // ← NEW: Forces agent usage
}
```

### 2. **Added Backend Logging** (`/backend/copilotkit_server.py`)

```python
print("=" * 80)
print("🔵 [LangGraph Backend] POST /copilotkit - REQUEST RECEIVED")
print("=" * 80)
```

### 3. **Identified Legacy Context Source**

The legacy merchants are injected by:

- `/lib/copilot-kit/provider.tsx` line 133: `availableMerchants: ["McDonald's", "Starbucks", "Target", "CVS"]`
- `/lib/hooks/useCopilotActions.ts` line 24-28: `DEMO_MERCHANTS` array

When CopilotKit can't reach LangGraph (or uses the Anthropic fallback), it uses this context.

---

## ✅ How to Test

### Step 1: **Verify Backend is Running**

```bash
ps aux | grep "copilotkit_server.py"
```

You should see:

```
python copilotkit_server.py
```

**Port**: 8000  
**Endpoint**: `http://localhost:8000/copilotkit`

### Step 2: **Test Backend Directly**

```bash
curl -X POST http://localhost:8000/copilotkit \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Create a 20% discount for John Deere"}]}'
```

You should see backend logs:

```
================================================================================
🔵 [LangGraph Backend] POST /copilotkit - REQUEST RECEIVED
================================================================================
```

### Step 3: **Hard Refresh Browser**

- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

This loads the new API route code with logging.

### Step 4: **Send Message in UI**

1. Go to `http://localhost:3001/offer-manager`
2. Click "Show AI Assistant"
3. Type: "Create a 20% discount for John Deere"
4. **WATCH BOTH TERMINALS**

### Step 5: **Check Logs**

**Frontend Terminal (Next.js):**

```
🔵 [CopilotKit API] POST request received
🔗 [CopilotKit API] LangGraph URL: http://localhost:8000/copilotkit
✅ [CopilotKit API] Routing to handleRequest
```

**Backend Terminal (Python):**

```
================================================================================
🔵 [LangGraph Backend] POST /copilotkit - REQUEST RECEIVED
================================================================================
[CopilotKit] Received request keys: ['messages', ...]
[CopilotKit] Messages count: 1
[CopilotKit] Converted messages: ['Create a 20% discount for John Deere']
```

---

## 🎯 Expected Behavior

### ✅ If Working Correctly:

1. Frontend logs appear
2. Backend logs appear
3. LangGraph processes the request
4. Response matches LangGraph Studio output
5. Steps stream in OfferProgressViewer

### ❌ If Still Broken:

1. Frontend logs appear
2. **Backend logs DON'T appear** ← CopilotKit not reaching backend
3. Response has legacy merchant context
4. No steps appear

---

## 🐛 Troubleshooting

### Issue: Backend Logs Don't Appear

**Cause**: CopilotKit can't reach `http://localhost:8000/copilotkit`

**Solutions**:

1. Check backend is running: `ps aux | grep copilotkit`
2. Test endpoint directly: `curl http://localhost:8000/copilotkit/info`
3. Check CORS settings in `copilotkit_server.py`
4. Verify port 8000 is not blocked

### Issue: "Method Not Allowed" Error

**Cause**: Wrong HTTP method or endpoint

**Solutions**:

1. Ensure using POST `/copilotkit` (not GET)
2. Check `copilotkit_server.py` has `@app.post("/copilotkit")`
3. Restart backend: `pkill -f copilotkit_server && python copilotkit_server.py`

### Issue: Agent Not Being Invoked

**Cause**: CopilotKit using Anthropic fallback

**Solutions**:

1. Check `agents: ["supervisor"]` is in API route
2. Verify `LangGraphHttpAgent` URL is correct
3. Temporarily remove Anthropic fallback to force agent usage

---

## 🔄 Quick Fix: Restart Everything

```bash
# Kill all processes
pkill -f "copilotkit_server"
pkill -f "npm run dev"

# Start backend
cd /Users/dpoon/Documents/Kigo/Repo/kigo-pro-dashboard/backend
python copilotkit_server.py &

# Start frontend
cd /Users/dpoon/Documents/Kigo/Repo/kigo-pro-dashboard
PORT=3001 npm run dev
```

---

## 📊 Request Flow Diagram

```
User Types Message
       ↓
useCoAgent("supervisor") hook
       ↓
CopilotKit React Context
       ↓
POST /api/copilotkit
       ↓
API Route (route.ts)
  ├─ Log: "🔵 [CopilotKit API] POST request received"
  ├─ LangGraphHttpAgent configured
  └─ agents: ["supervisor"] ← Forces agent use
       ↓
HTTP POST → http://localhost:8000/copilotkit
       ↓
Backend (copilotkit_server.py)
  ├─ Log: "🔵 [LangGraph Backend] REQUEST RECEIVED"
  ├─ Convert messages to LangGraph format
  └─ await workflow.ainvoke(...)
       ↓
LangGraph Supervisor Workflow
  ├─ supervisor_agent (intent detection)
  ├─ route_to_agent() → "offer_manager_agent"
  └─ offer_manager_agent processes request
       ↓
Response streams back
       ↓
useCoAgent state updates
       ↓
OfferProgressViewer shows steps ✅
```

---

## 🚀 Next Steps

1. **Test the connection** using the steps above
2. **Check logs** in both terminals
3. **Report back** what you see in the logs
4. If backend logs appear → Connection works! Just need to ensure steps stream properly
5. If backend logs DON'T appear → Need to debug HTTP connection

---

## 📝 Notes

- Backend currently running: `copilotkit_server.py` (PID 25284)
- Frontend URL: `http://localhost:3001`
- Backend URL: `http://localhost:8000`
- Agent name: `supervisor`
- Workflow: `create_supervisor_workflow()` → routes to `offer_manager_agent`

---

**Ready to test!** Hard refresh your browser and send a message, then check both terminals for the log output.
