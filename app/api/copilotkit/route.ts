/**
 * CopilotKit API Route for Kigo Pro Dashboard
 *
 * This route integrates our LangGraph multi-agent system with CopilotKit.
 * Routes ALL user messages through LangGraph supervisor for proper orchestration.
 */
import { CopilotRuntime, OpenAIAdapter } from "@copilotkit/runtime";
import { NextRequest } from "next/server";

// Function to call Python LangGraph backend
async function callPythonBackend(message: string, context: any) {
  try {
    const appContext = extractAppContext(context);

    console.log("[CopilotKit] 🐍 Calling Python LangGraph backend:", {
      message,
      contextKeys: Object.keys(appContext),
    });

    const response = await fetch("http://localhost:8000/api/copilotkit/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        context: appContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const result = await response.json();
    console.log("[CopilotKit] ✅ Python backend response:", result);

    return result;
  } catch (error) {
    console.error("[CopilotKit] ❌ Error calling Python backend:", error);
    return {
      message:
        "I encountered an error processing your request. Please try again or contact support.",
      actions: [],
    };
  }
}

// Function to execute actions returned by Python backend
async function executeActionsFromLangGraph(actions: any[], runtime: any) {
  if (!actions || actions.length === 0) {
    return [];
  }

  console.log("[CopilotKit] 🎯 Executing actions from LangGraph:", actions);

  const actionResults = [];

  for (const action of actions) {
    try {
      console.log(
        `[CopilotKit] 📝 Executing action: ${action.action_name}`,
        action.parameters
      );

      // Map Python action names to CopilotKit action names
      const actionMap = {
        navigateToAdCreation: "navigateToAdCreation",
        navigateToAnalytics: "navigateToAnalytics",
        createAd: "createAd",
        requestApproval: "requestApproval",
        // Add more mappings as needed
      };

      const copilotActionName =
        actionMap[action.action_name] || action.action_name;

      // Create a mock handler event to execute the action
      const mockEvent = {
        name: copilotActionName,
        parameters: action.parameters || {},
      };

      // For now, we'll just log the action and return a success result
      // The actual action execution will happen when the frontend receives this
      actionResults.push({
        actionName: action.action_name,
        success: true,
        result: `Action ${action.action_name} queued for execution`,
        parameters: action.parameters,
      });
    } catch (error) {
      console.error(
        `[CopilotKit] ❌ Failed to execute action ${action.action_name}:`,
        error
      );

      actionResults.push({
        actionName: action.action_name,
        success: false,
        error: error.message,
      });
    }
  }

  return actionResults;
}

// Extract application context from CopilotKit context
function extractAppContext(context: any) {
  return {
    currentPage: context?.currentPage || "/",
    userRole: context?.userRole || "user",
    isLoading: context?.isLoading || false,
    notifications: context?.notifications || [],
    activeModal: context?.activeModal,
    campaignData: {
      currentStep: context?.campaignData?.currentStep || 0,
      ads: context?.campaignData?.ads || [],
      budget: context?.campaignData?.budget,
      basicInfo: context?.campaignData?.basicInfo,
    },
    sessionId: context?.sessionId || `session_${Date.now()}`,
  };
}

const runtime = new CopilotRuntime({
  actions: [
    {
      name: "handleUserMessage",
      description: "Process all user messages through Python LangGraph backend",
      parameters: [
        { name: "message", type: "string", required: true },
        { name: "context", type: "object", required: false },
      ],
      handler: async ({ message, context }) => {
        console.log(
          "[CopilotKit] 🎯 Routing message to Python backend:",
          message
        );

        // Call Python LangGraph backend
        const backendResult = await callPythonBackend(message, context || {});

        // Execute any actions returned by LangGraph
        if (backendResult.actions && backendResult.actions.length > 0) {
          console.log(
            "[CopilotKit] 🚀 Found actions to execute:",
            backendResult.actions
          );
          const actionResults = await executeActionsFromLangGraph(
            backendResult.actions,
            runtime
          );
          console.log(
            "[CopilotKit] ✅ Action execution results:",
            actionResults
          );

          // Store action results for potential use by frontend
          global.lastActionResults = actionResults;
        }

        return backendResult.message || "I'm not sure how to respond to that.";
      },
    },

    // CopilotKit Action: Navigate to Ad Creation
    {
      name: "navigateToAdCreation",
      description: "Navigate user to the ad creation page",
      parameters: [
        {
          name: "adType",
          type: "string",
          required: false,
          description: "Type of ad to create",
        },
      ],
      handler: async ({ adType = "display" }) => {
        console.log("[CopilotKit] 🎯 Navigation action called:", { adType });
        // This will be handled by frontend action registration
        return `Navigating to ad creation page for ${adType} ads...`;
      },
    },

    // CopilotKit Action: Navigate to Analytics
    {
      name: "navigateToAnalytics",
      description: "Navigate user to the analytics dashboard",
      parameters: [],
      handler: async () => {
        console.log("[CopilotKit] 📊 Analytics navigation action called");
        // This will be handled by frontend action registration
        return "Navigating to analytics dashboard...";
      },
    },

    // CopilotKit Action: Create Ad
    {
      name: "createAd",
      description: "Create a new advertising campaign ad",
      parameters: [
        { name: "adName", type: "string", required: true },
        { name: "merchant", type: "string", required: true },
        { name: "offer", type: "string", required: true },
        { name: "mediaType", type: "string", required: false },
        { name: "costPerActivation", type: "number", required: false },
        { name: "costPerRedemption", type: "number", required: false },
      ],
      handler: async (params) => {
        console.log("[CopilotKit] 📝 Create ad action called:", params);
        // This will be handled by frontend action registration
        return `Creating ad "${params.adName}" for ${params.merchant}...`;
      },
    },
  ],
});

export const { GET, POST } = runtime.streamingEndpoints({
  runtime,
  serviceAdapter: new OpenAIAdapter(),
  endpoint: "/api/copilotkit",
});
