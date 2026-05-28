"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { v2ExpiredOffers } from "./mockData";

export default function V2ExpiredOffersTab() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              47 Expired Offers Requiring Action
            </div>
            <div className="text-xs text-gray-500">
              These offers are expired and cannot be set to active without
              operator action.
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-red-50">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-700">
                Offer
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-700">
                Offer ID
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-700">
                Merchant
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-700">
                Publisher
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-700">
                Expired
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {v2ExpiredOffers.map((offer) => (
              <tr
                key={offer.id}
                className="border-b border-red-100 hover:bg-red-50/30"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {offer.name}
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">
                    {offer.id}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {offer.merchantName}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                    {offer.publisher}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-medium text-red-600">
                  {offer.expiredDate}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Replace Offer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 pt-4 border-t border-red-100 text-sm text-gray-500">
          + 44 more expired offers &middot;{" "}
          <a
            href="/offers"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all in Offer Manager &rarr;
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
