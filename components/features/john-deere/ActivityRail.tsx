"use client";

import { History, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/prod/button";
import { Card } from "@/components/prod/card";
import { Tooltip } from "@/components/prod/tooltip";

import { Section } from "./Section";
import { EventActor, EventIcon, EventTime, Timeline } from "./Timeline";
import { type ReviewEvent } from "./data";

interface ActivityRailProps {
  events: ReviewEvent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActivityRail = ({ events, onOpenChange, open }: ActivityRailProps) => {
  if (open) {
    return (
      <Card
        className="flex flex-col overflow-hidden xl:h-[calc(100vh-21rem)] xl:min-h-[440px] xl:sticky xl:top-[var(--sticky-top)] transition-[top] duration-200"
        roundness="lg"
      >
        <Section
          className="flex min-h-0 flex-1 flex-col"
          action={
            <Button
              aria-expanded
              aria-label="Collapse activity"
              color="secondary"
              onClick={() => onOpenChange(false)}
              size="icon"
              variant="ghost"
            >
              <PanelLeftClose />
            </Button>
          }
          count={String(events.length)}
          icon={History}
          title="Activity"
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Timeline events={events} />
          </div>
        </Section>
      </Card>
    );
  }

  return (
    <Card
      className="flex overflow-hidden py-2 max-xl:items-center max-xl:gap-2 px-2 xl:w-14 xl:flex-col xl:h-[calc(100vh-21rem)] xl:min-h-[440px] xl:sticky xl:top-[var(--sticky-top)] transition-[top] duration-200"
      roundness="lg"
    >
      <div className="flex items-center justify-center xl:h-11">
        <Tooltip content="Show activity" side="right">
          <Button
            aria-expanded={false}
            aria-label="Show activity"
            color="secondary"
            onClick={() => onOpenChange(true)}
            size="icon"
            variant="ghost"
          >
            <PanelLeftOpen />
          </Button>
        </Tooltip>
      </div>

      <div aria-hidden className="h-6 border-l border-gray-100 xl:hidden" />
      <div
        aria-hidden
        className="mx-3 my-2 border-t border-gray-100 max-xl:hidden"
      />

      <ol className="flex max-xl:items-center max-xl:gap-1 xl:flex-col">
        {events.map((event, index) => (
          <li className="relative flex justify-center py-2" key={event.id}>
            {index < events.length - 1 && (
              <span
                aria-hidden
                className="absolute top-7 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gray-200 max-xl:hidden"
              />
            )}
            <Tooltip
              align="start"
              content={
                <>
                  <p className="font-medium">{event.title}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-gray-400">
                    <EventActor actor={event.actor} />
                    <span>
                      {event.date} at <EventTime event={event} />
                    </span>
                  </p>
                  {event.detail && <p className="mt-1">{event.detail}</p>}
                </>
              }
              side="right"
            >
              <button
                aria-label={event.title}
                className="flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                type="button"
              >
                <EventIcon kind={event.kind} />
              </button>
            </Tooltip>
          </li>
        ))}
      </ol>
    </Card>
  );
};

export { ActivityRail };
