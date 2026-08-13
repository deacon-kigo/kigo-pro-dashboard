"use client";

/**
 * @file Publisher Manager (DES-876) — publisher header
 * @description The publisher identity IS the page header: the aurora PageHeader
 * hosts the avatar (logo slot), the name + switcher dropdown and capability
 * tags (title slot), and the identifier + descriptor (actions slot). Persistent
 * across both work-surface tabs.
 */

import React from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import { PageHeader } from "@/components/molecules/PageHeader";
import { Badge } from "@/components/atoms/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OfferTypeManagePopover } from "./OfferTypeManagePopover";
import type { OfferType, Publisher } from "./types";

interface PublisherAvatarProps {
  publisher: Publisher;
  className?: string;
}

function PublisherAvatar({ publisher, className }: PublisherAvatarProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        publisher.avatarClassName,
        className
      )}
    >
      {publisher.initials}
    </span>
  );
}

interface PublisherHeaderProps {
  publishers: Publisher[];
  selected: Publisher;
  onSelect: (publisherId: string) => void;
  allOfferTypes: OfferType[];
  supportedIds: string[];
  onSupportedChange: (ids: string[]) => void;
}

export function PublisherHeader({
  publishers,
  selected,
  onSelect,
  allOfferTypes,
  supportedIds,
  onSupportedChange,
}: PublisherHeaderProps) {
  const title = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group flex items-center gap-2 rounded-md p-1 -m-1 text-left transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            aria-label="Switch publisher"
          >
            <span className="text-2xl font-bold text-gray-900">
              {selected.name}
            </span>
            <ChevronsUpDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel>Switch publisher</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {publishers.map((publisher) => {
            const isSelected = publisher.id === selected.id;
            return (
              <DropdownMenuItem
                key={publisher.id}
                onSelect={() => onSelect(publisher.id)}
                className="flex items-center gap-2.5 py-2"
              >
                <PublisherAvatar
                  publisher={publisher}
                  className="h-8 w-8 text-xs"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-gray-900">
                    {publisher.name}
                  </span>
                  <span className="truncate text-xs text-text-muted">
                    {publisher.id} · {publisher.descriptor}
                  </span>
                </span>
                {isSelected && (
                  <Check className="ml-auto h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-wrap gap-1.5">
        {selected.capabilities.map((capability) => (
          <Badge key={capability} variant="info" size="sm">
            {capability}
          </Badge>
        ))}
      </div>
    </div>
  );

  const actions = (
    <div className="flex items-center gap-3">
      <div className="text-left sm:text-right">
        <p className="text-sm font-semibold text-gray-900">{selected.id}</p>
        <p className="text-xs text-text-muted">{selected.descriptor}</p>
      </div>
      <OfferTypeManagePopover
        allOfferTypes={allOfferTypes}
        supportedIds={supportedIds}
        onSupportedChange={onSupportedChange}
      />
    </div>
  );

  return (
    <PageHeader
      variant="aurora"
      logo={
        <PublisherAvatar publisher={selected} className="h-12 w-12 text-lg" />
      }
      title={title}
      actions={actions}
    />
  );
}

export default PublisherHeader;
