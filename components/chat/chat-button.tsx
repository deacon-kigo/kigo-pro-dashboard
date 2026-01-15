"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  const handleClick = () => {
    onClick();
  };

  return (
    <div className="fixed right-6 bottom-6 z-30">
      <button
        aria-label="Open Kigo AI Assistant"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl"
        onClick={handleClick}
        type="button"
      >
        <SparklesIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}
