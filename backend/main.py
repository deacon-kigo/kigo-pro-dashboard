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

class CopilotKitResponse(BaseModel):
    message: str
    actions: Optional[List[Dict[str, Any]]] = []

@app.get("/")
async def root():
    return {"message": "Kigo Pro LangGraph Backend is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "langgraph": "ready"}

@app.post("/api/copilotkit/chat")
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

        # Invoke LangGraph supervisor workflow
        result = await supervisor_workflow.ainvoke({
            "messages": [{"role": "human", "content": request.message}],
            "context": app_context
        })

        # Extract AI response from LangGraph result
        ai_message = None
        if result.get("messages"):
            for msg in reversed(result["messages"]):
                if hasattr(msg, '_getType') and msg._getType() == "ai":
                    ai_message = msg.content
                    break
                elif isinstance(msg, dict) and msg.get("role") == "assistant":
                    ai_message = msg.get("content")
                    break

        # Extract any pending actions from workflow data
        pending_actions = []
        if result.get("workflowData", {}).get("pendingActions"):
            pending_actions = result["workflowData"]["pendingActions"]

        return CopilotKitResponse(
            message=ai_message or "I'm not sure how to respond to that.",
            actions=pending_actions
        )

    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
