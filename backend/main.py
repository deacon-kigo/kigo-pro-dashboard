"""
FastAPI + LangGraph Backend for Kigo Pro Dashboard

This replaces the Next.js API route and provides:
- CopilotKit-compatible endpoints
- LangGraph agent orchestration
- Better Studio integration
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import uvicorn
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

class AgentExecuteRequest(BaseModel):
    agent_name: str
    input: Dict[str, Any]

@app.post("/agents/execute")
async def execute_agent(request: AgentExecuteRequest):
    """Execute LangGraph agent - the endpoint CopilotKit calls"""
    print(f"[Python LangGraph] 🎯 AGENT EXECUTION - {request.agent_name}")
    print(f"[Python LangGraph] 📝 Input: {request.input}")
    
    try:
        # Route to supervisor workflow (using async)
        result = await supervisor_workflow.ainvoke({
            "messages": [{"type": "human", "content": str(request.input)}],
            "user_intent": "general",
            "context": request.input.get("context", {}),
            "agent_decision": request.agent_name
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
