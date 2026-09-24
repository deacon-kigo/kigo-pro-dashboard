"use client";

import { useState } from "react";

import { Bot, ChevronDown, User } from "lucide-react";

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

const EventRow = ({
  event,
  last,
  onToggle,
  open,
}: {
  event: ReviewEvent;
  last: boolean;
  onToggle: () => void;
  open: boolean;
}) => {
  const expandable = Boolean(event.detail);
  const body = (
    <>
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-base font-medium text-gray-900">
          {event.title}
        </span>
        {expandable && (
          <ChevronDown
            aria-hidden
            className={cn(
              "mt-1 size-3.5 shrink-0 text-gray-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        )}
      </span>
      <span className="mt-0.5 flex items-center justify-between gap-2 text-sm text-gray-500">
        <EventActor actor={event.actor} className="min-w-0" />
        <span className="shrink-0">
          <EventTime event={event} />
        </span>
      </span>
      {expandable && open && (
        <span className="mt-1.5 block text-sm text-gray-700">
          {event.detail}
        </span>
      )}
    </>
  );

  return (
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
      {expandable ? (
        <button
          aria-expanded={open}
          className="-mx-1.5 -my-1 min-w-0 flex-1 rounded-md px-1.5 py-1 text-left hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={onToggle}
          type="button"
        >
          {body}
        </button>
      ) : (
        <div className="min-w-0 flex-1">{body}</div>
      )}
    </li>
  );
};

const Timeline = ({ events }: { events: ReviewEvent[] }) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const days = byDay(events);
  return (
    <div className="flex flex-col gap-3">
      {days.map(({ date, items }) => (
        <section key={date}>
          <h3 className="text-sm text-gray-500">{date}</h3>
          <ol className="mt-1 flex flex-col">
            {items.map((event, index) => (
              <EventRow
                event={event}
                key={event.id}
                last={index === items.length - 1}
                onToggle={() =>
                  setOpen((state) => ({
                    ...state,
                    [event.id]: !state[event.id],
                  }))
                }
                open={Boolean(open[event.id])}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
};

export { EventActor, EventIcon, EventTime, Timeline };
