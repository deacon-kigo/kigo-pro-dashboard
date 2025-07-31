"""
Add CopilotKit endpoint to LangGraph Server
Simple FastAPI server that provides the /copilotkit endpoint
and forwards to your existing LangGraph workflow
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import httpx
import asyncio

app = FastAPI()

# CORS for CopilotKit
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CopilotKitMessage(BaseModel):
    role: str
    content: str

class CopilotKitRequest(BaseModel):
    messages: List[CopilotKitMessage]

@app.get("/copilotkit")
async def copilotkit_actions():
    """CopilotKit actions endpoint for action discovery"""
    print(f"[CopilotKit Endpoint] 📋 GET /copilotkit - Actions discovery request")
    response = {
        "actions": [],
        "agents": [
            {
                "name": "supervisor",
                "description": "Kigo Pro campaign management supervisor agent"
            }
        ]
    }
    print(f"[CopilotKit Endpoint] ✅ Returning actions: {response}")
    return response

@app.post("/copilotkit")
async def copilotkit_endpoint(request: CopilotKitRequest):
    """CopilotKit endpoint that provides intelligent responses"""
    try:
        # Get user message
        user_messages = [msg for msg in request.messages if msg.role == "user"]
        if not user_messages:
            return {"role": "assistant", "content": "Hello! I'm your Kigo Pro assistant. How can I help you today?"}
        
        message = user_messages[-1].content.lower()
        print(f"[CopilotKit Endpoint] 🚀 Message: {message}")
        
        # Simple intent detection and routing
        if any(word in message for word in ["create ad", "new ad", "campaign", "advertisement", "create campaign"]):
            response_content = """🎯 **Campaign Creation Assistant**

I can help you create a new advertising campaign! Here's how we'll proceed:

• **Campaign Setup** - Define your campaign goals and target audience
• **Ad Creative** - Design compelling ad content and visuals  
• **Budget & Targeting** - Set your budget and targeting parameters
• **Launch & Optimize** - Deploy your campaign and track performance

Would you like me to guide you through creating a new campaign step by step?"""
            
        elif any(word in message for word in ["analytics", "performance", "metrics", "report", "stats", "data"]):
            response_content = """📊 **Analytics & Performance**

I can help you analyze your campaign performance! Here's what I can show you:

• **Campaign Metrics** - CTR, conversions, spend analysis
• **Audience Insights** - Demographics and behavior patterns
• **Performance Trends** - Historical data and optimization opportunities
• **ROI Analysis** - Revenue attribution and profitability metrics

What specific analytics would you like to explore?"""
            
        elif any(word in message for word in ["filter", "targeting", "audience", "segment"]):
            response_content = """🎯 **Audience & Targeting**

I can help you refine your audience targeting! Available options:

• **Demographics** - Age, gender, location targeting
• **Interests** - Based on user behavior and preferences  
• **Custom Audiences** - Upload your customer lists
• **Lookalike Audiences** - Find similar high-value customers

What type of audience targeting would you like to set up?"""
            
        elif any(word in message for word in ["merchant", "business", "account", "setup"]):
            response_content = """🏪 **Merchant Support**

I'm here to help with your merchant account! I can assist with:

• **Account Setup** - Getting your business connected
• **Best Practices** - Optimization tips for better performance
• **Troubleshooting** - Resolving common issues
• **Feature Guidance** - How to use platform capabilities

What merchant-related question can I help you with?"""
            
        else:
            response_content = """👋 **Kigo Pro Assistant**

I'm your AI assistant for the Kigo Pro advertising platform! I can help you with:

🎯 **Campaign Creation** - Build new ads and campaigns
📊 **Analytics & Reports** - Track performance and insights  
🎪 **Audience Targeting** - Refine your targeting strategy
🏪 **Merchant Support** - Account help and best practices

What would you like to work on today?"""
        
        print(f"[CopilotKit Endpoint] ✅ Generated response for intent")
        
        return {
            "role": "assistant", 
            "content": response_content
        }
                
    except Exception as e:
        print(f"[CopilotKit Endpoint] ❌ Error: {e}")
        return {
            "role": "assistant",
            "content": "I'm here to help you with the Kigo Pro platform! How can I assist you today?"
        }

@app.get("/")
async def root():
    return {"message": "CopilotKit endpoint running on port 8001"}

@app.get("/copilotkit/info")
async def copilotkit_info_get():
    """CopilotKit info endpoint for runtime discovery (GET)"""
    print(f"[CopilotKit Endpoint] 📋 GET /copilotkit/info - Info discovery request")
    response = {
        "actions": [],
        "agents": [
            {
                "name": "supervisor",
                "description": "Kigo Pro campaign management supervisor agent"
            }
        ]
    }
    print(f"[CopilotKit Endpoint] ✅ Returning info: {response}")
    return response

@app.post("/copilotkit/info")
async def copilotkit_info_post():
    """CopilotKit info endpoint for runtime discovery (POST)"""
    print(f"[CopilotKit Endpoint] 📋 POST /copilotkit/info - Info discovery request")
    response = {
        "actions": [],
        "agents": [
            {
                "name": "supervisor",
                "description": "Kigo Pro campaign management supervisor agent"
            }
        ]
    }
    print(f"[CopilotKit Endpoint] ✅ Returning info: {response}")
    return response

class AgentExecuteRequest(BaseModel):
    agent_name: str
    input: Dict[str, Any]

@app.post("/copilotkit/agents/execute")
async def execute_agent(request: AgentExecuteRequest):
    """Execute LangGraph agent via LangGraph server"""
    print(f"[CopilotKit Endpoint] 🎯 AGENT EXECUTION - {request.agent_name}")
    print(f"[CopilotKit Endpoint] 📝 Input: {request.input}")
    
    try:
        # Forward to LangGraph server
        async with httpx.AsyncClient() as client:
            langgraph_request = {
                "assistant_id": request.agent_name,
                "input": request.input
            }
            
            print(f"[CopilotKit Endpoint] 🚀 Calling LangGraph server: {langgraph_request}")
            
            response = await client.post(
                "http://127.0.0.1:8123/runs",
                json=langgraph_request,
                timeout=30.0
            )
            
            if response.status_code == 200:
                run_data = response.json()
                print(f"[CopilotKit Endpoint] ✅ LangGraph response: {run_data}")
                
                # Return in format CopilotKit expects
                return {
                    "result": run_data,
                    "status": "completed"
                }
            else:
                print(f"[CopilotKit Endpoint] ❌ LangGraph error: {response.status_code} - {response.text}")
                return {
                    "result": {"error": f"LangGraph error: {response.status_code}"},
                    "status": "failed"
                }
                
    except Exception as e:
        print(f"[CopilotKit Endpoint] ❌ Agent execution error: {e}")
        return {
            "result": {"error": str(e)},
            "status": "failed"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)