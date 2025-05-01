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
  requiredCriteriaTypes: string[];
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
  requiredCriteriaTypes,
}) => {
  const pathname = usePathname();

  // Determine mode
  const isProductFilterMode = pathname.includes("/product-filters");

  // Simple wrapper component that renders the appropriate assistant based on pathname
  return isProductFilterMode ? (
    <LLMAIAssistant
      onOptionSelected={onOptionSelected}
      className={className}
      title={title}
      description={description}
      requiredCriteriaTypes={requiredCriteriaTypes}
    />
  ) : (
    <DemoAIAssistant
      onOptionSelected={(optionId) => {
        onOptionSelected(optionId);
        if (onSend) onSend();
      }}
      className={className}
      title={title}
      description={description}
    />
  );
};

export default AIAssistantPanel;
