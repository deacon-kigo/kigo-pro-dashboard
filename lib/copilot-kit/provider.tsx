"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setChatOpen } from "../redux/slices/uiSlice";
import dynamic from "next/dynamic";

interface CopilotKitProviderProps {
  children: ReactNode;
}

function CopilotKitProviderContent({ children }: CopilotKitProviderProps) {
  const dispatch = useAppDispatch();
  const chatOpen = useAppSelector((state) => state.ui.chatOpen);
  const [isMounted, setIsMounted] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const isEnabled = process.env.NEXT_PUBLIC_FEATURE_COPILOT_CHAT === "true";

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync Redux state to CopilotKit internal state
  useEffect(() => {
    if (isMounted && chatOpen !== copilotOpen) {
      setCopilotOpen(chatOpen);
    }
  }, [chatOpen, copilotOpen, isMounted]);

  // Monitor CopilotKit's DOM changes to detect open/close state
  useEffect(() => {
    if (!isMounted) return;

    const observer = new MutationObserver(() => {
      // Check if CopilotKit sidebar is present in DOM
      const copilotSidebar =
        document.querySelector("[data-copilot-sidebar]") ||
        document.querySelector(".copilotKitSidebar") ||
        document.querySelector('[class*="sidebar"]');

      const isCurrentlyOpen =
        !!copilotSidebar &&
        !copilotSidebar.classList.contains("hidden") &&
        copilotSidebar.getAttribute("aria-hidden") !== "true";

      if (isCurrentlyOpen !== chatOpen) {
        dispatch(setChatOpen(isCurrentlyOpen));
      }
    });

    // Observe document for CopilotKit changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "aria-hidden", "style"],
    });

    return () => observer.disconnect();
  }, [isMounted, dispatch, chatOpen]);

  // Don't render anything until mounted to prevent hydration errors
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <CopilotKit
      runtimeUrl={process.env.COPILOT_RUNTIME_URL || "/api/copilot"}
      agent="kigo-pro-agent"
    >
      {isEnabled ? (
        <CopilotSidebar
          key={`copilot-sidebar-${chatOpen}`}
          instructions="You are the Kigo Pro Business Success Manager, an AI assistant specialized in helping users create, manage, and optimize advertising campaigns for the Kigo loyalty media network. You can help with campaign creation, analytics, merchant management, and optimization strategies. You have access to the current page context and can help users navigate and understand the platform."
          defaultOpen={chatOpen}
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

// Export as dynamic component to prevent SSR
export const CopilotKitProvider = dynamic(
  () => Promise.resolve(CopilotKitProviderContent),
  {
    ssr: false,
    loading: () => <div>{/* Loading placeholder */}</div>,
  }
);
