"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import AIQueryInterface from "@/components/features/ai-query/AIQueryInterface";

// Predefined prompts based on URL parameters
const PROMPT_TEMPLATES = {
  "new-mover-journey":
    "Create an AI-powered new mover journey campaign for Q4. I want to target new mortgage customers with personalized gifts and moving-related offers from partners like U-Haul, Public Storage, and Hilton.",
  "home-buyer":
    "Create a campaign targeting first-time home buyers with HELOC offers",
  "revenue-opportunities":
    "What are our biggest revenue opportunities this quarter?",
  "customer-behavior": "Analyze customer behavior patterns for millennials",
};

export default function AICommandCenterView() {
  const searchParams = useSearchParams();
  const hasAutoPrompted = useRef(false);

  const promptKey = searchParams.get("prompt");
  const clientId = searchParams.get("client");

  useEffect(() => {
    console.log("AICommandCenterView mounted with params:", {
      promptKey,
      clientId,
    });

    // Auto-input prompt when navigating with specific parameters
    if (promptKey && !hasAutoPrompted.current) {
      const promptText =
        PROMPT_TEMPLATES[promptKey as keyof typeof PROMPT_TEMPLATES];
      console.log("Found prompt template:", promptText);

      if (promptText) {
        hasAutoPrompted.current = true;

        // Wait a bit for the component to mount, then dispatch the auto-prompt
        setTimeout(() => {
          console.log("Dispatching ai-auto-prompt event with:", {
            promptText,
            clientId,
          });
          const event = new CustomEvent("ai-auto-prompt", {
            detail: {
              prompt: promptText,
              clientId: clientId || "abc-fi",
            },
          });
          window.dispatchEvent(event);
          console.log("Auto-prompt event dispatched");
        }, 500);
      } else {
        console.log("No prompt template found for key:", promptKey);
      }
    } else {
      console.log("Auto-prompt conditions not met:", {
        promptKey,
        hasAutoPrompted: hasAutoPrompted.current,
      });
    }
  }, [promptKey, clientId]);

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
      />
    </div>
  );
}
