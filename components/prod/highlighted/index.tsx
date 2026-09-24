import { Fragment } from "react";
import type { ReactNode } from "react";

import { escapeRegex } from "@/components/prod/utils/escape-regex";

interface HighlightedProps {
  children: string;
  highlight: string;
}

const Highlighted = ({ children, highlight }: HighlightedProps) => {
  if (!highlight) {
    return <span className="text-left">{children}</span>;
  }

  const regex = new RegExp(escapeRegex(highlight.trim()), "gi");

  const matches = Array.from(children.matchAll(regex));

  if (!matches.length) {
    return <span className="text-left">{children}</span>;
  }

  const result: ReactNode[] = [];

  matches.forEach((match, index) => {
    const previousMatch = matches[matches.indexOf(match) - 1];
    const [highlighted] = match;

    result.push(
      <Fragment key={match.index}>
        {children.substring(
          previousMatch ? previousMatch.index + previousMatch[0].length : 0,
          match.index
        )}
        <span className="bg-yellow-200 font-medium" data-testid="highlighted">
          {highlighted}
        </span>
        {index === matches.length - 1
          ? children.substring(match.index + highlighted.length)
          : null}
      </Fragment>
    );
  });

  return <span className="text-left">{result}</span>;
};

export { Highlighted };
