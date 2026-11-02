"use client";

import { useEffect, useRef, useState } from "react";

import { Command } from "cmdk";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/components/prod/utils/cn";

import type { DealerLocation } from "./data";

/* Name and address wrap instead of truncating: locations in one dealer group
   share a name and differ only by address. */
const LocationText = ({ location }: { location: DealerLocation }) => (
  <span className="min-w-0 break-words">
    <span className="font-semibold">{location.name}</span>; {location.address}
  </span>
);

/* Every typed word must appear in the name or address. cmdk's default fuzzy
   score lets "pape" match "South Plains Implement". */
const matchKeywords = (_value: string, search: string, keywords?: string[]) => {
  const haystack = (keywords ?? []).join(" ").toLowerCase();
  return search
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word))
    ? 1
    : 0;
};

const DealerLocationPicker = ({
  locations,
  onChange,
  onSubmit,
  value,
}: {
  locations: DealerLocation[];
  onChange: (id: string) => void;
  onSubmit: () => void;
  value: string | null;
}) => {
  const [open, setOpen] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const selected = locations.find((location) => location.id === value);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div className="relative" ref={root}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex min-h-10 w-full items-start gap-2 rounded-md border border-gray-300 px-3 py-2 text-left text-base text-gray-900"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !open) {
            event.preventDefault();
            onSubmit();
          }
        }}
        type="button"
      >
        <span className="min-w-0 flex-1">
          {selected ? (
            <LocationText location={selected} />
          ) : (
            <span className="text-gray-500">Select a dealer location</span>
          )}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-1 size-4 shrink-0 text-gray-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <Command
          className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          filter={matchKeywords}
          label="Dealer location"
          loop
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
            }
          }}
        >
          <div className="flex items-center gap-2 border-b border-gray-200 px-3">
            <Search aria-hidden className="size-4 shrink-0 text-gray-500" />
            <Command.Input
              autoFocus
              className="h-10 w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-500"
              placeholder="Search name, street, city, state, or ZIP"
            />
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-1">
            <Command.Empty className="px-3 py-6 text-center text-sm text-gray-500">
              No dealer locations match.
            </Command.Empty>
            {locations.map((location) => (
              <Command.Item
                className="flex cursor-pointer items-start gap-2 rounded-md px-3 py-2 text-base text-gray-900 data-[selected=true]:bg-gray-100"
                key={location.id}
                keywords={[location.name, location.address]}
                onSelect={() => {
                  onChange(location.id);
                  setOpen(false);
                }}
                value={location.id}
              >
                <span className="min-w-0 flex-1">
                  <LocationText location={location} />
                </span>
                <Check
                  aria-hidden
                  className={cn(
                    "mt-1 size-4 shrink-0 text-gray-900",
                    location.id !== value && "invisible"
                  )}
                />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      )}
    </div>
  );
};

export { DealerLocationPicker };
