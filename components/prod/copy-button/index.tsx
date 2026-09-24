/*
 * Marked here rather than left to its callers: it holds state, so the
 * `@/components/table` barrel that re-exports it through `CopyCell` could not
 * otherwise be imported by a server component.
 */
"use client";

import type { ButtonProps } from "../button";

import type { ReactNode } from "react";
import { useState } from "react";

import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";

import { Button } from "../button";
import { Tooltip } from "../tooltip";

const DEFAULT_TOOLTIP_CONFIG = {
  copiedText: "Copied!",
  hoverText: "Copy",
};

interface CopyButtonProps {
  children?: ReactNode;
  color?: NonNullable<ButtonProps["color"]>;
  size?: NonNullable<ButtonProps["size"]>;
  textToCopy: string;
  tooltip?: {
    copiedText?: string;
    hoverText?: string;
  };
  variant?: NonNullable<ButtonProps["variant"]>;
}

const CopyButton = ({
  children,
  color = "secondary",
  size = "icon",
  textToCopy,
  tooltip = DEFAULT_TOOLTIP_CONFIG,
  variant = "ghost",
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseOver = () => {
    setIsOpen(true);
  };

  const handleMouseOut = () => {
    setIsOpen(false);
  };

  return (
    <Tooltip
      content={copied ? tooltip.copiedText : tooltip.hoverText}
      isOpen={isOpen || copied}
    >
      <Button
        aria-label={tooltip.hoverText}
        color={color}
        icon={
          copied ? (
            <CheckIcon className="text-success-foreground" />
          ) : (
            <ClipboardDocumentIcon />
          )
        }
        onClick={handleCopy}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        size={size}
        variant={variant}
        {...(children && { children })}
      />
    </Tooltip>
  );
};

export { CopyButton };
