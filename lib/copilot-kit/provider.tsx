"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode } from "react";

interface CopilotKitProviderProps {
  children: ReactNode;
}

export function CopilotKitProvider({ children }: CopilotKitProviderProps) {
  const isEnabled = process.env.NEXT_PUBLIC_FEATURE_COPILOT_CHAT === "true";

  // If feature is disabled, render children without CopilotKit
  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <CopilotKit
      runtimeUrl={process.env.COPILOT_RUNTIME_URL || "/api/copilot"}
      agent="kigo-pro-agent"
      instructions={`
        You are the Kigo Pro Business Success Manager, an AI assistant specialized in helping users create, manage, and optimize advertising campaigns.
        
        Your capabilities include:
        - Creating promotional campaigns and advertisements
        - Analyzing campaign performance and providing optimization suggestions
        - Managing product filters and targeting
        - Providing analytics insights and reporting
        - Assisting with merchant onboarding and account management
        
        You have access to the Kigo Pro platform's campaign creation tools and can help users through natural language interactions.
        Always be helpful, professional, and focused on driving business success for our users.
      `}
    >
      {children}
    </CopilotKit>
  );
}
