"use client";

import type { ReactNode } from "react";
import { createContext, use, useState } from "react";

interface ChatContextType {
  chatWidth: number;
  closePanel: () => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  setChatWidth: (width: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(450);

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);

  return (
    <ChatContext
      value={{
        chatWidth,
        closePanel,
        isPanelOpen,
        openPanel,
        setChatWidth,
      }}
    >
      {children}
    </ChatContext>
  );
}

export function useChatContext() {
  const context = use(ChatContext);

  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
}
