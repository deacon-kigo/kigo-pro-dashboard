"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface CopilotKitProviderProps {
  children: ReactNode;
}

function CopilotKitProviderContent({ children }: CopilotKitProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isEnabled = process.env.NEXT_PUBLIC_FEATURE_COPILOT_CHAT === "true";

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration errors
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <CopilotKit
      runtimeUrl={
        process.env.NEXT_PUBLIC_COPILOT_RUNTIME_URL || "/api/copilotkit"
      }
      showDevConsole={true}
    >
      {children}
      {isEnabled && (
        <div style={{ zIndex: 10 }}>
          <CopilotSidebar
            instructions="You are the Kigo Pro Business Success Manager, an AI assistant specialized in helping users create, manage, and optimize advertising campaigns for the Kigo loyalty media network. You can help with campaign creation, analytics, merchant management, and optimization strategies. You have access to the current page context and can help users navigate and understand the platform."
            labels={{
              title: "AI Assistant",
              initial:
                "Hi! I'm your Kigo Pro assistant. How can I help you with your campaigns today?",
            }}
          />
        </div>
      )}
    </CopilotKit>
  );
}

// Export as dynamic component to prevent SSR
export const CopilotKitProvider = dynamic(
  () => Promise.resolve(CopilotKitProviderContent),
  {
    ssr: false,
    loading: () => <div>{/* Loading placeholder */}</div>,
  }
);
