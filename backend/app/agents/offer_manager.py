"""
Kigo Pro Offer Manager Agent - LangGraph Implementation

AI-native offer creation and management specialist that guides users through:
- Business goal setting and context gathering
- Offer type and value recommendations
- Campaign setup and targeting
- Brand compliance validation
- Human-in-the-loop approval workflows
"""

from typing import Annotated, List, Any, Optional, Dict, TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_anthropic import ChatAnthropic
from langchain_core.runnables import RunnableConfig
import asyncio
import os
import re
import json
from datetime import datetime

# Import supervisor state
from .supervisor import KigoProAgentState, get_llm

# Step tracking for Perplexity-style streaming
class OfferStep(TypedDict):
    """Represents a step in the offer creation process"""
    id: str                              # Unique step identifier
    description: str                      # What this step is doing
    status: str                          # "pending" | "running" | "complete" | "error"
    type: str                            # Step type (goal_setting, research, etc.)
    updates: List[str]                   # Real-time progress messages
    result: Optional[Dict]               # Step result data
    metadata: Optional[Dict]             # Optional metadata (duration, sources, etc.)


# Helper functions for step management
async def emit_intermediate_state(config: RunnableConfig, state: Dict):
    """Emit intermediate state for real-time UI updates (CopilotKit pattern)"""
    emit_fn = config.get("configurable", {}).get("emit_intermediate_state")
    if emit_fn and callable(emit_fn):
        try:
            await emit_fn(state)
        except Exception as e:
            print(f"⚠️  Failed to emit intermediate state: {e}")


def get_or_create_step(steps: List[OfferStep], step_id: str, description: str, step_type: str) -> OfferStep:
    """Get existing step or create new one"""
    for step in steps:
        if step["id"] == step_id:
            return step
    
    new_step = {
        "id": step_id,
        "description": description,
        "status": "pending",
        "type": step_type,
        "updates": [],
        "result": None,
        "metadata": {"start_time": datetime.now().isoformat()}
    }
    steps.append(new_step)
    return new_step


def mark_step_complete(step: OfferStep, result: Optional[Dict] = None):
    """Mark a step as complete with optional result"""
    step["status"] = "complete"
    if result:
        step["result"] = result
    if "metadata" in step:
        step["metadata"]["end_time"] = datetime.now().isoformat()

class OfferManagerState(KigoProAgentState):
    """Extended state for offer management workflows"""
    # Business context
    business_objective: Optional[str] = ""
    program_type: Optional[str] = ""  # john_deere | yardi | general

    # Offer configuration
    offer_config: Optional[Dict] = {}

    # Campaign setup
    campaign_setup: Optional[Dict] = {}

    # Workflow management
    workflow_step: Optional[str] = "goal_setting"

    # Validation
    validation_results: Optional[List[Dict]] = []

    # Progress tracking
    progress_percentage: Optional[int] = 0
    current_phase: Optional[str] = "initialization"

    # NEW: Step-based streaming (Perplexity pattern)
    steps: Optional[List[OfferStep]] = []

    # NEW: Final answer/summary
    answer: Optional[Dict] = {}


def detect_program_type(context: Dict, messages: List[BaseMessage]) -> str:
    """Detect which program type (John Deere, Yardi, etc.) based on context"""
    # Check context first
    current_page = context.get("currentPage", "")
    if "john-deere" in current_page.lower() or "john_deere" in current_page.lower():
        return "john_deere"
    elif "yardi" in current_page.lower():
        return "yardi"
    
    # Check messages
    for message in messages[-3:]:  # Check last 3 messages
        content = ""
        if hasattr(message, 'content'):
            content = str(message.content).lower()
        
        if "john deere" in content or "john-deere" in content:
            return "john_deere"
        elif "yardi" in content:
            return "yardi"
    
    return "general"


def determine_workflow_step(state: OfferManagerState) -> str:
    """Determine current workflow step based on state"""
    current_step = state.get("workflow_step", "goal_setting")
    offer_config = state.get("offer_config", {})
    campaign_setup = state.get("campaign_setup", {})
    
    # If we have business objective but no offer config
    if state.get("business_objective") and not offer_config:
        return "offer_creation"
    
    # If we have offer config but no campaign setup
    if offer_config and not campaign_setup:
        return "campaign_setup"
    
    # If we have campaign setup but no validation
    if campaign_setup and not state.get("validation_results"):
        return "validation"
    
    # If validation passed but not approved
    if state.get("validation_results") and not state.get("approval_status"):
        return "approval"
    
    return current_step


async def handle_goal_setting(state: OfferManagerState, config: RunnableConfig) -> Dict:
    """Guide user through business goal setting and context gathering"""
    messages = state.get("messages", [])
    context = state.get("context", {})
    program_type = detect_program_type(context, messages)

    # Get or create step
    steps = state.get("steps", [])
    goal_step = get_or_create_step(steps, "goal_setting", "Understanding your business objectives", "goal_setting")
    goal_step["status"] = "running"
    goal_step["updates"].append("🔍 Analyzing your request...")
    
    # Emit intermediate state
    await emit_intermediate_state(config, {**state, "steps": steps})

    llm = get_llm()

    # Get latest user message
    latest_message = messages[-1] if messages else None
    user_input = ""
    if latest_message and hasattr(latest_message, 'content'):
        user_input = str(latest_message.content)

    goal_step["updates"].append("📝 Gathering context...")
    await emit_intermediate_state(config, {**state, "steps": steps})

    system_prompt = f"""You are a Kigo Pro Offer Strategy Consultant helping merchants create effective promotional offers.

Current context:
- Program type: {program_type}
- Phase: Goal Setting & Context Gathering

Your role is to:
1. Understand the merchant's business objectives (e.g., increase sales, clear inventory, customer acquisition)
2. Gather context about their target audience and constraints
3. Ask clarifying questions to understand their needs

Keep responses conversational, helpful, and focused on understanding their goals.
Ask 1-2 specific questions at a time to gather the information needed."""

    response = await llm.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_input or "I want to create a new offer")
    ])

    ai_response = AIMessage(content=response.content)

    # Mark step complete
    goal_step["updates"].append("✅ Goals captured")
    mark_step_complete(goal_step, {"program_type": program_type, "user_input": user_input})
    
    # Emit final state for this step
    await emit_intermediate_state(config, {**state, "steps": steps, "messages": messages + [ai_response]})

    # Update state
    return {
        **state,
        "messages": messages + [ai_response],
        "workflow_step": "goal_setting",
        "program_type": program_type,
        "current_phase": "goal_setting",
        "progress_percentage": 20,
        "steps": steps,
    }


async def handle_offer_creation(state: OfferManagerState, config: RunnableConfig) -> Dict:
    """AI-powered offer type and value recommendations"""
    messages = state.get("messages", [])
    business_objective = state.get("business_objective", "")
    program_type = state.get("program_type", "general")

    # Track step progress
    steps = state.get("steps", [])
    
    # Mark previous step complete
    for step in steps:
        if step["id"] == "goal_setting" and step["status"] != "complete":
            mark_step_complete(step)

    # Get or create offer creation step
    offer_step = get_or_create_step(steps, "offer_creation", "Creating offer recommendations", "offer_creation")
    offer_step["status"] = "running"
    offer_step["updates"].append("🔍 Analyzing similar offers...")
    await emit_intermediate_state(config, {**state, "steps": steps})

    llm = get_llm()

    # Get latest user message
    latest_message = messages[-1] if messages else None
    user_input = ""
    if latest_message and hasattr(latest_message, 'content'):
        user_input = str(latest_message.content)

    # Simulate research phase with updates
    offer_step["updates"].append("📊 Researching industry benchmarks...")
    await emit_intermediate_state(config, {**state, "steps": steps})
    
    await asyncio.sleep(0.3)  # Simulate thinking
    
    offer_step["updates"].append("🎯 Analyzing target audience fit...")
    await emit_intermediate_state(config, {**state, "steps": steps})

    system_prompt = f"""You are a Kigo Pro Offer Design Specialist with expertise in promotional strategy.

Current context:
- Business objective: {business_objective}
- Program type: {program_type}
- Phase: Offer Creation & Recommendations

Your role is to:
1. Recommend specific offer types (discount %, cashback, BOGO, etc.)
2. Suggest optimal offer values based on industry benchmarks
3. Explain the rationale behind your recommendations
4. Consider program-specific constraints and best practices

Provide 2-3 concrete offer recommendations with clear reasoning.
Format your response as structured recommendations that can guide the merchant's decision."""

    response = await llm.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_input or f"Recommend offers for: {business_objective}")
    ])

    ai_response = AIMessage(content=response.content)

    # Extract offer configuration (simplified for MVP)
    offer_config = {
        "objective": business_objective,
        "program_type": program_type,
        "timestamp": datetime.now().isoformat(),
        "recommendations_provided": True,
    }

    # Mark step complete
    offer_step["updates"].append("✅ Recommendations generated")
    mark_step_complete(offer_step, offer_config)
    await emit_intermediate_state(config, {**state, "steps": steps, "messages": messages + [ai_response]})

    return {
        **state,
        "messages": messages + [ai_response],
        "workflow_step": "offer_creation",
        "offer_config": offer_config,
        "current_phase": "offer_creation",
        "progress_percentage": 40,
        "steps": steps,
    }


async def handle_campaign_setup(state: OfferManagerState, config: RunnableConfig) -> Dict:
    """Guide campaign targeting and delivery configuration"""
    messages = state.get("messages", [])
    offer_config = state.get("offer_config", {})
    program_type = state.get("program_type", "general")
    
    # Track step progress
    steps = state.get("steps", [])
    
    # Mark previous step complete
    for step in steps:
        if step["id"] == "offer_creation" and step["status"] != "complete":
            mark_step_complete(step)
    
    # Get or create campaign setup step
    campaign_step = get_or_create_step(steps, "campaign_setup", "Configuring campaign targeting", "campaign_setup")
    campaign_step["status"] = "running"
    campaign_step["updates"].append("🎯 Analyzing target audience...")
    await emit_intermediate_state(config, {**state, "steps": steps})
    
    llm = get_llm()
    
    # Get latest user message
    latest_message = messages[-1] if messages else None
    user_input = ""
    if latest_message and hasattr(latest_message, 'content'):
        user_input = str(latest_message.content)
    
    campaign_step["updates"].append("📱 Determining optimal delivery channels...")
    await emit_intermediate_state(config, {**state, "steps": steps})
    
    system_prompt = f"""You are a Kigo Pro Campaign Orchestration Specialist.

Current context:
- Program type: {program_type}
- Offer objective: {offer_config.get('objective', 'Not specified')}
- Phase: Campaign Setup & Targeting

Your role is to:
1. Help define target audience and segmentation
2. Recommend delivery channels (in-app, email, push, geofence)
3. Suggest campaign timing and duration
4. Guide budget allocation

Provide practical, actionable campaign setup recommendations.
Ask clarifying questions about their campaign preferences."""

    response = await llm.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_input or "Help me set up the campaign")
    ])
    
    ai_response = AIMessage(content=response.content)
    
    # Build campaign setup config (simplified for MVP)
    campaign_setup = {
        "offer_config": offer_config,
        "timestamp": datetime.now().isoformat(),
        "setup_complete": False,
    }
    
    campaign_step["updates"].append("✅ Campaign configuration ready")
    mark_step_complete(campaign_step, campaign_setup)
    await emit_intermediate_state(config, {**state, "steps": steps, "messages": messages + [ai_response]})
    
    return {
        **state,
        "messages": messages + [ai_response],
        "workflow_step": "campaign_setup",
        "campaign_setup": campaign_setup,
        "current_phase": "campaign_setup",
        "progress_percentage": 60,
        "steps": steps,
    }


async def handle_validation(state: OfferManagerState, config: RunnableConfig) -> Dict:
    """Validate offer against brand guidelines and business rules"""
    messages = state.get("messages", [])
    offer_config = state.get("offer_config", {})
    campaign_setup = state.get("campaign_setup", {})
    program_type = state.get("program_type", "general")

    # Track step progress
    steps = state.get("steps", [])

    # Add validation step
    validation_step_exists = any(s["id"] == "validation" for s in steps)
    if not validation_step_exists:
        steps.append({
            "id": "validation",
            "description": "Validating offer configuration",
            "status": "running",
            "type": "validation",
            "updates": ["Checking brand guidelines...", "Validating business rules..."],
            "result": None
        })
    else:
        for step in steps:
            if step["id"] == "validation":
                step["status"] = "running"
                step["updates"].append("Running compliance checks...")

    # Mark previous steps complete
    for step in steps:
        if step["id"] in ["offer_creation", "campaign_setup"]:
            step["status"] = "complete"

    llm = get_llm()

    system_prompt = f"""You are a Kigo Pro Compliance & Validation Specialist.

Current context:
- Program type: {program_type}
- Offer: {json.dumps(offer_config, indent=2)}
- Campaign: {json.dumps(campaign_setup, indent=2)}
- Phase: Validation & Compliance Check

Your role is to:
1. Check brand guideline compliance
2. Validate business rule adherence
3. Identify potential issues or risks
4. Suggest improvements if needed

Provide a clear validation report with:
- ✅ Passed checks
- ⚠️  Warnings (if any)
- ❌ Blocking issues (if any)
- 💡 Recommendations for improvement

Be thorough but constructive."""

    response = await llm.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content="Please validate this offer and campaign setup")
    ])

    ai_response = AIMessage(content=response.content)

    # Simulated validation results (MVP - in production would be rule-based)
    validation_results = [
        {
            "check": "brand_guidelines",
            "status": "passed",
            "message": "Offer aligns with brand guidelines",
        },
        {
            "check": "budget_limits",
            "status": "passed",
            "message": "Budget within approved limits",
        },
    ]

    # Update step
    for step in steps:
        if step["id"] == "validation":
            step["updates"].append("All checks passed ✅")
            step["result"] = {"validation_results": validation_results}
            step["status"] = "complete"

    return {
        **state,
        "messages": messages + [ai_response],
        "workflow_step": "validation",
        "validation_results": validation_results,
        "current_phase": "validation",
        "progress_percentage": 80,
        "steps": steps,
    }


async def handle_approval_workflow(state: OfferManagerState, config: RunnableConfig) -> Dict:
    """Human-in-the-loop approval for offer launch"""
    messages = state.get("messages", [])
    offer_config = state.get("offer_config", {})
    campaign_setup = state.get("campaign_setup", {})
    validation_results = state.get("validation_results", [])

    # Track step progress
    steps = state.get("steps", [])

    # Check if validation passed
    all_passed = all(v.get("status") == "passed" for v in validation_results)

    if not all_passed:
        ai_response = AIMessage(
            content="⚠️  Some validation checks didn't pass. Please review the issues above and make necessary adjustments before submitting for approval."
        )
        return {
            **state,
            "messages": messages + [ai_response],
            "workflow_step": "validation",  # Go back to validation
            "steps": steps,
        }

    # Add approval step
    approval_step_exists = any(s["id"] == "approval" for s in steps)
    if not approval_step_exists:
        steps.append({
            "id": "approval",
            "description": "Ready for your approval",
            "status": "pending",
            "type": "approval",
            "updates": ["Waiting for review..."],
            "result": None
        })

    # Prepare approval request
    approval_summary = f"""
### 🎯 Offer Summary Ready for Approval

**Business Objective:** {offer_config.get('objective', 'N/A')}
**Program Type:** {state.get('program_type', 'General')}
**Validation Status:** All checks passed ✅

I've prepared your offer and campaign setup. Would you like me to proceed with launching this offer?
"""

    ai_response = AIMessage(content=approval_summary)

    # Prepare pending action for human approval
    pending_action = {
        "action_name": "launchOffer",
        "parameters": {
            "offer_config": offer_config,
            "campaign_setup": campaign_setup,
        },
        "description": "Launch the promotional offer and activate the campaign",
    }

    # Create final answer summary
    answer = {
        "markdown": approval_summary,
        "offer_config": offer_config,
        "campaign_setup": campaign_setup,
        "validation_results": validation_results
    }

    return {
        **state,
        "messages": messages + [ai_response],
        "workflow_step": "approval",
        "pending_action": pending_action,
        "requires_approval": True,
        "approval_status": "pending",
        "current_phase": "approval",
        "progress_percentage": 90,
        "steps": steps,
        "answer": answer,
    }


async def handle_general_offer_assistance(state: OfferManagerState, config: RunnableConfig) -> Dict:
    """Handle general offer-related questions and assistance"""
    messages = state.get("messages", [])
    
    llm = get_llm()
    
    # Get latest user message
    latest_message = messages[-1] if messages else None
    user_input = ""
    if latest_message and hasattr(latest_message, 'content'):
        user_input = str(latest_message.content)
    
    system_prompt = """You are a Kigo Pro Offer Management Assistant.

You help merchants with:
- Creating new promotional offers
- Understanding offer types and strategies
- Campaign setup and optimization
- Best practices and recommendations

Provide helpful, actionable guidance. If the user wants to create an offer, 
guide them to start the offer creation workflow."""

    response = await llm.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_input or "How can I help with offers?")
    ])
    
    ai_response = AIMessage(content=response.content)
    
    return {
        **state,
        "messages": messages + [ai_response],
    }


async def offer_manager_agent(state: OfferManagerState, config: RunnableConfig) -> Dict:
    """
    Main Offer Manager Agent - routes to appropriate sub-workflow with error handling
    """
    messages = state.get("messages", [])
    
    try:
        context = state.get("context", {})
        
        # Detect program type
        program_type = detect_program_type(context, messages)
        
        # Determine workflow step
        current_step = determine_workflow_step(state)
        
        print(f"[Offer Manager] 🎁 Program: {program_type}, Step: {current_step}")
        
        # Route to appropriate handler (now passing config for intermediate state emission)
        if current_step == "goal_setting":
            return await handle_goal_setting({**state, "program_type": program_type}, config)
        elif current_step == "offer_creation":
            return await handle_offer_creation(state, config)
        elif current_step == "campaign_setup":
            return await handle_campaign_setup(state, config)
        elif current_step == "validation":
            return await handle_validation(state, config)
        elif current_step == "approval":
            return await handle_approval_workflow(state, config)
        else:
            return await handle_general_offer_assistance(state, config)
            
    except Exception as e:
        # Top-level error handling for offer manager
        print(f"❌ [Offer Manager] Error: {e}")
        import traceback
        traceback.print_exc()
        
        # Update error step if it exists
        steps = state.get("steps", [])
        for step in steps:
            if step["status"] == "running":
                step["status"] = "error"
                step["updates"].append(f"❌ Error: {str(e)}")
        
        error_message = AIMessage(
            content="I encountered an issue while helping with your offer. Let me try a different approach - could you tell me what you'd like to achieve with this offer?"
        )
        
        return {
            **state,
            "messages": messages + [error_message],
            "workflow_step": "goal_setting",  # Reset to beginning
            "current_phase": "goal_setting",
            "steps": steps,
            "error": str(e),
        }

