"""
FastAPI + LangGraph Backend for Kigo Pro Dashboard

Official CopilotKit integration pattern using CopilotKit SDK
"""

import os
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import uvicorn

# CopilotKit Official SDK imports (DISABLED due to compatibility issues)
# from copilotkit.integrations.fastapi import add_fastapi_endpoint
# from copilotkit import CopilotKitRemoteEndpoint, LangGraphAgent
from dotenv import load_dotenv

from app.agents.supervisor import create_supervisor_workflow

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Kigo Pro LangGraph Backend",
    description="Python FastAPI + LangGraph backend for Kigo Pro dashboard",
    version="1.0.0"
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware to debug CopilotKit requests
@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.time()
    print(f"🔍 [Request] {request.method} {request.url.path}")
    if request.headers.get("content-type") == "application/json":
        body = await request.body()
        if body:
            print(f"📝 [Body Preview] {str(body[:200])}")
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"⏱️ [Response] {request.method} {request.url.path} - {response.status_code} in {process_time:.2f}s")
    return response

# Initialize LangGraph workflow
supervisor_workflow = create_supervisor_workflow()

# Pydantic models for CopilotKit compatibility
class Message(BaseModel):
    role: str
    content: str

class CopilotKitRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = {}

class ApprovalRequest(BaseModel):
    thread_id: str
    approval_decision: str  # "approved" or "rejected"

class CopilotKitResponse(BaseModel):
    message: str
    actions: Optional[List[Dict[str, Any]]] = []
    # Human-in-the-loop fields
    requires_approval: Optional[bool] = False
    pending_action: Optional[Dict[str, Any]] = None
    thread_id: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Kigo Pro LangGraph Backend is running!"}

# CopilotKit main runtime endpoint - expects POST at root when using external runtime URL
@app.post("/")
async def copilotkit_runtime(request: CopilotKitRequest):
    """
    CopilotKit main runtime endpoint - processes chat messages through LangGraph
    This is the endpoint CopilotKit calls when runtimeUrl is set to http://localhost:8000
    """
    try:
        # Extract app context (same structure as TypeScript version)
        app_context = {
            "currentPage": request.context.get("currentPage", "/"),
            "userRole": request.context.get("userRole", "user"),
            "campaignData": request.context.get("campaignData", {}),
            "sessionId": request.context.get("sessionId", f"session_{os.urandom(8).hex()}"),
        }

        # Import HumanMessage for proper message format
        from langchain_core.messages import HumanMessage
        
        # Create thread config for resumable execution
        thread_config = {
            "configurable": {
                "thread_id": app_context["sessionId"]
            }
        }
        
        print(f"[CopilotKit Root] 🎯 Processing message: {request.message}")
        print(f"[CopilotKit Root] 📋 Context: {app_context}")
        
        # Invoke LangGraph supervisor workflow with proper message format
        result = await supervisor_workflow.ainvoke(
            {
                "messages": [HumanMessage(content=request.message)],
                "context": app_context
            },
            config=thread_config
        )

        # Extract AI response from LangGraph result
        ai_message = None
        print(f"[DEBUG] LangGraph result keys: {list(result.keys())}")
        
        if result.get("messages"):
            for i, msg in enumerate(reversed(result["messages"])):
                # Check if it's an AIMessage using type checking
                if msg.__class__.__name__ == "AIMessage":
                    ai_message = msg.content
                    print(f"[DEBUG] Found AIMessage with content: {msg.content}")
                    break
                elif isinstance(msg, dict) and msg.get("role") == "assistant":
                    ai_message = msg.get("content")
                    break

        # Check if approval is required (workflow was interrupted)
        requires_approval = result.get("requires_approval", False)
        pending_action = result.get("pending_action")
        
        if requires_approval and pending_action:
            print(f"[DEBUG] Approval required for action: {pending_action.get('description', 'Unknown action')}")
            return CopilotKitResponse(
                message=ai_message or "I need your approval to proceed.",
                requires_approval=True,
                pending_action=pending_action,
                thread_id=app_context["sessionId"]
            )
        
        # Extract any executed actions from workflow data
        executed_actions = []
        if result.get("workflow_data", {}).get("actions"):
            executed_actions = result["workflow_data"]["actions"]
        elif result.get("workflow_data", {}).get("pending_actions"):
            executed_actions = result["workflow_data"]["pending_actions"]

        return CopilotKitResponse(
            message=ai_message or "I'm not sure how to respond to that.",
            actions=executed_actions
        )

    except Exception as e:
        print(f"[CopilotKit Root] ❌ Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "langgraph": "ready"}

@app.post("/copilotkit")
async def handle_copilotkit_chat(request: CopilotKitRequest):
    """
    CopilotKit-compatible endpoint that processes chat messages through LangGraph
    """
    try:
        # Extract app context (same structure as TypeScript version)
        app_context = {
            "currentPage": request.context.get("currentPage", "/"),
            "userRole": request.context.get("userRole", "user"),
            "campaignData": request.context.get("campaignData", {}),
            "sessionId": request.context.get("sessionId", f"session_{os.urandom(8).hex()}"),
        }

        # Import HumanMessage for proper message format
        from langchain_core.messages import HumanMessage
        
        # Create thread config for resumable execution
        thread_config = {
            "configurable": {
                "thread_id": app_context["sessionId"]
            }
        }
        
        # Invoke LangGraph supervisor workflow with proper message format
        result = await supervisor_workflow.ainvoke(
            {
                "messages": [HumanMessage(content=request.message)],
                "context": app_context
            },
            config=thread_config
        )

        # Extract AI response from LangGraph result
        ai_message = None
        print(f"[DEBUG] LangGraph result keys: {list(result.keys())}")
        print(f"[DEBUG] Messages in result: {result.get('messages', [])}")
        
        if result.get("messages"):
            for i, msg in enumerate(reversed(result["messages"])):
                print(f"[DEBUG] Message {i}: type={type(msg)}, hasattr _getType={hasattr(msg, '_getType')}")
                if hasattr(msg, '_getType'):
                    print(f"[DEBUG] Message {i} _getType: {msg._getType()}")
                if hasattr(msg, 'content'):
                    print(f"[DEBUG] Message {i} content: {msg.content}")
                    
                # Check if it's an AIMessage using type checking
                if msg.__class__.__name__ == "AIMessage":
                    ai_message = msg.content
                    print(f"[DEBUG] Found AIMessage with content: {msg.content}")
                    break
                elif isinstance(msg, dict) and msg.get("role") == "assistant":
                    ai_message = msg.get("content")
                    break

        # Check if approval is required (workflow was interrupted)
        requires_approval = result.get("requires_approval", False)
        pending_action = result.get("pending_action")
        
        if requires_approval and pending_action:
            print(f"[DEBUG] Approval required for action: {pending_action.get('description', 'Unknown action')}")
            return CopilotKitResponse(
                message=ai_message or "I need your approval to proceed.",
                requires_approval=True,
                pending_action=pending_action,
                thread_id=app_context["sessionId"]
            )
        
        # Extract any executed actions from workflow data
        executed_actions = []
        if result.get("workflow_data", {}).get("actions"):
            executed_actions = result["workflow_data"]["actions"]

        return CopilotKitResponse(
            message=ai_message or "I'm not sure how to respond to that.",
            actions=executed_actions
        )

    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/copilotkit/approve")
async def handle_approval(request: ApprovalRequest):
    """
    Handle user approval/rejection of pending actions
    """
    try:
        from langchain_core.messages import HumanMessage
        
        # Create thread config to resume the specific conversation
        thread_config = {
            "configurable": {
                "thread_id": request.thread_id
            }
        }
        
        print(f"[Approval] Resuming thread {request.thread_id} with decision: {request.approval_decision}")
        
        # Resume the workflow with the approval decision
        result = await supervisor_workflow.ainvoke(
            {
                "approval_status": request.approval_decision,
                "messages": []  # No new message, just approval
            },
            config=thread_config
        )
        
        # Extract AI response
        ai_message = None
        if result.get("messages"):
            for msg in reversed(result["messages"]):
                if msg.__class__.__name__ == "AIMessage":
                    ai_message = msg.content
                    break
        
        # Extract any executed actions
        executed_actions = []
        if result.get("workflow_data", {}).get("actions"):
            executed_actions = result["workflow_data"]["actions"]
        
        return CopilotKitResponse(
            message=ai_message or "Action processed.",
            actions=executed_actions
        )
        
    except Exception as e:
        print(f"Error processing approval: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# CopilotKit Discovery Endpoints
@app.get("/info")
async def copilotkit_info_get():
    """CopilotKit info endpoint for agent discovery (GET)"""
    return {
        "actions": [],
        "agents": [
            {
                "name": "supervisor",
                "description": "Kigo Pro multi-agent supervisor that routes to campaign, analytics, filter, and merchant specialists"
            }
        ]
    }

@app.post("/info")
async def copilotkit_info_post():
    """CopilotKit info endpoint for agent discovery (POST)"""
    return {
        "actions": [],
        "agents": [
            {
                "name": "supervisor", 
                "description": "Kigo Pro multi-agent supervisor that routes to campaign, analytics, filter, and merchant specialists"
            }
        ]
    }

# Official CopilotKit endpoint pattern
@app.get("/copilotkit/info")
async def copilotkit_info_get():
    """Official CopilotKit info endpoint for agent discovery (GET)"""
    return {
        "actions": [],
        "agents": [
            {
                "name": "supervisor",
                "description": "Kigo Pro multi-agent supervisor that routes to campaign, analytics, filter, and merchant specialists",
                "type": "langgraph"
            }
        ]
    }

@app.post("/copilotkit/info")
async def copilotkit_info_post():
    """Official CopilotKit info endpoint for agent discovery (POST)"""
    return {
        "actions": [],
        "agents": [
            {
                "name": "supervisor",
                "description": "Kigo Pro multi-agent supervisor that routes to campaign, analytics, filter, and merchant specialists", 
                "type": "langgraph"
            }
        ]
    }

class CopilotKitAgentRequest(BaseModel):
    name: str
    threadId: str
    messages: List[Dict[str, Any]]
    state: Dict[str, Any] = {}
    config: Dict[str, Any] = {}
    properties: Dict[str, Any] = {}
    actions: List[Dict[str, Any]] = []

@app.post("/agents/execute")
async def execute_agent(request: CopilotKitAgentRequest):
    """Execute LangGraph agent - handles CopilotKit's actual request format"""
    print(f"[Python LangGraph] 🎯 AGENT EXECUTION - {request.name}")
    print(f"[Python LangGraph] 📝 Thread ID: {request.threadId}")
    print(f"[Python LangGraph] 📝 Messages: {len(request.messages)} messages")
    
    try:
        # Extract the user's last message
        user_message = ""
        for msg in reversed(request.messages):
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break
        
        print(f"[Python LangGraph] 💬 User message: {user_message}")
        
        # Route to supervisor workflow (using async)
        result = await supervisor_workflow.ainvoke({
            "messages": [{"type": "human", "content": user_message}],
            "user_intent": "general",
            "context": {"threadId": request.threadId, "copilotkit_state": request.state},
            "agent_decision": request.name
        })
        
        print(f"[Python LangGraph] ✅ Workflow result: {result}")
        
        # Extract the final response
        if "messages" in result and result["messages"]:
            last_message = result["messages"][-1]
            response_content = last_message.content if hasattr(last_message, 'content') else str(last_message)
        else:
            response_content = str(result)
            
        return {
            "result": {
                "message": response_content,
                "workflow_data": result
            },
            "status": "completed"
        }
        
    except Exception as e:
        print(f"[Python LangGraph] ❌ Agent execution error: {e}")
        return {
            "result": {"error": str(e)},
            "status": "failed"
        }

# ============================================================================
# OFFICIAL COPILOTKIT SDK INTEGRATION (DISABLED - Compatibility Issues)
# ============================================================================

# NOTE: The official CopilotKit SDK has compatibility issues with our LangGraph version
# Keeping our custom integration that works with CopilotKit frontend

# print("🚀 Setting up Official CopilotKit SDK Integration...")

# # Create CopilotKit agent wrapper for the supervisor workflow
# kigo_agent = LangGraphAgent(
#     name="kigo_supervisor",
#     description="Kigo Pro multi-agent supervisor that handles campaigns, analytics, filters, and merchant workflows",
#     graph=supervisor_workflow,
# )

# # Initialize CopilotKit Remote Endpoint
# copilotkit_endpoint = CopilotKitRemoteEndpoint(
#     agents=[kigo_agent],
#     actions=[]  # Can add custom actions here if needed
# )

# # Add the official CopilotKit FastAPI endpoint
# add_fastapi_endpoint(
#     app, 
#     copilotkit_endpoint, 
#     "/copilotkit_remote", 
#     max_workers=10
# )

# print("✅ CopilotKit SDK Integration Complete!")
# print("📡 Available at: http://localhost:8000/copilotkit_remote")

# Official CopilotKit agent execution endpoint
@app.post("/copilotkit/agents/execute")
async def copilotkit_agents_execute(request: CopilotKitAgentRequest):
    """Official CopilotKit agents execution endpoint - proxies to our main handler"""
    return await execute_agent(request)

print("✅ Kigo Pro LangGraph Backend Ready!")
print("📡 Available endpoints:")
print("  - /info & /copilotkit/info (CopilotKit agent discovery)")
print("  - /agents/execute & /copilotkit/agents/execute (CopilotKit agent execution)")
print("  - /copilotkit (Chat endpoint)")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
