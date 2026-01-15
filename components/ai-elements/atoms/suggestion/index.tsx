"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type SuggestionsProps = ComponentProps<typeof ScrollArea>;

export const Suggestions = ({
  children,
  className,
  ...props
}: SuggestionsProps) => (
  <ScrollArea className="w-full overflow-x-auto whitespace-nowrap" {...props}>
    <div className={cn("flex w-max flex-nowrap items-center gap-2", className)}>
      {children}
    </div>
    <ScrollBar className="hidden" orientation="horizontal" />
  </ScrollArea>
);

export interface SuggestionProps extends Omit<
  ComponentProps<typeof Button>,
  "href" | "onClick" | "onMouseEnter" | "onTouchStart" | "type"
> {
  onClick?: (suggestion: string) => void;
  suggestion: string;
}

export const Suggestion = ({
  children,
  className,
  onClick,
  size = "sm",
  suggestion,
  variant = "outline",
  ...props
}: SuggestionProps) => {
  const handleClick = () => {
    onClick?.(suggestion);
  };

  return (
    <Button
      className={cn("cursor-pointer rounded-full px-4", className)}
      onClick={handleClick}
      size={size}
      variant={variant}
      {...props}
    >
      {children ?? suggestion}
    </Button>
  );
};
