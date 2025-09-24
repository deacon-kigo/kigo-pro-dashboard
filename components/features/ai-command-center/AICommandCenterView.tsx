"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import AIQueryInterface from "@/components/features/ai-query/AIQueryInterface";

// Predefined conversation flows based on URL parameters
const CONVERSATION_FLOWS = {
  "new-mover-journey": {
    userMessage:
      "Create an AI-powered new mover journey campaign for Q4. I want to target new mortgage customers with personalized gifts and moving-related offers from partners like U-Haul, Public Storage, and Hilton.",
    aiResponse:
      "Excellent choice, Tucker! Let's architect your AI-Powered New Mover Journey. I'll guide you through configuring each step of the conversational experience. You can customize the gift value, messaging, and partner offers to match your campaign objectives.",
    uiComponent: {
      type: "campaign-builder" as const,
      props: {
        campaignType: "AI-Powered New Mover Journey",
        targetAudience: "New mortgage customers",
        offers: [
          "$100 AI Gift Personalization",
          "Moving Journey Bundle",
          "U-Haul, Public Storage, Hilton",
        ],
        steps: [
          "Step 1: AI-powered gifting moment ($100 value)",
          "Step 2: Follow-up conversation about move planning",
          "Step 3: Moving Journey bundle with partner offers",
        ],
      },
    },
  },
  "home-buyer": {
    userMessage:
      "Create a campaign targeting first-time home buyers with HELOC offers",
    aiResponse:
      "Perfect! I'll help you create a targeted HELOC campaign for first-time home buyers. This is a high-value segment with excellent conversion potential.",
    uiComponent: {
      type: "campaign-builder" as const,
      props: {
        campaignType: "First-Time Home Buyer HELOC Campaign",
        targetAudience: "First-time home buyers",
        offers: [
          "HELOC Special Rate",
          "Moving Day Package",
          "First-Time Buyer Bonus",
        ],
      },
    },
  },
};

export default function AICommandCenterView() {
  const searchParams = useSearchParams();
  const promptKey = searchParams.get("prompt");
  const clientId = searchParams.get("client");

  // Pre-populate initial messages based on URL parameters
  const initialMessages = useMemo(() => {
    if (
      promptKey &&
      CONVERSATION_FLOWS[promptKey as keyof typeof CONVERSATION_FLOWS]
    ) {
      const flow =
        CONVERSATION_FLOWS[promptKey as keyof typeof CONVERSATION_FLOWS];

      const userMessage = {
        id: Date.now().toString() + "-user",
        role: "user" as const,
        content: flow.userMessage,
      };

      const aiMessage = {
        id: Date.now().toString() + "-assistant",
        role: "assistant" as const,
        content: flow.aiResponse,
      };

      return {
        messages: [userMessage, aiMessage],
        uiComponent: flow.uiComponent
          ? { messageId: aiMessage.id, component: flow.uiComponent }
          : null,
      };
    }

    return { messages: [], uiComponent: null };
  }, [promptKey]);

  return (
    <div className="h-full w-full">
      <AIQueryInterface
        isOpen={true}
        onClose={() => {
          // Navigate back to previous page or dashboard
          window.history.back();
        }}
        mode="vercel-ai"
        apiEndpoint="/api/ai/chat"
        isFullScreen={true}
        initialMessages={initialMessages.messages}
        initialUIComponent={initialMessages.uiComponent}
      />
    </div>
  );
}
