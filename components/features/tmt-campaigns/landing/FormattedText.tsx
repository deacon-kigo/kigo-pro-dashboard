"use client";

import React from "react";

interface FormattedTextProps {
  text: string;
  className?: string;
}

export default function FormattedText({
  text,
  className = "",
}: FormattedTextProps) {
  const parseText = (input: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = input;
    let key = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(
        /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/
      );

      let earliestMatch: {
        match: RegExpMatchArray;
        type: "bold" | "italic";
      } | null = null;

      if (boldMatch && boldMatch.index !== undefined) {
        earliestMatch = { match: boldMatch, type: "bold" };
      }
      if (italicMatch && italicMatch.index !== undefined) {
        if (!earliestMatch || italicMatch.index < earliestMatch.match.index!) {
          earliestMatch = { match: italicMatch, type: "italic" };
        }
      }

      if (earliestMatch) {
        const { match, type } = earliestMatch;
        const index = match.index!;
        if (index > 0) parts.push(remaining.slice(0, index));
        if (type === "bold") {
          parts.push(
            <strong key={key++} className="font-bold">
              {match[1]}
            </strong>
          );
        } else {
          parts.push(
            <em key={key++} className="italic">
              {match[1]}
            </em>
          );
        }
        remaining = remaining.slice(index + match[0].length);
      } else {
        parts.push(remaining);
        break;
      }
    }
    return parts;
  };

  const lines = text.split("\n");

  return (
    <span className={className}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {parseText(line)}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}
