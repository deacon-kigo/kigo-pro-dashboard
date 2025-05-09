"use client";

import * as React from "react";
import { useDemoState } from "@/lib/redux/hooks";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  AIMessage,
  addMessage,
  setIsProcessing,
  magicGenerate,
} from "@/lib/redux/slices/ai-assistantSlice";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PaperAirplaneIcon,
  LightBulbIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import DemoAIAssistant from "./DemoAIAssistant";
import LLMAIAssistant from "./LLMAIAssistant";

// Define types locally (Consider moving to a shared types file later)
interface FilterCriteria {
  id: string;
  type: string;
  value: string;
  rule: string;
  and_or: string;
  isRequired: boolean;
}

interface ResponseOption {
  text: string;
  value: string;
}

interface Attachment {
  type: "image" | "chart" | "file";
  url: string;
  title: string;
  description?: string;
}

interface AIAssistantPanelProps {
  onOptionSelected: (optionId: string) => void;
  onSend?: () => void;
  className?: string;
  title: string;
  description?: string;
  requiredCriteriaTypes?: string[];
  initialMessage?: string;
}

interface ChatMessageProps {
  key?: string;
  message: AIMessage;
  onOptionSelected: (optionId: string) => void;
  applyInstantFilter: () => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onOptionSelected,
  onSend = () => {},
  className = "",
  title,
  description,
  requiredCriteriaTypes = [],
  initialMessage,
}) => {
  const pathname = usePathname();

  // Determine mode
  const isProductFilterMode = pathname.includes("/product-filters");

  // Check if this is the ad campaign creation path
  const isAdCampaignPath = pathname.includes("/campaign-manager/ads-create");

  // Get initial message based on mode
  const getInitialMessage = () => {
    if (initialMessage) {
      return initialMessage;
    }

    if (isProductFilterMode) {
      return "Hi! I'm your AI filter assistant. I can help you create product filters by suggesting criteria based on what you're looking for. What kind of offers would you like to filter?";
    }

    if (isAdCampaignPath) {
      return "Hello! I'm your AI Campaign Assistant. I can help you optimize your campaign for better performance. What would you like help with today?";
    }

    return "Hello! I'm your AI assistant. How can I help you today?";
  };

  // Fix height and make sure the flex layout is properly set
  const combinedClassName = `flex flex-col w-full h-full ${className}`;

  // Simple wrapper component that renders the appropriate assistant based on pathname
  return isProductFilterMode ? (
    <LLMAIAssistant
      onOptionSelected={onOptionSelected}
      className={combinedClassName}
      title={title}
      description={description}
      initialMessage={getInitialMessage()}
      showMagicButton={true}
      magicButtonText="Generate Filter"
      contextId="productFilter"
    />
  ) : (
    <DemoAIAssistant
      onOptionSelected={(optionId) => {
        onOptionSelected(optionId);
        if (onSend) onSend();
      }}
      className={combinedClassName}
      title={title || "AI Campaign Assistant"}
      description={description || "I'll help you create an effective campaign"}
      initialMessage={getInitialMessage()}
    />
  );
};

export default AIAssistantPanel;
