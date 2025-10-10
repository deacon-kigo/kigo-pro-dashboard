"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UserIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UserMessageProps {
  message: Message;
  onDelete: () => void;
}

/**
 * User message component with avatar and delete option
 * Displays user messages with consistent styling
 */
export function UserMessage({ message, onDelete }: UserMessageProps) {
  return (
    <div className="flex justify-end group">
      <div className="max-w-[80%] flex items-start space-x-2">
        <div className="bg-blue-600 text-white rounded-lg px-4 py-2">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="h-4 w-4 text-white" />
          </div>

          <Button
            onClick={onDelete}
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
            title="Delete message"
          >
            <TrashIcon className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
