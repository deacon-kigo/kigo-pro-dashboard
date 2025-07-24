"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useSelector } from "react-redux";
import { type RootState } from "../../lib/redux/store";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { setChatOpen, toggleChat } from "../../lib/redux/slices/uiSlice";
import { useAgentNavigation } from "../../lib/hooks/useAgentNavigation";
import { useCopilotReduxBridge } from "../../lib/copilot-kit/redux-bridge";

/**
 * CopilotKit Chat Sidebar Component
 *
 * This component provides a full-height sidebar chat interface using CopilotKit.
 * It integrates with Redux state and provides a natural language interface
 * for interacting with the Kigo Pro platform.
 */
export function CopilotChatSidebar() {
  const dispatch = useAppDispatch();
  const chatOpen = useAppSelector((state) => state.ui.chatOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const demoState = useSelector((state: RootState) => state.demo);
  const userState = useSelector((state: RootState) => state.user);

  // Initialize Redux bridge
  const { campaignState } = useCopilotReduxBridge();

  // Enable agent-driven navigation
  useAgentNavigation();

  // Handle animations
  useEffect(() => {
    if (chatOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [chatOpen]);

  const handleToggle = () => {
    dispatch(toggleChat());
  };

  const getPersonalizedInstructions = () => {
    const basePlatformInstructions = `You are the Kigo Pro Business Success Manager, an AI assistant specialized in helping users create, manage, and optimize advertising campaigns for the Kigo loyalty media network. You can help with campaign creation, analytics, merchant management, and optimization strategies. You have access to the current page context and can help users navigate and understand the platform.`;

    if (demoState.clientName) {
      return `${basePlatformInstructions}\n\nYou are currently working with ${demoState.clientName}. Tailor your responses to be relevant to their business context and needs.`;
    }

    return basePlatformInstructions;
  };

  return (
    <>
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={handleToggle}
          aria-label="Close chat overlay"
        />
      )}

      {/* Floating Chat Button - positioned when chat is closed */}
      {!chatOpen && (
        <Button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 p-0"
          aria-label="Open AI Assistant"
        >
          <SparklesIcon className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Full-height Sidebar */}
      {chatOpen && (
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
            chatOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  AI Assistant
                </h2>
              </div>
            </div>

            <Button
              onClick={handleToggle}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close AI Assistant"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 overflow-hidden h-[calc(100vh-140px)]">
            <CopilotSidebar
              instructions={getPersonalizedInstructions()}
              defaultOpen={true}
              clickOutsideToClose={false}
              labels={{
                title: "AI Assistant",
                initial:
                  "Hi! I'm your Kigo Pro assistant. How can I help you with your campaigns today?",
              }}
            />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Assistant Online</span>
              </div>
              <div>
                {demoState.clientName && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {demoState.clientName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CopilotChatSidebar;
