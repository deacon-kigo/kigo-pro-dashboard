#!/usr/bin/env python3
"""
Minimal CopilotKit Server
Serves the existing supervisor workflow without any changes to agent logic
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Add the current directory to Python path for imports
sys.path.insert(0, os.path.dirname(__file__))

# Import your existing supervisor workflow
from app.agents.supervisor import create_supervisor_workflow

# Skip CopilotKit FastAPI integration for now - fix the import issue later
COPILOTKIT_AVAILABLE = False
print("ℹ️  Using manual CopilotKit endpoints (bypassing import issue)")

app = FastAPI(title="Kigo Pro CopilotKit Server", version="1.0.0")

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create your existing workflow (no changes needed)
workflow = create_supervisor_workflow()

if COPILOTKIT_AVAILABLE:
    # Add CopilotKit API endpoints that wrap your existing workflow
    add_copilotkit_api(
        app,
        agents={
            "supervisor": workflow  # Your existing supervisor workflow
        },
        default_agent="supervisor"
    )
    print("✅ CopilotKit API endpoints added")
else:
    # Manual CopilotKit endpoints (bypass import issue)
    @app.get("/copilotkit/info")
    async def copilotkit_info():
        return {
            "agents": ["supervisor"],
            "actions": []
        }
    
    @app.post("/copilotkit")
    async def copilotkit_chat(request: dict):
        """Manual CopilotKit chat endpoint"""
        print(f"[CopilotKit] Received request: {request}")
        
        # Extract messages and invoke your existing workflow
        messages = request.get("messages", [])
        if messages:
            # Convert to your workflow format and invoke
            result = workflow.invoke({
                "messages": messages,
                "context": {"currentPage": "/", "userRole": "admin"},
                "user_intent": "",
                "agent_decision": "",
                "workflow_data": {},
            })
            return {"messages": result.get("messages", [])}
        
        return {"messages": []}

@app.get("/")
async def root():
    return {"message": "Kigo Pro CopilotKit Server", "status": "ready"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "workflow": "ready"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting CopilotKit server...")
    print("📍 Serving on: http://localhost:8000")
    print("🔗 CopilotKit endpoint: http://localhost:8000/copilotkit")
    uvicorn.run(app, host="0.0.0.0", port=8000) 