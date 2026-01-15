"use client";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { toggleChat, setChatWidth } from "@/lib/redux/slices/uiSlice";

import { ChatPanel } from "./chat-panel";

export function AIChatBot() {
  const dispatch = useAppDispatch();
  const { chatOpen, chatWidth } = useAppSelector((state) => state.ui);

  const handleChatWidthChange = (width: number) =>
    dispatch(setChatWidth(width));
  const handleClosePanel = () => dispatch(toggleChat());

  return (
    <>
      {/* Chat panel - slides in from right when open */}
      {chatOpen && (
        <div className="fixed top-0 right-0 z-40 flex h-full transition-transform duration-300 ease-in-out">
          <ChatPanel
            chatWidth={chatWidth}
            onChatWidthChange={handleChatWidthChange}
            onClose={handleClosePanel}
          />
        </div>
      )}
    </>
  );
}
