/**
 * Simple LangGraph Workflow for Studio Testing
 *
 * This provides a chat interface in LangGraph Studio for testing
 * our agent logic without the complex state schema.
 */

import {
  StateGraph,
  START,
  END,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { detectUserIntent } from "../ai/intent-detection";

/**
 * Simple Supervisor for Studio Testing
 */
async function studioSupervisor(state: typeof MessagesAnnotation.State) {
  const { messages } = state;

  if (messages.length === 0) {
    return {
      messages: [
        new AIMessage(
          "Hi! I'm your Kigo Pro assistant. How can I help you with your campaigns today?"
        ),
      ],
    };
  }

  const lastMessage = messages[messages.length - 1];
  const userInput = lastMessage.content as string;

  console.log(`[Studio] Processing: "${userInput}"`);

  // Test our intent detection
  try {
    const intent = await detectUserIntent(userInput, {
      currentPage: "/studio",
      userRole: "admin",
    });

    console.log(`[Studio] Intent detected: ${intent}`);

    let response = "";
    switch (intent) {
      case "ad_creation":
        response = `✅ AD CREATION INTENT DETECTED! 

In production, this would:
1. Route to campaign_agent
2. Ask for merchant and ad details  
3. Navigate to /campaign-manager/ads-create
4. Pre-fill the form

Detected from: "${userInput}"`;
        break;

      case "analytics_query":
        response = `📊 ANALYTICS INTENT DETECTED!

In production, this would:
1. Route to analytics_agent  
2. Show relevant metrics
3. Navigate to analytics dashboard

Detected from: "${userInput}"`;
        break;

      default:
        response = `🤖 INTENT: ${intent}

I detected your intent as "${intent}" from the message: "${userInput}"

Available intents:
- ad_creation: Create ads/campaigns
- analytics_query: View metrics/reports
- filter_management: Manage product filters
- merchant_support: Get help
- general_assistance: General questions`;
    }

    return {
      messages: [new AIMessage(response)],
    };
  } catch (error) {
    console.error("[Studio] Error:", error);
    return {
      messages: [new AIMessage(`❌ Error processing message: ${error}`)],
    };
  }
}

/**
 * Create Studio-Compatible Workflow
 */
export function createStudioTestWorkflow() {
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("supervisor", studioSupervisor)
    .addEdge(START, "supervisor")
    .addEdge("supervisor", END);

  return workflow.compile();
}

// Export for LangGraph Studio
export default createStudioTestWorkflow();
