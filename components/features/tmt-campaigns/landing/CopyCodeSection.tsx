"use client";

import { useState } from "react";

interface CopyCodeSectionProps {
  code: string;
  copyButtonColor: string;
  borderRadius: number;
  button?: {
    enabled: boolean;
    text: string;
    url: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
  };
}

export default function CopyCodeSection({
  code,
  copyButtonColor,
  borderRadius,
  button,
}: CopyCodeSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-6">
      <div
        className="w-full flex items-stretch border-2 overflow-hidden"
        style={{
          borderColor: copyButtonColor,
          borderRadius: `${borderRadius ?? 9999}px`,
        }}
      >
        <div className="flex-1 px-4 py-3 text-sm font-bold text-center text-gray-800 bg-white flex items-center justify-center">
          {code}
        </div>
        <button
          onClick={handleCopy}
          className="px-5 py-3 text-xs font-bold text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: copyButtonColor }}
        >
          {copied ? "COPIED!" : "COPY"}
        </button>
      </div>
      {button?.enabled && (
        <a
          href={button.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 px-8 py-2 text-sm font-medium text-center transition-opacity hover:opacity-80 inline-block"
          style={{
            backgroundColor: button.backgroundColor,
            color: button.textColor,
            borderRadius: `${button.borderRadius}px`,
          }}
        >
          {button.text}
        </a>
      )}
    </div>
  );
}
