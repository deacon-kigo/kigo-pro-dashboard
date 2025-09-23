/**
 * AI Query Trigger - Floating Action Button
 *
 * A floating action button that opens the AI Query Interface.
 * Positioned strategically to not conflict with CopilotKit sidebar.
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, Sparkles, Zap, Keyboard } from "lucide-react";
import AIQueryInterface from "./AIQueryInterface";
import { useAppSelector } from "@/lib/redux/hooks";

interface AIQueryTriggerProps {
  mode?: "copilotkit" | "vercel-ai";
  position?: "bottom-left" | "bottom-right" | "top-right";
  apiEndpoint?: string;
}

export default function AIQueryTrigger({
  mode = "vercel-ai",
  position = "bottom-left",
  apiEndpoint = "/api/ai/chat",
}: AIQueryTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const chatOpen = useAppSelector((state) => state.ui.chatOpen);

  // Position classes based on prop and CopilotKit state
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6";
      case "bottom-right":
        // Adjust if CopilotKit chat is open
        return chatOpen ? "bottom-6 right-96" : "bottom-6 right-20";
      case "top-right":
        return "top-20 right-6";
      default:
        return "bottom-6 left-6";
    }
  };

  // Keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open AI Query
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <div
        className={`fixed ${getPositionClasses()} z-40 transition-all duration-300 ease-in-out`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
            AI Command Center
            <div className="flex items-center gap-1 mt-1 opacity-75">
              <Keyboard className="w-3 h-3" />
              <span>⌘K</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}

        {/* Main Button */}
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 p-0 group"
          aria-label="Open AI Command Center"
        >
          <div className="relative">
            <Command className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </Button>

        {/* Mode Badge */}
        <div className="absolute -top-2 -right-2">
          <Badge
            variant="secondary"
            className="text-xs bg-white border border-gray-200 text-gray-700 shadow-sm"
          >
            {mode === "copilotkit" ? (
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>CK</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>AI</span>
              </div>
            )}
          </Badge>
        </div>
      </div>

      {/* Expanded Button with Quick Actions (when hovering) */}
      {showTooltip && (
        <div
          className={`fixed ${getPositionClasses()} z-30 transition-all duration-300 ease-in-out`}
        >
          <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-48">
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Quick Commands
              </p>
              <button
                onClick={() => {
                  setIsOpen(true);
                  // Pre-fill with home buyer query
                  setTimeout(() => {
                    const event = new CustomEvent("prefill-query", {
                      detail:
                        "Create a campaign targeting first-time home buyers with HELOC offers",
                    });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
              >
                🏠 Home buyer campaigns
              </button>
              <button
                onClick={() => {
                  setIsOpen(true);
                  setTimeout(() => {
                    const event = new CustomEvent("prefill-query", {
                      detail:
                        "What are our biggest revenue opportunities this quarter?",
                    });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
              >
                💰 Revenue opportunities
              </button>
              <button
                onClick={() => {
                  setIsOpen(true);
                  setTimeout(() => {
                    const event = new CustomEvent("prefill-query", {
                      detail:
                        "Analyze customer behavior patterns for millennials",
                    });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
              >
                📊 Behavior analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Query Interface Modal */}
      <AIQueryInterface
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={mode}
        apiEndpoint={apiEndpoint}
      />
    </>
  );
}
