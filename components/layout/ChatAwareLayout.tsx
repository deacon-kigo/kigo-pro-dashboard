"use client";

import React from "react";
import { useAppSelector } from "@/lib/redux/hooks";

interface ChatAwareLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout wrapper that adjusts content when chat is open
 * This component makes the main content responsive to the chat window
 */
export function ChatAwareLayout({
  children,
  className = "",
}: ChatAwareLayoutProps) {
  const { chatOpen, chatWidth } = useAppSelector((state) => state.ui);

  // Calculate the right margin when chat is open
  const rightMargin = chatOpen ? `${chatWidth}px` : "0px";

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${className}`}
      style={{
        marginRight: rightMargin,
      }}
    >
      {children}
    </div>
  );
}
