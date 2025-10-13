"""
Kigo Pro Supervisor Agent - Simplified & Scalable LangGraph Implementation

Architecture:
- Smart LLM-based intent detection with few-shot prompting
- Simplified routing to specialist agents
- Graceful error handling at every level
- Extensible design for adding new agents
"""

from typing import Annotated, List, Any, Optional, Dict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_anthropic import ChatAnthropic
from langchain_core.runnables import RunnableConfig
import os
from datetime import datetime

# Import CopilotKit state
try:
    from copilotkit import CopilotKitState
    COPILOTKIT_AVAILABLE = True
except ImportError:
    from typing import TypedDict
    from langgraph.graph.message import add_messages
    
    class CopilotKitState(TypedDict):
        messages: Annotated[List[BaseMessage], add_messages]
    
    COPILOTKIT_AVAILABLE = False


def get_llm():
    """Get ChatAnthropic instance"""
    return ChatAnthropic(
        model="claude-3-5-sonnet-20241022",
        temperature=0.3,  # Lower temperature for more consistent intent detection
        max_tokens=100,   # Short responses for intent
        api_key=os.getenv("ANTHROPIC_API_KEY")
    )


# ==================== STATE DEFINITION ====================

class KigoProAgentState(CopilotKitState):
    """Unified state for all Kigo Pro agents"""
    user_intent: Optional[str] = ""
    agent_decision: Optional[str] = ""
    context: Optional[Dict] = {}
    error: Optional[str] = None
    
    # Human-in-the-loop fields
    pending_action: Optional[Dict] = None
    approval_status: Optional[str] = None
    requires_approval: Optional[bool] = None


# ==================== INTENT DETECTION ====================

async def detect_intent(user_input: str, context: Dict) -> str:
    """
    Smart LLM-based intent detection with few-shot prompting
    """
    llm = get_llm()
    
    # Few-shot prompt with clear examples
    system_prompt = """You are an intent classifier for the Kigo Pro marketing platform.

Available intents:
1. offer_management - Creating/managing promotional offers, deals, discounts, coupons
2. ad_creation - Creating/managing advertising campaigns or ads
3. analytics - Viewing performance data, metrics, reports, insights
4. general - General questions, greetings, or unclear requests

Examples:
"I need help creating an offer" → offer_management
"create a promotion for Q4" → offer_management
"help with ofer setup" → offer_management (typo tolerance)
"Create a new ad campaign" → ad_creation
"Show me analytics" → analytics
"Hello, how are you?" → general

Respond with ONLY the intent name (offer_management, ad_creation, analytics, or general)."""

    try:
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Classify this: {user_input}")
        ])
        
        intent = response.content.strip().lower()
        
        # Validate and normalize
        valid_intents = ["offer_management", "ad_creation", "analytics", "general"]
        if any(i in intent for i in valid_intents):
            # Return the first matching intent
            for i in valid_intents:
                if i in intent:
                    return i
        
        return "general"
        
    except Exception as e:
        print(f"⚠️  [Intent Detection] LLM error, using fallback: {e}")
        # Simple fallback
        user_lower = user_input.lower()
        if any(word in user_lower for word in ["offer", "ofer", "promotion", "deal", "discount"]):
            return "offer_management"
        elif any(word in user_lower for word in ["ad", "campaign", "advertisement"]):
            return "ad_creation"
        elif any(word in user_lower for word in ["analytics", "performance", "metrics"]):
            return "analytics"
        return "general"


# ==================== SUPERVISOR AGENT ====================

async def supervisor_agent(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """
    Supervisor: Detects intent and routes to appropriate specialist agent
    """
    try:
        messages = state.get("messages", [])
        context = state.get("context", {})
        
        # Extract user input
        if not messages:
            return {**state, "agent_decision": "general_agent", "user_intent": "general"}
        
        latest_message = messages[-1]
        user_input = str(getattr(latest_message, 'content', latest_message))
        
        # Detect intent using LLM
        intent = await detect_intent(user_input, context)
        
        # Route to appropriate agent
        agent_routing = {
            "offer_management": "offer_manager_agent",
            "ad_creation": "campaign_agent",
            "analytics": "analytics_agent",
            "general": "general_agent",
        }
        
        decision = agent_routing.get(intent, "general_agent")
        
        print(f"[Supervisor] 📝 '{user_input[:60]}...' → Intent: {intent} → Agent: {decision}")
        
        return {
            **state,
            "user_intent": intent,
            "agent_decision": decision,
            "context": {**context, "currentPage": context.get("currentPage", "/")},
        }
        
    except Exception as error:
        print(f"❌ [Supervisor] Error: {error}")
        import traceback
        traceback.print_exc()
        
        return {
            **state,
            "agent_decision": "general_agent",
            "user_intent": "general",
            "error": str(error),
        }


def route_to_agent(state: KigoProAgentState) -> str:
    """Simple routing based on supervisor decision"""
    return state.get("agent_decision", "general_agent")


# ==================== GENERAL ASSISTANT AGENT ====================

async def general_agent(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """General assistant for unclear requests or greetings"""
    messages = state.get("messages", [])
    
    try:
        llm = get_llm()
        
        system_prompt = """You are the Kigo Pro Business Success Manager.

You help merchants with:
- Creating promotional offers and deals
- Setting up advertising campaigns
- Viewing analytics and performance metrics
- General platform questions

Be friendly, concise, and helpful. If the user wants to do something specific, guide them clearly."""

        latest_message = messages[-1] if messages else None
        user_input = str(getattr(latest_message, 'content', "Hello"))
        
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_input)
        ])
        
        return {
            **state,
            "messages": messages + [AIMessage(content=response.content)],
        }
        
    except Exception as e:
        print(f"❌ [General Agent] Error: {e}")
        return {
            **state,
            "messages": messages + [AIMessage(content="Hi! I'm here to help you with the Kigo Pro platform. What would you like to do today?")],
        }


# ==================== CAMPAIGN AGENT (STUB) ====================

async def campaign_agent(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Campaign/Ad creation agent"""
    messages = state.get("messages", [])
    
    response = AIMessage(
        content="I can help you create advertising campaigns! Let me guide you through setting up your ad. What type of campaign would you like to create?"
    )
    
    return {**state, "messages": messages + [response]}


# ==================== ANALYTICS AGENT (STUB) ====================

async def analytics_agent(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Analytics and reporting agent"""
    messages = state.get("messages", [])
    
    response = AIMessage(
        content="I'll help you view your campaign analytics. What metrics would you like to see?"
    )
    
    return {**state, "messages": messages + [response]}


# ==================== APPROVAL WORKFLOW ====================

async def approval_node(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Human-in-the-loop approval node"""
    print(f"[Approval] Waiting for approval: {state.get('pending_action', {}).get('description', 'Unknown')}")
    return {**state, "approval_status": "pending"}


async def execute_approved_action(state: KigoProAgentState, config: RunnableConfig) -> KigoProAgentState:
    """Execute action after approval"""
    if state.get("approval_status") == "approved":
        print(f"[Execute] Executing approved action")
        return {**state, "requires_approval": False, "pending_action": None}
    
    return {**state, "requires_approval": False, "pending_action": None}


# ==================== WORKFLOW CREATION ====================

def create_supervisor_workflow():
    """
    Create simplified, scalable supervisor workflow
    
    Architecture:
    START → supervisor → [route to specialist] → specialist_agent → END
                                                → approval_node (if needed) → execute → END
    """
    
    # Import offer manager agent
    try:
        from app.agents.offer_manager import offer_manager_agent
    except ImportError:
        from .offer_manager import offer_manager_agent
    
    # Build workflow
    workflow = StateGraph(KigoProAgentState)
    
    # Add nodes
    workflow.add_node("supervisor", supervisor_agent)
    workflow.add_node("general_agent", general_agent)
    workflow.add_node("campaign_agent", campaign_agent)
    workflow.add_node("analytics_agent", analytics_agent)
    workflow.add_node("offer_manager_agent", offer_manager_agent)
    
    # Add approval workflow nodes
    workflow.add_node("approval_node", approval_node)
    workflow.add_node("execute_action", execute_approved_action)
    
    # Set entry point
    workflow.set_entry_point("supervisor")
    
    # Supervisor routes to agents
    workflow.add_conditional_edges(
        "supervisor",
        route_to_agent,
        {
            "general_agent": "general_agent",
            "campaign_agent": "campaign_agent",
            "analytics_agent": "analytics_agent",
            "offer_manager_agent": "offer_manager_agent",
        }
    )
    
    # Helper: Check if approval needed
    def needs_approval(state: KigoProAgentState) -> str:
        return "approval" if state.get("requires_approval") else "end"
    
    # Helper: Check if approved
    def is_approved(state: KigoProAgentState) -> str:
        return "execute" if state.get("approval_status") == "approved" else "end"
    
    # Agents that might need approval
    workflow.add_conditional_edges("campaign_agent", needs_approval, {"approval": "approval_node", "end": END})
    workflow.add_conditional_edges("offer_manager_agent", needs_approval, {"approval": "approval_node", "end": END})
    
    # Approval flow
    workflow.add_conditional_edges("approval_node", is_approved, {"execute": "execute_action", "end": END})
    workflow.add_edge("execute_action", END)
    
    # Simple agents end directly
    workflow.add_edge("general_agent", END)
    workflow.add_edge("analytics_agent", END)
    
    # Compile with interrupt for approval
    compiled = workflow.compile(interrupt_before=["approval_node"])
    
    print("✅ Kigo Pro Supervisor Workflow compiled successfully!")
    return compiled
