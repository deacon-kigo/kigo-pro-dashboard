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
            "Welcome! I can help you create product filters. Describe the filter you need, or click the magic button to auto-generate based on context. I'll guide you through the process.",
          responseOptions: [
            {
              text: "What criteria do I need?",
              value: "explain_criteria_types",
            },
            { text: "Show best practices", value: "best_practices" },
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

      dispatch(
        addMessage({
          type: "user",
          content: messageText,
        })
      );

      dispatch(setIsProcessing(true));

      // Simulate LLM interaction for now (would be handled by middleware in production)
      setTimeout(() => {
        const currentCriteriaTypes = currentCriteria.map((c) => c.type);
        const lowerMessage = messageText.toLowerCase();

        // --- Simulate Information Gathering ---
        // (This would be replaced by real NLU/context tracking)
        // For simulation, let's assume we *always* find some basic info
        // and potentially one missing required type to demonstrate the flow.
        const detectedData = {
          merchantKeyword: lowerMessage.includes("pizza hut")
            ? "pizza hut"
            : currentCriteria.find((c) => c.type === "MerchantKeyword")
                ?.value || null,
          offerCommodity: lowerMessage.includes("pizza")
            ? "pizza"
            : currentCriteria.find((c) => c.type === "OfferCommodity")?.value ||
              null,
          offerKeyword: lowerMessage.includes("deal")
            ? "deal"
            : currentCriteria.find((c) => c.type === "OfferKeyword")?.value ||
              null,
          // Assume MerchantName is missing for demo question
        };

        let allRequiredPresent = true;
        let firstMissingRequiredType: string | null = null;
        let detectedCriteriaForPayload: Partial<any>[] = [];
        const tempAllTypes = new Set(currentCriteriaTypes);

        // Build payload based on NEWLY detected info from this message
        if (
          lowerMessage.includes("pizza hut") &&
          !currentCriteriaTypes.includes("MerchantKeyword")
        ) {
          detectedCriteriaForPayload.push({
            type: "MerchantKeyword",
            value: "pizza hut",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          });
          tempAllTypes.add("MerchantKeyword");
        }
        if (
          lowerMessage.includes("pizza") &&
          !currentCriteriaTypes.includes("OfferCommodity")
        ) {
          detectedCriteriaForPayload.push({
            type: "OfferCommodity",
            value: "pizza",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          });
          tempAllTypes.add("OfferCommodity");
        }
        if (
          lowerMessage.includes("deal") &&
          !currentCriteriaTypes.includes("OfferKeyword")
        ) {
          detectedCriteriaForPayload.push({
            type: "OfferKeyword",
            value: "deal",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          });
          tempAllTypes.add("OfferKeyword");
        }
        // Add logic for MerchantName etc.

        // Check required fields based on current + newly detected
        for (const reqType of requiredCriteriaTypes) {
          if (!tempAllTypes.has(reqType)) {
            allRequiredPresent = false;
            firstMissingRequiredType = reqType;
            break;
          }
        }

        let aiResponseMessage: Omit<AIMessage, "id" | "timestamp">;

        if (!allRequiredPresent && firstMissingRequiredType) {
          // --- Scenario B: Ask for missing required field ---
          let baseText = "Okay, I understood some details. ";
          if (detectedCriteriaForPayload.length > 0) {
            baseText = `Okay, I see ${detectedCriteriaForPayload.map((c) => `'${c.value}' (${c.type})`).join(" and ")}. `;
          }
          let question = `To create the filter, I also need the ${firstMissingRequiredType.replace(/([A-Z])/g, " $1").toLowerCase()}. What should that be?`;
          // Add specific question phrasing if needed
          aiResponseMessage = { type: "ai", content: baseText + question };
          dispatch(addMessage(aiResponseMessage));
        } else {
          // --- Scenario C: All required present (or assumed) -> Propose Generation ---
          const finalCriteriaToAdd = [
            ...currentCriteria,
            // Ensure newly detected aren't duplicates (simple type check)
            ...detectedCriteriaForPayload.filter(
              (newItem) => !currentCriteriaTypes.includes(newItem.type!)
            ),
          ];
          const filterNameProposal = `${detectedData.merchantKeyword || detectedData.offerCommodity || "Generated"} Filter`;

          // Store the proposed payload
          const payloadToConfirm = {
            criteriaToAdd: finalCriteriaToAdd,
            filterName: filterNameProposal,
          };
          setProposedUpdatePayload(payloadToConfirm); // Store for confirmation click

          aiResponseMessage = {
            type: "ai",
            content: `Okay, I have enough information (Criteria: ${finalCriteriaToAdd.map((c) => c.type).join(", ")}). Shall I generate the filter with name "${filterNameProposal}" now?`,
            responseOptions: [
              { text: "Yes, generate filter", value: "confirm_generate" },
              { text: "No, wait", value: "cancel_generate" },
            ],
          };
          dispatch(addMessage(aiResponseMessage));
        }

        dispatch(setIsProcessing(false));
      }, 1200);
    },
    [dispatch, currentCriteria, requiredCriteriaTypes]
  );

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
      } else {
        // Pass through to parent component for non-special commands
        onOptionSelected(optionValue);
      }
    },
    [dispatch, proposedUpdatePayload, onOptionSelected]
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
