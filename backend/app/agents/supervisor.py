"""
Kigo Pro Supervisor Agent - Python LangGraph Implementation

Converted from TypeScript version to leverage better Python LangGraph Studio support.
This supervisor analyzes user intent and routes to appropriate specialist agents.
"""

from typing import TypedDict, Annotated, List, Any, Optional
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
import asyncio
import os
import re
from datetime import datetime

# Initialize OpenAI model
llm = ChatOpenAI(
    model="gpt-4-turbo",
    temperature=0.7,
    max_tokens=1000,
)

# State definition
class KigoProAgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    user_intent: str
    context: dict
    agent_decision: str
    workflow_data: dict
    error: Optional[str]

async def detect_user_intent(user_input: str, context: dict) -> str:
    """
    AI-powered intent detection using OpenAI LLM
    """
    current_page = context.get("currentPage", "/")
    
    intent_prompt = f"""You are an intent classifier for the Kigo Pro advertising platform. 
Analyze the user's message and classify it into one of these categories:

**Available Intents:**
- ad_creation: User wants to create a new ad or advertising campaign
- analytics_query: User wants to see performance data, metrics, or reports  
- filter_management: User wants to create/manage product filters or targeting
- merchant_support: User needs help with merchant account or business setup
- general_assistance: General questions or help requests

**Context:**
- Current page: {current_page}
- User message: "{user_input}"

Respond with ONLY the intent category name (e.g., "ad_creation"). No explanation needed."""

    try:
        response = await llm.ainvoke([
            SystemMessage(content=intent_prompt),
            HumanMessage(content=user_input)
        ])
        
        intent = response.content.strip().lower()
        
        # Validate intent
        valid_intents = ["ad_creation", "analytics_query", "filter_management", "merchant_support", "general_assistance"]
        if intent in valid_intents:
            return intent
        else:
            return "general_assistance"
            
    except Exception as e:
        print(f"Intent detection error: {e}")
        # Fallback to keyword detection
        user_input_lower = user_input.lower()
        if any(word in user_input_lower for word in ["create ad", "new ad", "campaign", "advertisement"]):
            return "ad_creation"
        elif any(word in user_input_lower for word in ["analytics", "performance", "metrics", "report", "stats"]):
            return "analytics_query"
        elif any(word in user_input_lower for word in ["filter", "targeting", "audience", "segment"]):
            return "filter_management"
        elif any(word in user_input_lower for word in ["merchant", "business", "account", "setup"]):
            return "merchant_support"
        return "general_assistance"

def extract_workflow_data(user_input: str, intent: str) -> dict:
    """Extract relevant data from user input based on intent"""
    import re
    from datetime import datetime
    
    data = {
        "timestamp": datetime.now().isoformat(),
        "intent": intent,
        "raw_input": user_input,
    }
    
    if intent == "ad_creation":
        # Extract budget if mentioned
        budget_match = re.search(r'\$?(\d+(?:,\d{3})*(?:\.\d{2})?)', user_input)
        if budget_match:
            data["budget"] = float(budget_match.group(1).replace(",", ""))
        
        # Extract business type
        business_types = ["restaurant", "retail", "pharmacy", "automotive", "technology", "healthcare", "finance"]
        for btype in business_types:
            if btype in user_input.lower():
                data["business_type"] = btype
                break
        
        # Extract target audience
        audiences = ["families", "students", "professionals", "seniors", "millennials", "gen z"]
        for audience in audiences:
            if audience in user_input.lower():
                data["target_audience"] = audience
                break
    
    return data

def determine_agent_routing(intent: str, context: dict) -> str:
    """Determine which agent to route to based on intent and context"""
    routing_map = {
        "ad_creation": "campaign_agent",
        "campaign_creation": "campaign_agent", 
        "campaign_optimization": "campaign_agent",
        "filter_management": "filter_agent",
        "analytics_query": "analytics_agent",
        "merchant_support": "merchant_agent",
    }
    
    return routing_map.get(intent, "general_assistant")

async def supervisor_agent(state: KigoProAgentState) -> KigoProAgentState:
    """
    Supervisor Agent - analyzes user input and routes to appropriate specialist agents
    """
    try:
        messages = state.get("messages", [])
        context = state.get("context", {})
        
        # Ensure we have complete context
        full_context = {
            "currentPage": context.get("currentPage", "studio"),
            "userRole": context.get("userRole", "admin"), 
            "sessionId": context.get("sessionId", f"session_{os.urandom(4).hex()}"),
            "campaignData": context.get("campaignData", {}),
        }
        
        # Handle empty messages
        if not messages:
            return {
                "agent_decision": "general_assistant",
                "context": full_context,
                "messages": messages,
                "user_intent": "",
                "workflow_data": {},
            }
        
        # Get latest user message
        latest_message = messages[-1]
        user_input = latest_message.content if hasattr(latest_message, 'content') else str(latest_message)
        
        # Analyze user intent
        intent = await detect_user_intent(user_input, full_context)
        
        # Determine routing decision
        decision = determine_agent_routing(intent, full_context)
        
        print(f"[Supervisor] Intent: {intent}, Routing to: {decision}")
        
        return {
            "user_intent": intent,
            "agent_decision": decision,
            "context": full_context,
            "workflow_data": extract_workflow_data(user_input, intent),
            "messages": messages,
        }
        
    except Exception as error:
        print(f"Supervisor agent error: {error}")
        return {
            "agent_decision": "error_handler",
            "error": str(error),
            "messages": state.get("messages", []),
            "user_intent": "",
            "context": state.get("context", {}),
            "workflow_data": {},
        }

def route_to_agent(state: KigoProAgentState) -> str:
    """Route to appropriate agent based on supervisor decision"""
    return state["agent_decision"]

async def general_assistant(state: KigoProAgentState) -> KigoProAgentState:
    """General Assistant Agent (fallback)"""
    messages = state["messages"]
    
    response = AIMessage(content="""I'm here to help you with the Kigo Pro platform! I can assist you with:

• Creating and optimizing advertising campaigns
• Managing product filters and targeting  
• Analyzing campaign performance and analytics
• Merchant account setup and support

What would you like to work on today?""")
    
    return {
        **state,
        "messages": messages + [response],
    }

async def campaign_agent(state: KigoProAgentState) -> KigoProAgentState:
    """Campaign Agent - handles ad creation and campaign management"""
    messages = state["messages"]
    intent = state.get("user_intent", "")
    
    if intent == "ad_creation":
        response = AIMessage(content="""🚀 **Let's create an ad!** I'll help you gather the requirements:

1. **Ad name** - What should we call this ad?
2. **Target merchant** - Which business is this for?
3. **Offer details** - What's the promotion or offer?
4. **Media type** - Image, video, or text ad?
5. **Cost structure** - Cost per activation/redemption

What's the name for your new ad?""")
    else:
        response = AIMessage(content="""📢 **Campaign Management**

I can help you with:
• Creating new advertising campaigns
• Optimizing existing campaigns  
• Managing ad targeting and audiences
• Setting up cost structures and budgets

What specific campaign task would you like help with?""")
    
    return {
        **state,
        "messages": messages + [response],
    }

async def error_handler(state: KigoProAgentState) -> KigoProAgentState:
    """Error Handler Agent"""
    messages = state["messages"]
    error = state.get("error", "Unknown error occurred")
    
    response = AIMessage(content=f"""I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.

Error: {error}""")
    
    return {
        **state,
        "messages": messages + [response],
    }

async def filter_agent(state: KigoProAgentState) -> KigoProAgentState:
    """Filter Agent - handles product filter management"""
    messages = state["messages"]
    
    response = AIMessage(content="""🎯 **Product Filter Management**

I can help you create and manage product filters! Here's what I can do:

• **Create new filters** - Define targeting criteria
• **Edit existing filters** - Modify filter rules  
• **Analyze coverage** - See how many products match
• **Optimize performance** - Improve filter efficiency

What specific filtering task would you like help with?""")
    
    return {
        **state,
        "messages": messages + [response],
    }

async def analytics_agent(state: KigoProAgentState) -> KigoProAgentState:
    """Analytics Agent - handles performance analytics and reporting"""
    messages = state["messages"]
    
    response = AIMessage(content="""📊 **Campaign Analytics & Insights**

I can help you analyze your campaign performance! Here's what I can do:

• **Performance reports** - ROI, conversions, click-through rates
• **Trend analysis** - Track performance over time
• **Optimization suggestions** - Improve campaign results  
• **Custom dashboards** - Personalized analytics views

What specific metrics would you like to analyze?""")
    
    return {
        **state,
        "messages": messages + [response],
    }

async def merchant_agent(state: KigoProAgentState) -> KigoProAgentState:
    """Merchant Agent - handles merchant support and guidance"""
    messages = state["messages"]
    
    response = AIMessage(content="""🏪 **Merchant Support & Guidance**

I'm here to help with merchant-related questions! I can assist with:

• **Account setup** - Getting merchants onboarded
• **Best practices** - Optimization tips and strategies
• **Troubleshooting** - Resolving common issues
• **Feature guidance** - How to use platform features

What merchant-related question can I help you with?""")
    
    return {
        **state,
        "messages": messages + [response],
    }

def create_supervisor_workflow():
    """Create and return the compiled supervisor workflow"""
    
    # Build the workflow
    workflow = StateGraph(KigoProAgentState)
    
    # Add all nodes
    workflow.add_node("supervisor", supervisor_agent)
    workflow.add_node("campaign_agent", campaign_agent)
    workflow.add_node("general_assistant", general_assistant)
    workflow.add_node("error_handler", error_handler)
    workflow.add_node("filter_agent", filter_agent)
    workflow.add_node("analytics_agent", analytics_agent)
    workflow.add_node("merchant_agent", merchant_agent)
    
    # Set entry point
    workflow.set_entry_point("supervisor")
    
    # Add conditional edges from supervisor
    workflow.add_conditional_edges("supervisor", route_to_agent)
    
    # All agents end the workflow
    workflow.add_edge("campaign_agent", END)
    workflow.add_edge("general_assistant", END)
    workflow.add_edge("error_handler", END)
    workflow.add_edge("filter_agent", END)
    workflow.add_edge("analytics_agent", END)
    workflow.add_edge("merchant_agent", END)
    
    # Compile and return
    compiled = workflow.compile()
    
    print("🎯 Python LangGraph Supervisor Workflow compiled successfully!")
    return compiled
