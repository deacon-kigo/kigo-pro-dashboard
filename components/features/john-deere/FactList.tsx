import { cn } from "@/components/prod/utils/cn";

import { type Fact } from "./data";
import { TONE } from "./tone";

const FactList = ({ facts }: { facts: Fact[] }) => (
  <dl className="divide-y divide-gray-100">
    {facts.map((fact) => (
      <div
        className="grid grid-cols-[9rem_minmax(0,1fr)] gap-4 py-2"
        key={fact.label}
      >
        <dt className="self-start pt-1 text-sm text-gray-500">{fact.label}</dt>
        <dd
          className={cn(
            "min-w-0 text-base font-medium break-words whitespace-pre-line text-gray-900",
            fact.mono && "font-mono",
            fact.tone && TONE[fact.tone].text
          )}
        >
          {fact.value || "—"}
        </dd>
      </div>
    ))}
  </dl>
);

export { FactList };
