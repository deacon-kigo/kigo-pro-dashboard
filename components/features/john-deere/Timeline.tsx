import { Bot, User } from "lucide-react";

import { cn } from "@/components/prod/utils/cn";

import {
  EVENT_KIND,
  actorKind,
  type EventKind,
  type ReviewEvent,
} from "./data";
import { TONE } from "./tone";

const EventIcon = ({ kind }: { kind: EventKind }) => {
  const meta = EVENT_KIND[kind];
  const toned = meta.tone !== "neutral";
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border bg-white text-gray-500",
        toned && `${TONE[meta.tone].border} ${TONE[meta.tone].text}`
      )}
    >
      <Icon aria-hidden className="size-3" />
    </span>
  );
};

const ACTOR_ICON = { person: User, system: Bot } as const;

/* Who did it, as a labelled element rather than a string joined with dots. */
const EventActor = ({
  actor,
  className,
}: {
  actor: string;
  className?: string;
}) => {
  const Icon = ACTOR_ICON[actorKind(actor)];
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Icon aria-hidden className="size-3 shrink-0" />
      {actor}
    </span>
  );
};

const EventTime = ({ event }: { event: ReviewEvent }) => (
  <time dateTime={`${event.date} ${event.time}`}>{event.time}</time>
);

const byDay = (events: ReviewEvent[]) =>
  events.reduce<{ date: string; items: ReviewEvent[] }[]>((days, event) => {
    const last = days[days.length - 1];
    if (last?.date === event.date) last.items.push(event);
    else days.push({ date: event.date, items: [event] });
    return days;
  }, []);

const EventRow = ({ event, last }: { event: ReviewEvent; last: boolean }) => (
  <li className="relative flex gap-3 py-2">
    {!last && (
      <span
        aria-hidden
        className="absolute top-8 bottom-0 left-[9px] w-px bg-gray-200"
      />
    )}
    <span className="mt-0.5 flex shrink-0">
      <EventIcon kind={event.kind} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-base font-medium text-gray-900">{event.title}</p>
      <p className="mt-0.5 flex items-center justify-between gap-2 text-sm text-gray-500">
        <EventActor actor={event.actor} className="min-w-0" />
        <span className="shrink-0">
          <EventTime event={event} />
        </span>
      </p>
      {event.detail && (
        <p className="mt-1 text-sm text-gray-700">{event.detail}</p>
      )}
    </div>
  </li>
);

const Timeline = ({ events }: { events: ReviewEvent[] }) => (
  <div className="flex flex-col gap-3">
    {byDay(events).map(({ date, items }) => (
      <section key={date}>
        <h3 className="text-sm text-gray-500">{date}</h3>
        <ol className="mt-1 flex flex-col">
          {items.map((event, index) => (
            <EventRow
              event={event}
              key={event.id}
              last={index === items.length - 1}
            />
          ))}
        </ol>
      </section>
    ))}
  </div>
);

export { EventActor, EventIcon, EventTime, Timeline };
