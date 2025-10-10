"use client";

import React from "react";

/**
 * Loading message component with animated dots
 * Shows when AI is generating a response
 */
export function LoadingMessage() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] flex items-start space-x-2">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>

        <div className="bg-gray-100 rounded-lg px-4 py-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
