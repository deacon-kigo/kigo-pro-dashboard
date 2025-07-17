import { StateGraph, START, END } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  createTracedFunction,
  logAgentInteraction,
} from "../../lib/copilot-kit/langsmith-config";

/**
 * Kigo Pro Agent State Interface
 *
 * This interface defines the state structure that flows through our
 * LangGraph multi-agent system.
 */
export interface KigoProAgentState {
  messages: BaseMessage[];
  userIntent: string;
  context: {
    currentPage: string;
    userRole: string;
    campaignData?: any;
    sessionId: string;
  };
  agentDecision: string;
  workflowData: any;
  error?: string;
}

/**
 * Supervisor Agent
 *
 * The supervisor agent analyzes user input and routes to appropriate
 * specialist agents based on intent and context.
 */
const supervisorAgent = createTracedFunction(
  "supervisor_agent",
  async (state: KigoProAgentState): Promise<Partial<KigoProAgentState>> => {
    const { messages, context } = state;

    try {
      // Get the latest user message
      const latestMessage = messages[messages.length - 1];
      const userInput = latestMessage.content as string;

      // Analyze user intent
      const intent = await analyzeUserIntent(userInput, context);

      // Determine routing decision
      const decision = determineAgentRouting(intent, context);

      // Log interaction to LangSmith
      logAgentInteraction(
        "supervisor",
        { userInput, context },
        { intent, decision },
        { routing: decision }
      );

      return {
        userIntent: intent,
        agentDecision: decision,
        workflowData: extractWorkflowData(userInput, intent),
      };
    } catch (error) {
      console.error("Supervisor agent error:", error);
      return {
        agentDecision: "error_handler",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
);

/**
 * Analyze user intent from their message
 */
async function analyzeUserIntent(
  userInput: string,
  context: { currentPage: string; userRole: string; campaignData?: any }
): Promise<string> {
  const input = userInput.toLowerCase();

  // Intent patterns for different agent types
  const intentPatterns = {
    campaign_creation: [
      "create campaign",
      "new campaign",
      "create ad",
      "new ad",
      "make campaign",
      "build campaign",
      "start campaign",
      "promotional campaign",
      "advertising campaign",
    ],
    campaign_optimization: [
      "optimize campaign",
      "improve campaign",
      "campaign performance",
      "increase roi",
      "better results",
      "campaign analytics",
    ],
    filter_management: [
      "create filter",
      "product filter",
      "filter products",
      "target products",
      "filter criteria",
      "product selection",
    ],
    analytics_query: [
      "show analytics",
      "campaign stats",
      "performance data",
      "how is campaign doing",
      "analytics dashboard",
      "reports",
    ],
    merchant_support: [
      "help with",
      "how to",
      "support",
      "guidance",
      "merchant setup",
      "account management",
    ],
  };

  // Check for intent matches
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (patterns.some((pattern) => input.includes(pattern))) {
      return intent;
    }
  }

  // Context-based intent detection
  if (context.currentPage?.includes("ads-create")) {
    return "campaign_creation";
  }

  if (context.currentPage?.includes("analytics")) {
    return "analytics_query";
  }

  if (context.currentPage?.includes("product-filters")) {
    return "filter_management";
  }

  // Default to general assistance
  return "general_assistance";
}

/**
 * Determine which agent to route to based on intent and context
 */
function determineAgentRouting(
  intent: string,
  context: { currentPage: string; userRole: string; campaignData?: any }
): string {
  switch (intent) {
    case "campaign_creation":
    case "campaign_optimization":
      return "ad_creation_agent";

    case "filter_management":
      return "filter_agent";

    case "analytics_query":
      return "analytics_agent";

    case "merchant_support":
      return "merchant_agent";

    default:
      return "general_assistant";
  }
}

/**
 * Extract workflow data from user input
 */
function extractWorkflowData(userInput: string, intent: string): any {
  const data: any = {
    timestamp: new Date().toISOString(),
    intent,
    rawInput: userInput,
  };

  // Extract campaign-specific data
  if (intent === "campaign_creation") {
    const budgetMatch = userInput.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (budgetMatch) {
      data.budget = parseFloat(budgetMatch[1].replace(",", ""));
    }

    const businessTypeMatch = userInput.match(
      /(restaurant|retail|pharmacy|automotive|technology|healthcare|finance)/i
    );
    if (businessTypeMatch) {
      data.businessType = businessTypeMatch[1].toLowerCase();
    }

    const audienceMatch = userInput.match(
      /(families|students|professionals|seniors|millennials|gen z)/i
    );
    if (audienceMatch) {
      data.targetAudience = audienceMatch[1].toLowerCase();
    }
  }

  return data;
}

/**
 * Route to appropriate agent based on supervisor decision
 */
function routeToAgent(state: KigoProAgentState): string {
  return state.agentDecision;
}

/**
 * General Assistant Agent (fallback)
 */
const generalAssistant = createTracedFunction(
  "general_assistant",
  async (state: KigoProAgentState): Promise<Partial<KigoProAgentState>> => {
    const { messages } = state;

    const response = new AIMessage({
      content: `I'm here to help you with the Kigo Pro platform! I can assist you with:

• Creating and optimizing advertising campaigns
• Managing product filters and targeting
• Analyzing campaign performance and analytics
• Merchant account setup and support

What would you like to work on today?`,
    });

    return {
      messages: [...messages, response],
    };
  }
);

/**
 * Error Handler Agent
 */
const errorHandler = createTracedFunction(
  "error_handler",
  async (state: KigoProAgentState): Promise<Partial<KigoProAgentState>> => {
    const { messages, error } = state;

    const response = new AIMessage({
      content: `I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.

Error: ${error || "Unknown error occurred"}`,
    });

    return {
      messages: [...messages, response],
    };
  }
);

/**
 * Create and export the supervisor workflow
 */
export const createSupervisorWorkflow = () => {
  const workflow = new StateGraph<KigoProAgentState>({
    channels: {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
        default: () => [],
      },
      userIntent: {
        value: (x: string, y: string) => y ?? x,
        default: () => "",
      },
      context: {
        value: (x: any, y: any) => ({ ...x, ...y }),
        default: () => ({}),
      },
      agentDecision: {
        value: (x: string, y: string) => y ?? x,
        default: () => "",
      },
      workflowData: {
        value: (x: any, y: any) => ({ ...x, ...y }),
        default: () => ({}),
      },
      error: {
        value: (x: string, y: string) => y ?? x,
        default: () => "",
      },
    },
  });

  // Add nodes
  workflow.addNode("supervisor", supervisorAgent);
  workflow.addNode("general_assistant", generalAssistant);
  workflow.addNode("error_handler", errorHandler);

  // Add edges
  workflow.addEdge(START, "supervisor");
  workflow.addConditionalEdges("supervisor", routeToAgent);
  workflow.addEdge("general_assistant", END);
  workflow.addEdge("error_handler", END);

  // Compile workflow with LangSmith tracing configuration
  const compiledWorkflow = workflow.compile();

  // Configure tracing if enabled
  if (process.env.LANGCHAIN_TRACING_V2 === "true") {
    // LangSmith will automatically trace the workflow when environment variables are set
    console.log("LangSmith tracing enabled for supervisor workflow");
  }

  return compiledWorkflow;
};

export default createSupervisorWorkflow;
