"use client";

import React, { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import {
  ChevronDownIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/atoms/Input";
import { getEligibleParts } from "./parts";

export default function EligiblePartsTable({
  campaignId,
}: {
  campaignId: string;
}) {
  const parts = getEligibleParts(campaignId);
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");

  const filtered = parts.filter((p) => {
    if (!query.trim()) return true;
    const hay =
      `${p.partNumber} ${p.size} ${p.product} ${p.description}`.toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  return (
    <div className="rounded-lg border border-border-light bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-5"
      >
        <div className="text-left">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-dark">
            Eligible parts
            <Badge variant="neutral" size="sm" className="gap-1">
              <LockClosedIcon className="h-3 w-3" />
              Set by John Deere
            </Badge>
          </h3>
          <p className="mt-0.5 text-xs text-text-muted">
            {parts.length} part{parts.length === 1 ? "" : "s"} qualify for this
            promotion
          </p>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 transition-transform ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-border-light p-4">
          <div className="relative mb-3">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search parts…"
              className="pl-9"
            />
          </div>
          <div className="overflow-x-auto rounded-md border border-border-light">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light bg-bg-light text-left text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-3 py-2 font-medium">Part Number</th>
                  <th className="px-3 py-2 font-medium">Size</th>
                  <th className="px-3 py-2 font-medium">Product</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-text-muted"
                    >
                      No parts match “{query}”.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.partNumber}
                      className="border-b border-border-light last:border-0"
                    >
                      <td className="px-3 py-2 font-medium text-text-dark">
                        {p.partNumber}
                      </td>
                      <td className="px-3 py-2 text-text-muted">{p.size}</td>
                      <td className="px-3 py-2 text-text-dark">{p.product}</td>
                      <td className="px-3 py-2 text-text-muted">
                        {p.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
