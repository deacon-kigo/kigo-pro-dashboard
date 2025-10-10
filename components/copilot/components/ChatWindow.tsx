"use client";

import React, { forwardRef } from "react";

interface ChatWindowProps {
  isOpen: boolean;
  width: number;
  children: React.ReactNode;
}

/**
 * Main chat window container with slide-in animation
 * Handles positioning, sizing, and animation states
 */
export const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(
  ({ isOpen, width, children }, ref) => {
    return (
      <div
        ref={ref}
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          width: `${width}px`,
        }}
      >
        {children}
      </div>
    );
  }
);
