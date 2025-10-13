"""
Kigo Pro Supervisor Agent - Python LangGraph Implementation

Converted from TypeScript version to leverage better Python LangGraph Studio support.
This supervisor analyzes user intent and routes to appropriate specialist agents.
"""

from typing import Annotated, List, Any, Optional
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_anthropic import ChatAnthropic
from langchain_core.runnables import RunnableConfig
import asyncio
import os
import re
from datetime import datetime

# Import CopilotKit state
try:
    from copilotkit import CopilotKitState
    COPILOTKIT_AVAILABLE = True
except ImportError:
    print("⚠️  CopilotKit not available, using fallback state")
    from typing import TypedDict
    from langgraph.graph.message import add_messages
    
    class CopilotKitState(TypedDict):
        messages: Annotated[List[BaseMessage], add_messages]
    
    COPILOTKIT_AVAILABLE = False

# Lazy initialization of Claude model
def get_llm():
    """Get ChatAnthropic instance with proper environment loading"""
    return ChatAnthropic(
        model="claude-3-5-sonnet-20241022",  # Claude 4 Sonnet latest version
        temperature=0.7,
        max_tokens=1000,
        api_key=os.getenv("ANTHROPIC_API_KEY")
    )

# State definition following CopilotKit pattern
class KigoProAgentState(CopilotKitState):
    """Kigo Pro Agent State extending CopilotKitState"""
    user_intent: Optional[str] = ""
    context: Optional[dict] = {}
    agent_decision: Optional[str] = ""
    workflow_data: Optional[dict] = {}
    error: Optional[str] = None
    # Human-in-the-loop fields
    pending_action: Optional[dict] = None  # Action waiting for approval
    approval_status: Optional[str] = None  # "pending", "approved", "rejected"
    requires_approval: Optional[bool] = None  # Flag to trigger interrupt

def detect_user_intent(user_input: str, context: dict) -> str:
    """
    AI-powered intent detection using OpenAI LLM
    """
    # Ensure user_input is a string (fix for LangGraph Studio compatibility)
    if isinstance(user_input, list):
        user_input = ' '.join(str(item) for item in user_input)
    elif not isinstance(user_input, str):
        user_input = str(user_input)
    
    current_page = context.get("currentPage", "/")
    
    intent_prompt = f"""You are an intent classifier for the Kigo Pro advertising platform. 
Analyze the user's message and classify it into one of these categories:

**Available Intents:**
- ad_creation: User wants to create a new ad or advertising campaign
- analytics_query: User wants to see performance data, metrics, or reports  
- filter_management: User wants to create/manage product filters or targeting
- merchant_support: User needs help with merchant account or business setup
- offer_management: User wants to create/manage offers, promotions, or deals
- general_assistance: General questions or help requests

**Context:**
- Current page: {current_page}
- User message: "{user_input}"

Respond with ONLY the intent category name (e.g., "ad_creation"). No explanation needed."""

    try:
        llm = get_llm()
        response = llm.invoke([
            SystemMessage(content=intent_prompt),
            HumanMessage(content=user_input)
        ])
        
        intent = response.content.strip().lower()
        
        # Validate intent
        valid_intents = ["ad_creation", "analytics_query", "filter_management", "merchant_support", "offer_management", "general_assistance"]
        if intent in valid_intents:
            return intent
        else:
            return "general_assistance"
            
    except Exception as e:
        print(f"Intent detection error: {e}")
        # Fallback to keyword detection with type safety
        try:
            user_input_lower = user_input.lower()
            if any(word in user_input_lower for word in ["create ad", "new ad", "campaign", "advertisement"]):
                return "ad_creation"
            elif any(word in user_input_lower for word in ["analytics", "performance", "metrics", "report", "stats"]):
                return "analytics_query"
            elif any(word in user_input_lower for word in ["filter", "targeting", "audience", "segment"]):
                return "filter_management"
            elif any(word in user_input_lower for word in ["merchant", "business", "account", "setup"]):
                return "merchant_support"
            elif any(word in user_input_lower for word in ["offer", "promotion", "deal", "discount", "coupon"]):
                return "offer_management"
        except Exception as fallback_error:
            print(f"Fallback intent detection error: {fallback_error}")
        return "general_assistance"

async def approval_node(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Node that handles human approval for actions - triggers interrupt"""
    print(f"[Approval] Action pending approval: {state.get('pending_action', {}).get('description', 'Unknown action')}")
    
    # This node will cause LangGraph to interrupt and wait for user input
    # When resumed, approval_status should be set to "approved" or "rejected"
    return {
        **state,
        "approval_status": "pending"
    }

async def execute_approved_action(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Execute the action after approval"""
    approval_status = state.get("approval_status")
    pending_action = state.get("pending_action")
    
    print(f"[Execute] Approval status: {approval_status}")
    
    if approval_status == "approved" and pending_action:
        print(f"[Execute] Executing approved action: {pending_action['action_name']}")
        
        # Return the action for CopilotKit to execute
        workflow_data = state.get("workflow_data", {})
        workflow_data["actions"] = [pending_action]
        workflow_data["approved"] = True
        
        return {
            **state,
            "workflow_data": workflow_data,
            "requires_approval": False,
            "pending_action": None
        }
    elif approval_status == "rejected":
        print("[Execute] Action rejected by user")
        
        # Continue conversation without executing action
        rejection_message = AIMessage(
            content="No problem! I won't navigate you to the ad creation page. How else can I help you with your advertising needs?"
        )
        
        return {
            **state,
            "messages": state["messages"] + [rejection_message],
            "requires_approval": False,
            "pending_action": None,
            "approval_status": None
        }
    
    # Should not reach here, but handle gracefully
    return state

def extract_workflow_data(user_input: str, intent: str) -> dict:
    """Extract relevant data from user input based on intent"""
    import re
    from datetime import datetime
    
    # Ensure user_input is a string (fix for LangGraph Studio compatibility)
    if isinstance(user_input, list):
        user_input = ' '.join(str(item) for item in user_input)
    elif not isinstance(user_input, str):
        user_input = str(user_input)
    
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
        "offer_management": "offer_manager_agent",
    }
    
    return routing_map.get(intent, "general_assistant")

async def supervisor_agent(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
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
                **state,
                "agent_decision": "general_assistant",
                "context": full_context,
                "user_intent": "",
                "workflow_data": {},
            }
        
        # Get latest user message with robust type handling
        latest_message = messages[-1]
        user_input = ""
        
        if hasattr(latest_message, 'content'):
            content = latest_message.content
            if isinstance(content, str):
                user_input = content
            elif isinstance(content, list):
                user_input = ' '.join(str(item) for item in content)
            else:
                user_input = str(content)
        elif isinstance(latest_message, str):
            user_input = latest_message
        elif isinstance(latest_message, dict) and "content" in latest_message:
            user_input = str(latest_message["content"])
        else:
            user_input = str(latest_message)
        
        # Analyze user intent (sync version for now)
        user_lower = user_input.lower() if user_input else ""
        if any(word in user_lower for word in ["create ad", "new ad", "campaign", "advertisement", "create an ad"]):
            intent = "ad_creation"
        elif any(word in user_lower for word in ["analytics", "performance", "metrics", "report", "stats"]):
            intent = "analytics_query"
        elif any(word in user_lower for word in ["filter", "targeting", "audience", "segment"]):
            intent = "filter_management"
        elif any(word in user_lower for word in ["merchant", "business", "account", "setup"]):
            intent = "merchant_support"
        elif any(word in user_lower for word in ["offer", "promotion", "deal", "discount", "coupon", "create offer"]):
            intent = "offer_management"
        else:
            intent = "general_assistance"
        
        # Determine routing decision
        decision = determine_agent_routing(intent, full_context)
        
        print(f"[Supervisor] Intent: {intent}, Routing to: {decision}")
        
        return {
            **state,
            "user_intent": intent,
            "agent_decision": decision,
            "context": full_context,
            "workflow_data": extract_workflow_data(user_input, intent),
        }
        
    except Exception as error:
        print(f"Supervisor agent error: {error}")
        return {
            **state,
            "agent_decision": "error_handler",
            "error": str(error),
            "user_intent": "",
            "context": state.get("context", {}),
            "workflow_data": {},
        }

def route_to_agent(state: KigoProAgentState) -> str:
    """Route to appropriate agent based on supervisor decision"""
    return state["agent_decision"]

async def general_assistant(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """General Assistant Agent (fallback)"""
    messages = state.get("messages", [])
    context = state.get("context", {})
    current_page = context.get("currentPage", "/")
    
    try:
        # Use LLM for intelligent general assistance
        system_prompt = f"""You are the Kigo Pro Business Success Manager, an AI assistant for the Kigo advertising platform.

Current context:
- User is on page: {current_page}
- Platform capabilities: ad creation, analytics, filters, merchant support

Provide helpful guidance about what you can help with on the Kigo Pro platform. Be concise and actionable."""

        latest_message = messages[-1] if messages else None
        user_input = "How can I help?"
        
        if latest_message:
            if hasattr(latest_message, 'content'):
                user_input = latest_message.content
            elif isinstance(latest_message, dict) and "content" in latest_message:
                user_input = str(latest_message["content"])
            else:
                user_input = str(latest_message)

        llm = get_llm()
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_input)
        ])

        ai_response = AIMessage(content=response.content)
        
    except Exception as e:
        print(f"General assistant error: {e}")
        # Fallback response if LLM fails
        ai_response = AIMessage(content="I'm here to help you with the Kigo Pro platform! How can I assist you today?")
    
    return {
        **state,
        "messages": messages + [ai_response],
    }

async def campaign_agent(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Campaign Agent - handles ad creation and campaign management"""
    messages = state.get("messages", [])
    intent = state.get("user_intent", "")
    context = state.get("context", {})
    current_page = context.get("currentPage", "/")

    # Simple sync version for testing
    from langchain_core.messages import AIMessage
    
    # Determine if agent should call actions based on intent and context
    should_navigate_to_ads = (
        intent == "ad_creation" and 
        current_page != "/campaign-manager/ads-create"
    )
    
    if should_navigate_to_ads:
        # Propose navigation action with human approval
        proposed_action = {
            "action_name": "navigateToAdCreation",
            "parameters": {"adType": "display"},
            "description": "Navigate to the ad creation page to start building your campaign"
        }
        
        ai_response = AIMessage(
            content="I can help you create an ad! I'd like to take you to our ad creation page where you can build your campaign step by step with guided forms for ad details, targeting, and budget. Should I navigate you there now?"
        )
        
        return {
            **state,
            "messages": messages + [ai_response],
            "pending_action": proposed_action,
            "requires_approval": True,
            "approval_status": "pending"
        }
    
    else:
        # Simple response for now
        ai_response = AIMessage(
            content="I'm your Kigo Pro Campaign Specialist! To create an ad, I'll help you with: 1) Ad name and type, 2) Target merchant, 3) Offer details, 4) Media requirements, 5) Budget. What would you like to start with?"
        )
        
        return {
            **state,
            "messages": messages + [ai_response],
        }

async def error_handler(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Error Handler Agent"""
    messages = state.get("messages", [])
    error = state.get("error", "Unknown error occurred")
    
    response = AIMessage(content=f"""I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.

Error: {error}""")
    
    return {
        **state,
        "messages": messages + [response],
    }

async def filter_agent(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Filter Agent - handles product filter management"""
    messages = state.get("messages", [])
    
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

async def analytics_agent(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Analytics Agent - handles performance data and insights"""
    messages = state.get("messages", [])
    intent = state.get("user_intent", "")
    context = state.get("context", {})
    current_page = context.get("currentPage", "/")

    try:
        llm = get_llm()
        
        # Determine if agent should navigate to analytics page
        should_navigate_to_analytics = (
            intent == "analytics_query" and 
            current_page != "/analytics"
        )
        
        if should_navigate_to_analytics:
            # Agent decides to navigate user to analytics page
            system_prompt = f"""You are a Kigo Pro Analytics Specialist.

            The user wants to see analytics, and you need to take them to the analytics page first.
            Current context: User is on {current_page}
            
            Provide a helpful response explaining that you're taking them to the analytics dashboard."""
            
            latest_message = messages[-1] if messages else None
            user_input = latest_message.content if latest_message else "Show me analytics"

            response = llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_input)
            ])

            ai_response = AIMessage(content=response.content)
            
            return {
                **state,
                "messages": messages + [ai_response],
                "workflow_data": {
                    "pending_actions": [
                        {
                            "action_name": "navigateToAnalytics",
                            "parameters": {},
                        }
                    ]
                }
            }
        
        else:
            # Normal analytics assistance
            system_prompt = f"""You are a Kigo Pro Analytics Specialist for campaign performance analysis.

            Current context:
            - User is on page: {current_page}
            - Platform capabilities: performance reports, ROI analysis, trend analysis, optimization suggestions

            Help with analytics tasks. Provide insights about campaign performance metrics, ROI, conversions, and optimization opportunities."""

            latest_message = messages[-1] if messages else None
            user_input = latest_message.content if latest_message else "I need analytics help"

            response = llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_input)
            ])

            ai_response = AIMessage(content=response.content)

            return {
                **state,
                "messages": messages + [ai_response],
            }

    except Exception as e:
        print(f"Analytics agent error: {e}")
        # Fallback response
        if intent == "analytics_query":
            ai_response = AIMessage(content="Let me show you your campaign analytics! I'll take you to the analytics dashboard.")
            return {
                **state,
                "messages": messages + [ai_response],
                "workflow_data": {
                    "pending_actions": [
                        {
                            "action_name": "navigateToAnalytics",
                            "parameters": {},
                        }
                    ]
                }
            }
        else:
            ai_response = AIMessage(content="I can help you analyze your campaign performance. What metrics would you like to see?")
            return {
                **state,
                "messages": messages + [ai_response],
            }

async def merchant_agent(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Merchant Agent - handles merchant support and guidance"""
    messages = state.get("messages", [])
    
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
    
    # Import offer manager agent (absolute import for LangGraph Studio compatibility)
    try:
        from app.agents.offer_manager import offer_manager_agent
    except ImportError:
        # Fallback to relative import for direct execution
        from .offer_manager import offer_manager_agent
    
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
    workflow.add_node("offer_manager_agent", offer_manager_agent)
    
    # Add human-in-the-loop nodes
    workflow.add_node("approval_node", approval_node)
    workflow.add_node("execute_action", execute_approved_action)
    
    # Set entry point
    workflow.set_entry_point("supervisor")
    
    # Add conditional edges from supervisor with explicit mapping
    workflow.add_conditional_edges(
        "supervisor", 
        route_to_agent,
        {
            "campaign_agent": "campaign_agent",
            "general_assistant": "general_assistant", 
            "error_handler": "error_handler",
            "filter_agent": "filter_agent",
            "analytics_agent": "analytics_agent",
            "merchant_agent": "merchant_agent",
            "offer_manager_agent": "offer_manager_agent",
        }
    )
    
    # Helper function for approval routing
    def should_request_approval(state: KigoProAgentState) -> str:
        """Determine if state requires human approval"""
        if state.get("requires_approval"):
            return "approval"
        return "end"
    
    def should_execute_action(state: KigoProAgentState) -> str:
        """Determine if approved action should be executed"""
        approval_status = state.get("approval_status")
        if approval_status == "approved":
            return "execute"
        return "end"
    
    # Campaign agent can require approval
    workflow.add_conditional_edges(
        "campaign_agent",
        should_request_approval,
        {
            "approval": "approval_node",
            "end": END
        }
    )
    
    # Approval flow
    workflow.add_conditional_edges(
        "approval_node",
        should_execute_action,
        {
            "execute": "execute_action", 
            "end": END
        }
    )
    
    workflow.add_edge("execute_action", END)
    
    # Offer manager can also require approval
    workflow.add_conditional_edges(
        "offer_manager_agent",
        should_request_approval,
        {
            "approval": "approval_node",
            "end": END
        }
    )
    
    # Other agents end the workflow directly
    workflow.add_edge("general_assistant", END)
    workflow.add_edge("error_handler", END)
    workflow.add_edge("filter_agent", END)
    workflow.add_edge("analytics_agent", END)
    workflow.add_edge("merchant_agent", END)
    
    # Compile with interrupt for human approval
    compiled = workflow.compile(interrupt_before=["approval_node"])
    
    print("🎯 Python LangGraph Supervisor Workflow compiled successfully!")
    return compiled
