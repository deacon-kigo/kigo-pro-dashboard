"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";
import { ABCFIDemoChat } from "./ABCFIDemoChat";

interface ABCFIDemoTriggerProps {
  onDashboardTransition: (step: string, data?: any) => void;
}

export function ABCFIDemoTrigger({
  onDashboardTransition,
}: ABCFIDemoTriggerProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);

    // Reset dashboard when closing chat
    if (isChatOpen) {
      onDashboardTransition("reset");
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div
        className="fixed bottom-6 right-6 z-40"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && !isChatOpen && (
          <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
            Reward AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}

        {/* FAB Button */}
        <Button
          onClick={handleToggleChat}
          className={`h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 p-0 group ${
            isChatOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gradient-to-br from-[#2563eb] to-[#9333ea] hover:from-[#1d4ed8] hover:to-[#7c3aed]"
          }`}
          aria-label={isChatOpen ? "Close AI Assistant" : "Open AI Assistant"}
        >
          {isChatOpen ? (
            <div className="relative">
              <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
            </div>
          ) : (
            <div className="relative">
              <Sparkles className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      <ABCFIDemoChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onDashboardTransition={onDashboardTransition}
      />
    </>
  );
}
