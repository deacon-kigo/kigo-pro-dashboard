"use client";

import type { ComponentProps, ReactNode } from "react";
import { createContext, memo, use, useEffect, useState } from "react";

import { ChevronDownIcon, CpuChipIcon } from "@heroicons/react/24/outline";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Streamdown } from "streamdown";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { Shimmer } from "../shimmer";

interface ReasoningContextValue {
  duration: number | undefined;
  isOpen: boolean;
  isStreaming: boolean;
  setIsOpen: (open: boolean) => void;
}

const ReasoningContext = createContext<null | ReasoningContextValue>(null);

export const useReasoning = () => {
  const context = use(ReasoningContext);

  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }

  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  defaultOpen?: boolean;
  duration?: number;
  isStreaming?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export const Reasoning = memo(
  ({
    children,
    className,
    defaultOpen = true,
    duration: durationProp,
    isStreaming = false,
    // eslint-disable-next-line @typescript-eslint/unbound-method -- Props may include unbound methods, acceptable for React callbacks
    onOpenChange,
    open,
    ...props
  }: ReasoningProps) => {
    // @ts-expect-error - AI Elements library not compatible with exactOptionalPropertyTypes

    const [isOpen, setIsOpen] = useControllableState({
      defaultProp: defaultOpen,
      onChange: onOpenChange,
      prop: open,
    });

    const [duration, setDuration] = useControllableState({
      defaultProp: undefined,
      prop: durationProp,
    });

    const [hasAutoClosed, setHasAutoClosed] = useState(false);
    const [startTime, setStartTime] = useState<null | number>(null);

    // Track duration when streaming starts and ends
    useEffect(() => {
      if (isStreaming) {
        if (startTime === null) {
          // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- Intentional direct state update
          setStartTime(Date.now());
        }
      } else if (startTime !== null) {
        setDuration(Math.ceil((Date.now() - startTime) / MS_IN_S));
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- Intentional direct state update
        setStartTime(null);
      }
    }, [isStreaming, startTime, setDuration]);

    // Auto-open when streaming starts, auto-close when streaming ends (once only)
    useEffect(() => {
      if (defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
        // Add a small delay before closing to allow user to see the content
        const timer = setTimeout(() => {
          setIsOpen(false);
          setHasAutoClosed(true);
        }, AUTO_CLOSE_DELAY);

        return () => clearTimeout(timer);
      }
    }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosed]);

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen);
    };

    return (
      <ReasoningContext value={{ duration, isOpen, isStreaming, setIsOpen }}>
        <Collapsible
          className={cn("not-prose mb-4", className)}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </Collapsible>
      </ReasoningContext>
    );
  }
);

export type ReasoningTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
};

const defaultGetThinkingMessage = (isStreaming: boolean, duration?: number) => {
  if (isStreaming || duration === 0) {
    return <Shimmer duration={1}>Thinking...</Shimmer>;
  }
  if (duration === undefined) {
    return <p>Thought for a few seconds</p>;
  }

  return <p>Thought for {duration} seconds</p>;
};

export const ReasoningTrigger = memo(
  ({
    children,
    className,
    getThinkingMessage = defaultGetThinkingMessage,
    ...props
  }: ReasoningTriggerProps) => {
    const { duration, isOpen, isStreaming } = useReasoning();

    return (
      <CollapsibleTrigger
        className={cn(
          "text-muted-foreground hover:text-foreground flex w-full items-center gap-2 text-sm transition-colors",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <CpuChipIcon className="size-4" />
            {getThinkingMessage(isStreaming, duration)}
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform",
                isOpen ? "rotate-180" : "rotate-0"
              )}
            />
          </>
        )}
      </CollapsibleTrigger>
    );
  }
);

export type ReasoningContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  children: string;
};

export const ReasoningContent = memo(
  ({ children, className, ...props }: ReasoningContentProps) => (
    <CollapsibleContent
      className={cn(
        "mt-4 text-sm",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-muted-foreground data-[state=closed]:animate-out data-[state=open]:animate-in outline-none",
        className
      )}
      {...props}
    >
      <Streamdown {...props}>{children}</Streamdown>
    </CollapsibleContent>
  )
);

Reasoning.displayName = "Reasoning";
ReasoningTrigger.displayName = "ReasoningTrigger";
ReasoningContent.displayName = "ReasoningContent";
