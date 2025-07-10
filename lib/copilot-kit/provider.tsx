"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode } from "react";

interface CopilotKitProviderProps {
  children: ReactNode;
}

export function CopilotKitProvider({ children }: CopilotKitProviderProps) {
  const isEnabled = process.env.NEXT_PUBLIC_FEATURE_COPILOT_CHAT === "true";

  // Always provide CopilotKit context to prevent build-time errors
  // Even if disabled, components that use CopilotKit hooks still need the provider
  return (
    <CopilotKit
      runtimeUrl={process.env.COPILOT_RUNTIME_URL || "/api/copilot"}
      agent="kigo-pro-agent"
    >
      {children}
    </CopilotKit>
  );
}
