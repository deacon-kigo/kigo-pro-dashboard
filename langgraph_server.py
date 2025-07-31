#!/usr/bin/env python3
"""
Simple LangGraph Server
Runs the supervisor workflow directly via FastAPI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio
import os
import sys
import uvicorn

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

from app.agents.supervisor import create_supervisor_workflow, KigoProAgentState
from langchain_core.messages import HumanMessage

app = FastAPI(title="LangGraph Server", version="1.0.0")

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global workflow instance
workflow = None

def get_workflow():
    """Get or create the workflow instance"""
    global workflow
    if workflow is None:
        workflow = create_supervisor_workflow()
    return workflow

class RunRequest(BaseModel):
    assistant_id: str
    input: Dict[str, Any]

class RunResponse(BaseModel):
    run_id: str
    status: str
    output: Dict[str, Any] = None

@app.on_event("startup")
async def startup_event():
    """Initialize the workflow on startup"""
    print("🚀 Starting LangGraph Server...")
    get_workflow()
    print("✅ LangGraph Server ready!")

@app.get("/")
async def root():
    return {"message": "LangGraph Server running", "version": "1.0.0"}

@app.post("/runs", response_model=RunResponse)
async def create_run(request: RunRequest):
    """Create and execute a run"""
    try:
        workflow = get_workflow()
        
        # Extract messages from request
        messages = request.input.get("messages", [])
        if not messages:
            raise HTTPException(status_code=400, detail="No messages provided")
        
        # Convert to HumanMessage objects
        human_messages = []
        for msg in messages:
            if msg.get("type") == "human":
                human_messages.append(HumanMessage(content=msg["content"]))
        
        if not human_messages:
            raise HTTPException(status_code=400, detail="No human messages found")
        
        # Create initial state
        initial_state: KigoProAgentState = {
            "messages": human_messages,
            "user_intent": "",
            "context": {"currentPage": "/", "userRole": "admin"},
            "agent_decision": "",  
            "workflow_data": {},
            "error": None,
            "pending_action": None,
            "approval_status": None,
            "requires_approval": None
        }
        
        # Run the workflow
        print(f"[LangGraph Server] 🎯 Processing: {human_messages[0].content}")
        
        # Use invoke to run the workflow synchronously
        result = workflow.invoke(initial_state)
        
        print(f"[LangGraph Server] ✅ Result: {result.get('agent_decision', 'unknown')}")
        
        # Generate run ID
        import uuid
        run_id = str(uuid.uuid4())
        
        return RunResponse(
            run_id=run_id,
            status="completed", 
            output=result
        )
        
    except Exception as e:
        print(f"[LangGraph Server] ❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/runs/{run_id}")
async def get_run(run_id: str):
    """Get run status (simplified for now)"""
    return {
        "run_id": run_id,
        "status": "completed",
        "created_at": "2024-01-01T00:00:00Z"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)