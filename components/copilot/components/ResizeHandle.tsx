"use client";

import React from "react";

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * Draggable resize handle for adjusting chat window width
 * Shows visual feedback on hover and active states
 */
export function ResizeHandle({ onMouseDown }: ResizeHandleProps) {
  return (
    <div
      className="absolute left-0 top-0 w-1 h-full cursor-ew-resize bg-gray-300 hover:bg-blue-500 transition-colors z-10 group"
      onMouseDown={onMouseDown}
    >
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gray-400 group-hover:bg-blue-600 transition-colors" />
    </div>
  );
}
