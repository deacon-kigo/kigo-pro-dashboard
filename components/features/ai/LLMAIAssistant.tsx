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
  initialMessage?: string;
  showMagicButton?: boolean;
  magicButtonText?: string;
  magicButtonHandler?: () => void;
  contextId?: string;
}

export const LLMAIAssistant: React.FC<LLMAIAssistantProps> = ({
  onOptionSelected,
  className = "",
  title = "AI Assistant",
  description,
  initialMessage = "How can I help you today?",
  showMagicButton = true,
  magicButtonText = "Generate Automatically",
  magicButtonHandler,
  contextId,
}) => {
  const dispatch = useDispatch();

  // Redux state
  const { messages: reduxMessages, isProcessing: reduxIsProcessing } =
    useSelector((state: RootState) => state.aiAssistant);

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
    // Use custom handler if provided, otherwise use default
    if (magicButtonHandler) {
      magicButtonHandler();
      return;
    }

    // Default magic generate behavior
    dispatch(
      addMessage({
        type: "user",
        content: "Please generate automatically",
      })
    );

    // Let the middleware handle the rest
    dispatch(magicGenerate());
  }, [dispatch, magicButtonHandler]);

  // Option selected handler
  const handleOptionSelected = React.useCallback(
    (optionValue: string) => {
      console.log(
        `Option selected: ${optionValue} [Context: ${contextId || "default"}]`
      );

      // Check for special option values related to generation
      if (
        optionValue === "magic_generate" ||
        optionValue === "generate_automatic"
      ) {
        handleMagicGenerate();
        return;
      }

      // Extract option text from the value if it's in format "text:value"
      let optionText = optionValue;
      // Try to find the matching option text in the latest AI message
      const latestAiMessage = [...reduxMessages]
        .reverse()
        .find((msg) => msg.type === "ai" && msg.responseOptions?.length);
      if (latestAiMessage && latestAiMessage.responseOptions) {
        const matchedOption = latestAiMessage.responseOptions.find(
          (opt) => opt.value === optionValue
        );
        if (matchedOption) {
          optionText = matchedOption.text;
        }
      }

      // Add user message with the option text
      dispatch(
        addMessage({
          type: "user",
          content: optionText,
        })
      );

      // Set processing state
      dispatch(setIsProcessing(true));

      // Pass through to parent component
      onOptionSelected(optionValue);
    },
    [onOptionSelected, handleMagicGenerate, contextId, dispatch, reduxMessages]
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
      showMagicButton={showMagicButton}
      magicButtonText={magicButtonText}
    />
  );
};

export default LLMAIAssistant;
