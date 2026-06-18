import React, { Fragment, type ReactNode } from "react";

interface HighlightedProps {
  children: string;
  highlight: string;
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Wraps every case-insensitive match of `highlight` in a yellow swatch.
// Ported from kigo-admin-tools `src/components/highlighted/`.
export function Highlighted({
  children = "",
  highlight = "",
}: HighlightedProps) {
  if (!highlight) {
    return <span className="text-left">{children}</span>;
  }

  const regex = new RegExp(escapeRegex(highlight.trim()), "gi");
  const matches = Array.from(children.matchAll(regex));
  if (matches.length === 0) {
    return <span className="text-left">{children}</span>;
  }

  const result: ReactNode[] = [];
  matches.forEach((match, index) => {
    const previous = matches[index - 1];
    const [matched] = match;
    const start = previous ? previous.index + previous[0].length : 0;
    result.push(
      <Fragment key={match.index}>
        {children.substring(start, match.index)}
        <span className="bg-yellow-200 font-medium">{matched}</span>
        {index === matches.length - 1
          ? children.substring(match.index + matched.length)
          : null}
      </Fragment>
    );
  });

  return <span className="text-left">{result}</span>;
}
