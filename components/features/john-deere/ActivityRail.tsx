"use client";

import { History, PanelLeftClose } from "lucide-react";

import { Button } from "@/components/prod/button";
import { Card } from "@/components/prod/card";
import { Tooltip } from "@/components/prod/tooltip";

import { Section } from "./Section";
import { EventIcon, Timeline } from "./Timeline";
import { type ReviewEvent } from "./data";

interface ActivityRailProps {
  events: ReviewEvent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActivityRail = ({ events, onOpenChange, open }: ActivityRailProps) => {
  if (open) {
    return (
      <Card className="self-start xl:sticky xl:top-[88px]" roundness="lg">
        <Section
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
          <Timeline compact events={events} />
        </Section>
      </Card>
    );
  }

  return (
    <Card
      className="w-14 self-start py-2 xl:sticky xl:top-[88px]"
      roundness="lg"
    >
      <div className="flex justify-center">
        <Tooltip content="Show activity" side="right">
          <Button
            aria-expanded={false}
            aria-label="Show activity"
            color="secondary"
            onClick={() => onOpenChange(true)}
            size="icon"
            variant="ghost"
          >
            <History />
          </Button>
        </Tooltip>
      </div>

      <div aria-hidden className="mx-3 my-2 border-t border-gray-100" />

      <ol className="flex flex-col">
        {events.map((event, index) => (
          <li className="relative flex justify-center py-2" key={event.id}>
            {index < events.length - 1 && (
              <span
                aria-hidden
                className="absolute top-7 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gray-200"
              />
            )}
            <Tooltip
              align="start"
              content={
                <>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-gray-400">
                    {event.actor} · {event.at}
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
