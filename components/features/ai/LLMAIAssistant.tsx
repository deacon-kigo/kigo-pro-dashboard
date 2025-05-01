"use client";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  addMessage,
  setIsProcessing,
  magicGenerate,
} from "@/lib/redux/slices/ai-assistantSlice";
import ChatPanel, { AIMessage } from "./ChatPanel";

// Type for response options
interface ResponseOption {
  text: string;
  value: string;
}

interface LLMAIAssistantProps {
  onOptionSelected: (optionId: string) => void;
  className?: string;
  title?: string;
  description?: string;
  requiredCriteriaTypes?: string[];
  initialMessage?: string;
}

export const LLMAIAssistant: React.FC<LLMAIAssistantProps> = ({
  onOptionSelected,
  className = "",
  title = "AI Assistant",
  description,
  requiredCriteriaTypes = [],
  initialMessage,
}) => {
  const dispatch = useDispatch();

  // Redux state
  const {
    messages: reduxMessages,
    isProcessing: reduxIsProcessing,
    currentCriteria,
  } = useSelector((state: RootState) => state.aiAssistant);

  // Add initial welcome message if none exists
  React.useEffect(() => {
    if (reduxMessages.length === 0 && initialMessage) {
      dispatch(
        addMessage({
          type: "ai",
          content: initialMessage,
        })
      );
    }
  }, [dispatch, reduxMessages.length, initialMessage]);

  // Handle message sending through Redux
  const handleSendMessage = React.useCallback(
    (messageText: string) => {
      if (!messageText.trim()) return;

      // Add user message
      dispatch(
        addMessage({
          type: "user",
          content: messageText,
        })
      );

      // Set processing state
      dispatch(setIsProcessing(true));

      // Let the middleware handle all message processing
      // No additional processing here to ensure unidirectional flow
    },
    [dispatch]
  );

  // Handle magic generate button click
  const handleMagicGenerate = React.useCallback(() => {
    // Add user message
    dispatch(
      addMessage({
        type: "user",
        content: "Please generate a filter for me automatically",
      })
    );

    // Let the middleware handle the rest
    dispatch(magicGenerate());
  }, [dispatch]);

  // Option selected handler
  const handleOptionSelected = React.useCallback(
    (optionValue: string) => {
      console.log("Option selected:", optionValue);

      // Check for special option values related to filter generation
      if (
        optionValue === "magic_generate" ||
        optionValue === "generate_filter"
      ) {
        handleMagicGenerate();
        return;
      }

      // Pass through to parent component
      onOptionSelected(optionValue);
    },
    [onOptionSelected, handleMagicGenerate]
  );

  return (
    <ChatPanel
      title={title}
      description={description}
      messages={reduxMessages}
      isProcessing={reduxIsProcessing}
      onSendMessage={handleSendMessage}
      onOptionSelected={handleOptionSelected}
      onMagicGenerate={handleMagicGenerate}
      className={className}
      showMagicButton={true}
    />
  );
};

export default LLMAIAssistant;
