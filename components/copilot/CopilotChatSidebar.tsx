"use client";

import { useState, useEffect } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import {
  XMarkIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useCopilotReduxBridge } from "../../lib/copilot-kit/redux-bridge";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";

/**
 * CopilotKit Chat Sidebar Component
 *
 * This component provides a full-height sidebar chat interface using CopilotKit.
 * It integrates with Redux state and provides a natural language interface
 * for interacting with the Kigo Pro platform.
 */
export function CopilotChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if the new AI system is enabled
  const isEnabled = process.env.NEXT_PUBLIC_FEATURE_COPILOT_CHAT === "true";

  // Get current user context for personalization
  const demoState = useSelector((state: RootState) => state.demo);
  const userState = useSelector((state: RootState) => state.user);

  // Initialize Redux bridge
  const { campaignState } = useCopilotReduxBridge();

  // Handle animations
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Add class to body to adjust main content
      document.body.classList.add("copilot-chat-open");
    } else {
      setIsAnimating(false);
      document.body.classList.remove("copilot-chat-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("copilot-chat-open");
    };
  }, [isOpen]);

  // Don't render if feature is disabled
  if (!isEnabled) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Get personalized instructions based on current context
  const getPersonalizedInstructions = () => {
    const baseInstructions = `You are the Kigo Pro Business Success Manager, an AI assistant specialized in helping users create, manage, and optimize advertising campaigns for the Kigo loyalty media network.`;

    const contextualInstructions = `
Current Context:
- User Role: ${userState.role || "User"}
- Demo Environment: ${demoState.currentDemo || "Default"}
- Current Campaign Status: ${campaignState.currentStep < 5 ? "In Progress" : "Complete"}

Your capabilities include:
- Creating promotional campaigns and advertisements through natural language
- Analyzing campaign performance and providing optimization suggestions
- Managing product filters and targeting parameters
- Providing analytics insights and reporting
- Assisting with merchant onboarding and account management

Key Features:
- You can create campaigns by extracting parameters from natural language (e.g., "Create a $500 pizza restaurant campaign targeting families")
- You have access to the current Redux state and can update it through actions
- You can provide real-time analytics and performance insights
- You can guide users through the campaign creation process step by step

Always be helpful, professional, and focused on driving business success. Ask clarifying questions when needed and provide specific, actionable recommendations.`;

    return baseInstructions + contextualInstructions;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 group ${
          isOpen ? "scale-90" : "scale-100 hover:scale-110"
        }`}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <div className="relative">
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <SparklesIcon className="h-3 w-3 absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            AI Assistant
            <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleToggle}
        />
      )}

      {/* Full-height Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Kigo Pro Assistant
              </h2>
              <p className="text-sm text-gray-600">Business Success Manager</p>
            </div>
          </div>

          <button
            onClick={handleToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close AI Assistant"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-600 mb-2">Quick Actions:</div>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors">
              Create Campaign
            </button>
            <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors">
              Optimize Performance
            </button>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors">
              View Analytics
            </button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          {isAnimating && (
            <CopilotSidebar
              instructions={getPersonalizedInstructions()}
              defaultOpen={true}
              className="h-full"
              clickOutsideToClose={false}
              style={{
                height: "100%",
                border: "none",
                borderRadius: "0",
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI Assistant Online</span>
            </div>
            <div>
              {demoState.currentDemo && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {demoState.currentDemo}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for body adjustment */}
      <style jsx global>{`
        .copilot-chat-open {
          margin-right: 384px; /* 24rem = 384px */
          transition: margin-right 0.3s ease-in-out;
        }

        @media (max-width: 768px) {
          .copilot-chat-open {
            margin-right: 0;
          }
        }
      `}</style>
    </>
  );
}

export default CopilotChatSidebar;
