"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { v2Duplicates } from "./mockData";

export default function V2DuplicatesTab() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
            <DocumentDuplicateIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              3 Duplicate Merchant Records Flagged
            </div>
            <div className="text-xs text-gray-500">
              Review and resolve these potential duplicates. Merging requires
              manual operator confirmation.
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {v2Duplicates.map((dup, idx) => (
            <div
              key={idx}
              className="border border-amber-200 rounded-lg p-4 bg-amber-50/50"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-semibold text-gray-900">
                  {dup.nameA} (potential duplicate)
                </span>
                <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-bold px-2 py-0.5">
                  {dup.matchPercent}% match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded-md p-3 border border-gray-200">
                  <div className="text-[11px] text-gray-500 mb-1">Record A</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {dup.nameA}
                  </div>
                  <div className="text-xs font-mono text-gray-500">
                    {dup.idA}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dup.offersA}
                  </div>
                </div>
                <div className="bg-white rounded-md p-3 border border-gray-200">
                  <div className="text-[11px] text-gray-500 mb-1">Record B</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {dup.nameB}
                  </div>
                  <div className="text-xs font-mono text-gray-500">
                    {dup.idB}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dup.offersB}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="text-xs h-7 bg-amber-700 hover:bg-amber-800"
                >
                  Merge Records
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Keep Separate
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Review Later
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
