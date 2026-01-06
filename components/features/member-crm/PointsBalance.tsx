"use client";

import React from "react";
import { PlusIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { PointsBalance as PointsBalanceType } from "./types";
import { formatPoints, formatUsdCents } from "./utils";

interface PointsBalanceProps {
  balance: PointsBalanceType;
  onAdjust: () => void;
}

/**
 * PointsBalance component - Displays current points balance with adjustment action
 * @classification organism
 * @description Shows member's current points balance and conversion info
 */
export default function PointsBalance({
  balance,
  onAdjust,
}: PointsBalanceProps) {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Points Balance
          </h3>
          <Button variant="primary" size="sm" onClick={onAdjust}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Adjust Points
          </Button>
        </div>

        {/* Main Balance Display */}
        <div className="text-center py-6 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg mb-6">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {formatPoints(balance.currentPoints)}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            {balance.displayNamePrefix} {balance.displayName}
          </div>
          <div className="text-xs text-gray-500">
            ({formatUsdCents(balance.currentUsdCents)} value)
          </div>
        </div>

        {/* Conversion Info */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>Conversion Rate:</span>
            </div>
            <span className="font-medium text-gray-900">
              {balance.conversionRate} points = $1.00
            </span>
          </div>
        </div>

        {/* Program Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">
            <strong>Program:</strong> {balance.programName}
          </div>
        </div>
      </div>
    </Card>
  );
}
