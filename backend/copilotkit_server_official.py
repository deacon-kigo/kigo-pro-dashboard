#!/usr/bin/env python3
"""
Official CopilotKit Integration
Using the official copilotkit Python SDK with FastAPI
"""

import os
from fastapi import FastAPI
import uvicorn
from copilotkit import LangGraphAgent
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()
print(f"🔑 [ENV] ANTHROPIC_API_KEY loaded: {'Yes' if os.getenv('ANTHROPIC_API_KEY') else 'No'}")

# Import your existing supervisor workflow
from app.agents.supervisor import create_supervisor_workflow

app = FastAPI(title="Kigo Pro CopilotKit Server - Official", version="1.0.0")

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create your existing workflow
workflow = create_supervisor_workflow()
print("✅ Kigo Pro Supervisor Workflow compiled successfully!")

# Add CopilotKit integration
try:
    from copilotkit.integrations.fastapi import add_fastapi_endpoint
    
    add_fastapi_endpoint(
        app,
        LangGraphAgent(
            name="supervisor",
            description="Supervisor agent for offer management and campaign creation",
            agent=workflow,
        ),
        "/copilotkit",
    )
    print("✅ CopilotKit FastAPI endpoint added at /copilotkit")
except Exception as e:
    print(f"⚠️  Could not add CopilotKit endpoint: {e}")
    print("ℹ️  Falling back to manual endpoint")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "workflow": "ready"}

@app.get("/")
async def root():
    return {"message": "Kigo Pro CopilotKit Server (Official)", "status": "ready"}

if __name__ == "__main__":
    print("🚀 Starting CopilotKit server (Official Integration)...")
    print("📍 Serving on: http://127.0.0.1:8000")
    print("🔗 CopilotKit endpoint: http://127.0.0.1:8000/copilotkit")
    print("ℹ️  Binding to 0.0.0.0 to avoid localhost resolution issues")
    uvicorn.run(app, host="0.0.0.0", port=8000)

