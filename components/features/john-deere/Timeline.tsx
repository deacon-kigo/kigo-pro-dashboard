import { cn } from "@/components/prod/utils/cn";

import { EVENT_KIND, type ReviewEvent } from "./data";
import { TONE } from "./tone";

const Timeline = ({
  compact,
  events,
}: {
  compact?: boolean;
  events: ReviewEvent[];
}) => (
  <ol className="flex flex-col">
    {events.map((event, index) => {
      const kind = EVENT_KIND[event.kind];
      const toned = kind.tone !== "neutral";
      const Icon = kind.icon;
      return (
        <li className="relative flex gap-3 py-2.5" key={event.id}>
          {index < events.length - 1 && (
            <span
              aria-hidden
              className="absolute top-8 bottom-0 left-[9px] w-px bg-gray-200"
            />
          )}
          <span
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border bg-white text-gray-500",
              toned && `${TONE[kind.tone].border} ${TONE[kind.tone].text}`
            )}
          >
            <Icon aria-hidden className="size-3" />
          </span>
          <div className="min-w-0 flex-1">
            {compact ? (
              <>
                <p className="min-w-0 break-words text-base font-medium text-gray-900">
                  {event.title}
                </p>
                <p className="text-sm text-gray-500">
                  {event.actor} · {event.at}
                </p>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <span className="min-w-0 flex-1 text-base font-medium text-gray-900">
                    {event.title}
                  </span>
                  <span className="shrink-0 text-sm text-gray-500">
                    {event.at}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{event.actor}</p>
              </>
            )}
            {event.detail && (
              <p className="mt-0.5 text-sm text-gray-500">{event.detail}</p>
            )}
          </div>
        </li>
      );
    })}
  </ol>
);

export { Timeline };
