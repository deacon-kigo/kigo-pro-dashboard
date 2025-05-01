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

// Helper function to create option IDs (copied from middleware)
const createOptionId = (prefix: string, data: any) => {
  if (typeof data === "string") {
    return `${prefix}:${data}`;
  }
  return `${prefix}:${JSON.stringify(data)}`;
};

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
}

export const LLMAIAssistant: React.FC<LLMAIAssistantProps> = ({
  onOptionSelected,
  className = "",
  title = "AI Assistant",
  description,
  requiredCriteriaTypes = [],
}) => {
  const dispatch = useDispatch();

  // Redux state
  const {
    messages: reduxMessages,
    isProcessing: reduxIsProcessing,
    currentCriteria,
  } = useSelector((state: RootState) => state.aiAssistant);

  const [proposedUpdatePayload, setProposedUpdatePayload] =
    React.useState<any>(null);

  // Add initial welcome message for product filter mode
  React.useEffect(() => {
    if (reduxMessages.length === 0) {
      dispatch(
        addMessage({
          type: "ai",
          content:
            "I'll help you create a product filter by asking specific questions. Let's build it step by step.",
          responseOptions: [
            {
              text: "Start building a filter",
              value: "start_filter_creation",
            },
            {
              text: "What criteria are required?",
              value: "explain_criteria_types",
            },
            {
              text: "Show best practices",
              value: "best_practices",
            },
            {
              text: "Use auto-generate instead",
              value: "magic_generate_intro",
            },
          ],
        })
      );
    }
  }, [dispatch, reduxMessages.length]);

  // Handle message sending through Redux
  const handleSendMessage = React.useCallback(
    (messageText: string) => {
      if (!messageText.trim()) return;

      // Clear proposed payload when user sends a new message
      setProposedUpdatePayload(null);

      // Add user message to the chat
      dispatch(
        addMessage({
          type: "user",
          content: messageText,
        })
      );

      // Set processing state while "thinking"
      dispatch(setIsProcessing(true));

      // Don't generate our own responses - instead, let the middleware handle it
      // This ensures all responses come from the structured flow defined in tools.ts

      // Pass the message to the middleware via Redux
      // The middleware will use our structured conversation guide
      dispatch(setIsProcessing(false));
    },
    [dispatch]
  );

  // Handle magic generate button click (instant filter)
  const handleMagicGenerate = React.useCallback(() => {
    console.log(
      "Magic Generate: Instantly creating and applying filter in LLM mode"
    );

    // Pre-defined filter to apply immediately with query name and expiry date
    const instantFilterPayload =
      'apply_updates:{"criteriaToAdd":[{"type":"MerchantKeyword","value":"restaurant","rule":"contains","and_or":"OR","isRequired":true},{"type":"MerchantName","value":"local eatery","rule":"contains","and_or":"OR","isRequired":true},{"type":"OfferCommodity","value":"dining","rule":"equals","and_or":"AND","isRequired":true},{"type":"OfferKeyword","value":"discount","rule":"contains","and_or":"OR","isRequired":true}],"filterName":"Restaurant Dining Filter","queryViewName":"RestaurantDiningView","expiryDate":"' +
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() +
      '"}';

    // Add user message
    dispatch(
      addMessage({
        type: "user",
        content: "Create an instant filter for restaurants please.",
      })
    );

    // Add AI response
    setTimeout(() => {
      dispatch(
        addMessage({
          type: "ai",
          content:
            "I've created a complete restaurant filter with all required criteria. The filter has been applied to your form!",
        })
      );

      // Apply the filter
      onOptionSelected(instantFilterPayload);
    }, 500);
  }, [dispatch, onOptionSelected]);

  // Option selected handler for LLM mode
  const handleOptionSelected = React.useCallback(
    (optionValue: string) => {
      console.log("Option selected in LLM mode:", optionValue);

      if (optionValue === "confirm_generate") {
        if (proposedUpdatePayload) {
          // Add confirmation message
          const aiConfirmMsg: Omit<AIMessage, "id" | "timestamp"> = {
            type: "ai",
            content: "Okay, applying the filter updates to the form!",
          };
          dispatch(addMessage(aiConfirmMsg));
          // Send the actual update command
          onOptionSelected(
            `apply_updates:${JSON.stringify(proposedUpdatePayload)}`
          );
          setProposedUpdatePayload(null); // Clear proposal
        } else {
          // Handle error: proposal was somehow lost
          const aiErrorMsg: Omit<AIMessage, "id" | "timestamp"> = {
            type: "ai",
            content:
              "Sorry, something went wrong. Could you try describing the filter again?",
            severity: "error",
          };
          dispatch(addMessage(aiErrorMsg));
        }
      } else if (optionValue === "cancel_generate") {
        const aiCancelMsg: Omit<AIMessage, "id" | "timestamp"> = {
          type: "ai",
          content:
            "Okay, I won't generate the filter yet. Let me know what you want to do next.",
        };
        dispatch(addMessage(aiCancelMsg));
        setProposedUpdatePayload(null); // Clear proposal
      } else if (optionValue === "trigger_magic_generate") {
        // Trigger the magic generation
        dispatch(
          addMessage({
            type: "user",
            content: "Please generate a filter for me automatically",
          })
        );

        // Call the magic generate function
        handleMagicGenerate();
      } else {
        // Pass through to parent component for non-special commands
        onOptionSelected(optionValue);
      }
    },
    [dispatch, proposedUpdatePayload, onOptionSelected, handleMagicGenerate]
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
