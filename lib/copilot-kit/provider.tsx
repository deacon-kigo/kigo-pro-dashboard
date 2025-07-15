"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode } from "react";

interface CopilotKitProviderProps {
  children: ReactNode;
}

export function CopilotKitProvider({ children }: CopilotKitProviderProps) {
  const isEnabled = process.env.NEXT_PUBLIC_FEATURE_COPILOT_CHAT === "true";

  return (
    <CopilotKit
      runtimeUrl={process.env.COPILOT_RUNTIME_URL || "/api/copilot"}
      agent="kigo-pro-agent"
    >
      {isEnabled ? (
        <CopilotSidebar
          instructions="You are the Kigo Pro Business Success Manager, an AI assistant specialized in helping users create, manage, and optimize advertising campaigns for the Kigo loyalty media network. You can help with campaign creation, analytics, merchant management, and optimization strategies. You have access to the current page context and can help users navigate and understand the platform."
          defaultOpen={false}
          clickOutsideToClose={true}
          labels={{
            title: "AI Assistant",
            initial:
              "Hi! I'm your Kigo Pro assistant. How can I help you with your campaigns today?",
          }}
        >
          {children}
        </CopilotSidebar>
      ) : (
        children
      )}
    </CopilotKit>
  );
}
