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
        print("=" * 80)
        print("🔵 [LangGraph Backend] POST /copilotkit - REQUEST RECEIVED")
        print("=" * 80)
        print(f"[CopilotKit] Received request keys: {list(request.keys())}")
        print(f"[CopilotKit] Messages count: {len(request.get('messages', []))}")
        
        try:
            # Extract messages and invoke your existing workflow
            raw_messages = request.get("messages", [])
            
            # Convert to proper LangGraph message format
            from langchain_core.messages import HumanMessage, AIMessage
            converted_messages = []
            
            for msg in raw_messages:
                if isinstance(msg, dict):
                    role = msg.get("role", "user")
                    content = msg.get("content", "")
                    
                    # Ensure content is a string
                    if isinstance(content, list):
                        content = ' '.join(str(item) for item in content)
                    elif not isinstance(content, str):
                        content = str(content)
                    
                    if role == "user":
                        converted_messages.append(HumanMessage(content=content))
                    elif role == "assistant":
                        converted_messages.append(AIMessage(content=content))
                else:
                    # Handle other message formats
                    converted_messages.append(HumanMessage(content=str(msg)))
            
            print(f"[CopilotKit] Converted messages: {[msg.content for msg in converted_messages]}")
            
            if converted_messages:
                # Invoke your workflow with proper message format using async method
                result = await workflow.ainvoke({
                    "messages": converted_messages,
                    "context": {"currentPage": "/", "userRole": "admin"},
                    "user_intent": "",
                    "agent_decision": "",
                    "workflow_data": {},
                })
                
                # Return messages in expected format
                response_messages = result.get("messages", [])
                return {
                    "messages": [
                        {"role": "assistant", "content": msg.content} 
                        for msg in response_messages 
                        if hasattr(msg, 'content')
                    ]
                }
            
            return {"messages": [{"role": "assistant", "content": "Hello! How can I help you today?"}]}
            
        except Exception as e:
            print(f"[CopilotKit] Error processing request: {e}")
            return {
                "messages": [
                    {"role": "assistant", "content": f"I apologize, but I encountered an error: {str(e)}. Please try again."}
                ]
            }
    
    @app.options("/copilotkit")
    async def copilotkit_options():
        """Handle CORS preflight requests for /copilotkit endpoint"""
        return {"status": "ok"}

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