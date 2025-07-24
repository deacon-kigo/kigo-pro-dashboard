import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  createTracedFunction,
  logAgentInteraction,
} from "../../lib/copilot-kit/langsmith-config";
import campaignAgent from "./campaign-agent";

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
 * Define state schema using LangGraph Annotation
 *
 * This schema supports both Studio and production input formats:
 * - Studio: Simple { messages: BaseMessage[] }
 * - Production: Full KigoProAgentState with context
 */
const KigoProStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  }),
  userIntent: Annotation<string>({
    reducer: (x: string, y: string) => y ?? x,
    default: () => "",
  }),
  context: Annotation<{
    currentPage: string;
    userRole: string;
    campaignData?: any;
    sessionId: string;
  }>({
    reducer: (x: any, y: any) => ({ ...x, ...y }),
    default: () => ({
      currentPage: "studio",
      userRole: "admin",
      sessionId: `session_${Date.now()}`,
    }),
  }),
  agentDecision: Annotation<string>({
    reducer: (x: string, y: string) => y ?? x,
    default: () => "",
  }),
  workflowData: Annotation<any>({
    reducer: (x: any, y: any) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  error: Annotation<string>({
    reducer: (x: string, y: string) => y ?? x,
    default: () => "",
  }),
});

/**
 * Supervisor Agent
 *
 * The supervisor agent analyzes user input and routes to appropriate
 * specialist agents based on intent and context.
 *
 * Supports both:
 * - Studio input: { messages: BaseMessage[] }
 * - Production input: Full KigoProAgentState
 */
const supervisorAgent = createTracedFunction(
  "supervisor_agent",
  async (
    state: Partial<KigoProAgentState>
  ): Promise<Partial<KigoProAgentState>> => {
    try {
      // Handle both Studio and production input formats
      const { messages = [], context } = state;

      // Ensure we have complete context (auto-create for Studio)
      const fullContext = {
        currentPage: context?.currentPage || "studio",
        userRole: context?.userRole || "admin",
        sessionId: context?.sessionId || `session_${Date.now()}`,
        campaignData: context?.campaignData,
      };

      // Get the latest user message
      if (messages.length === 0) {
        return {
          agentDecision: "general_assistant",
          context: fullContext,
        };
      }

      const latestMessage = messages[messages.length - 1];
      const userInput = latestMessage.content as string;

      // Analyze user intent
      const intent = await analyzeUserIntent(userInput, fullContext);

      // Determine routing decision
      const decision = determineAgentRouting(intent, fullContext);

      // Log interaction to LangSmith
      logAgentInteraction(
        "supervisor",
        { userInput, context: fullContext },
        { intent, decision },
        { routing: decision }
      );

      return {
        userIntent: intent,
        agentDecision: decision,
        context: fullContext,
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

  // Intent patterns for different agent types - more flexible matching
  const intentPatterns = {
    ad_creation: [
      "create ad",
      "creating ad",
      "creating an ad",
      "create an ad",
      "new ad",
      "make ad",
      "making ad",
      "making an ad",
      "build ad",
      "building ad",
      "building an ad",
      "start ad",
      "starting ad",
      "help with ad",
      "help creating",
      "help with creating",
      "need ad",
      "want ad",
      "promotional ad",
      "advertising ad",
      "create campaign",
      "new campaign",
      "make campaign",
      "build campaign",
      "advertising campaign",
      "promotion campaign",
      "merchant offer",
      "upload image",
      "upload media",
      "add image",
      "add media",
      "ad creation",
      "ad for",
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
      "filters",
      "filtering",
    ],
    analytics_query: [
      "show analytics",
      "campaign stats",
      "performance data",
      "how is campaign doing",
      "analytics dashboard",
      "reports",
      "analytics",
      "data",
      "metrics",
      "performance",
    ],
    merchant_support: [
      "help with",
      "how to",
      "support",
      "guidance",
      "merchant setup",
      "account management",
      "need help",
      "assistance",
    ],
  };

  // Check for intent matches with improved logic
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (patterns.some((pattern) => input.includes(pattern))) {
      console.log(
        `[Supervisor] Intent detected: ${intent} for input: "${userInput}"`
      );
      return intent;
    }
  }

  // Context-based intent detection
  if (context.currentPage?.includes("ads-create")) {
    console.log(
      `[Supervisor] Context-based intent: ad_creation (on ads-create page)`
    );
    return "ad_creation";
  }

  if (context.currentPage?.includes("campaigns")) {
    console.log(
      `[Supervisor] Context-based intent: ad_creation (on campaigns page)`
    );
    return "ad_creation";
  }

  if (context.currentPage?.includes("analytics")) {
    console.log(
      `[Supervisor] Context-based intent: analytics_query (on analytics page)`
    );
    return "analytics_query";
  }

  if (context.currentPage?.includes("product-filters")) {
    console.log(
      `[Supervisor] Context-based intent: filter_management (on filters page)`
    );
    return "filter_management";
  }

  // Default to general assistance
  console.log(
    `[Supervisor] No specific intent detected, using general_assistance for: "${userInput}"`
  );
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
    case "ad_creation":
    case "campaign_creation":
    case "campaign_optimization":
      return "campaign_agent";

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
 * Filter Agent (Stub Implementation)
 * TODO: Implement full filter management functionality
 */
const filterAgent = createTracedFunction(
  "filter_agent",
  async (state: KigoProAgentState): Promise<Partial<KigoProAgentState>> => {
    const { messages } = state;

    const response = new AIMessage({
      content: `🎯 **Product Filter Management**

I can help you create and manage product filters! Here's what I can do:

• **Create new filters** - Define targeting criteria
• **Edit existing filters** - Modify filter rules  
• **Analyze coverage** - See how many products match
• **Optimize performance** - Improve filter efficiency

The filter management feature is currently being enhanced. For now, you can:
1. Visit the **Product Filters** page manually
2. Create filters using the existing form interface
3. Come back here when the feature is ready!

What specific filtering task would you like help with?`,
    });

    return {
      messages: [...messages, response],
    };
  }
);

/**
 * Analytics Agent (Stub Implementation)
 * TODO: Implement full analytics and reporting functionality
 */
const analyticsAgent = createTracedFunction(
  "analytics_agent",
  async (state: KigoProAgentState): Promise<Partial<KigoProAgentState>> => {
    const { messages } = state;

    const response = new AIMessage({
      content: `📊 **Campaign Analytics & Insights**

I can help you analyze your campaign performance! Here's what I can do:

• **Performance reports** - ROI, conversions, click-through rates
• **Trend analysis** - Track performance over time
• **Optimization suggestions** - Improve campaign results
• **Custom dashboards** - Personalized analytics views

The analytics feature is currently being enhanced. For now, you can:
1. Visit the **Analytics Dashboard** manually  
2. View existing reports and charts
3. Come back here when advanced AI analytics are ready!

What specific metrics would you like to analyze?`,
    });

    return {
      messages: [...messages, response],
    };
  }
);

/**
 * Merchant Agent (Stub Implementation)
 * TODO: Implement full merchant support and guidance functionality
 */
const merchantAgent = createTracedFunction(
  "merchant_agent",
  async (state: KigoProAgentState): Promise<Partial<KigoProAgentState>> => {
    const { messages } = state;

    const response = new AIMessage({
      content: `🏪 **Merchant Support & Guidance**

I'm here to help with merchant-related questions! I can assist with:

• **Account setup** - Getting merchants onboarded
• **Best practices** - Optimization tips and strategies  
• **Troubleshooting** - Resolving common issues
• **Feature guidance** - How to use platform features

The merchant support feature is currently being enhanced. For now, you can:
1. Check the **Help Documentation**
2. Contact support directly for urgent issues
3. Come back here when AI-powered support is ready!

What merchant-related question can I help you with?`,
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
  // Use our custom state annotation
  const workflow = new StateGraph(KigoProStateAnnotation)
    .addNode("supervisor", supervisorAgent)
    .addNode("campaign_agent", campaignAgent)
    .addNode("general_assistant", generalAssistant)
    .addNode("error_handler", errorHandler)
    .addNode("filter_agent", filterAgent)
    .addNode("analytics_agent", analyticsAgent)
    .addNode("merchant_agent", merchantAgent)
    .addEdge(START, "supervisor")
    .addConditionalEdges("supervisor", routeToAgent)
    .addEdge("campaign_agent", END)
    .addEdge("general_assistant", END)
    .addEdge("error_handler", END)
    .addEdge("filter_agent", END)
    .addEdge("analytics_agent", END)
    .addEdge("merchant_agent", END);

  // Compile workflow with LangSmith tracing configuration
  const compiledWorkflow = workflow.compile();

  // Configure tracing if enabled
  if (process.env.LANGCHAIN_TRACING_V2 === "true") {
    // LangSmith will automatically trace the workflow when environment variables are set
    console.log("LangSmith tracing enabled for supervisor workflow");
  }

  return compiledWorkflow;
};

// Export the compiled workflow as default for LangGraph Studio
export default createSupervisorWorkflow();
