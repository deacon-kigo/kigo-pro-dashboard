"use client";

import React from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { MemberWithPoints } from "./types";
import { formatDate } from "./utils";

interface MemberProfileProps {
  member: MemberWithPoints;
  onBack?: () => void;
}

/**
 * MemberProfile component - Displays member information and programs
 * @classification organism
 * @description Shows detailed member profile with contact info and active programs
 */
export default function MemberProfile({ member, onBack }: MemberProfileProps) {
  return (
    <Card>
      <div className="p-6">
        {/* Back Button */}
        {onBack && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </div>
        )}

        {/* Member Header */}
        <div className="flex items-start">
          <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">
              {member.firstName[0]}
              {member.lastName[0]}
            </span>
          </div>

          <div className="ml-6 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {member.fullName}
                </h2>
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      member.status === "active"
                        ? "bg-green-100 text-green-800"
                        : member.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {member.status.charAt(0).toUpperCase() +
                      member.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-blue-600"
                >
                  {member.email}
                </a>
              </div>

              {member.phoneNumber && (
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <a
                    href={`tel:${member.phoneNumber}`}
                    className="hover:text-blue-600"
                  >
                    {member.phoneNumber}
                  </a>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>Account ID: {member.accountId}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>Member Since: {formatDate(member.memberSince)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Active Programs
          </h3>
          <div className="space-y-3">
            {member.programs.map((program) => {
              const balance = member.pointsBalances.find(
                (b) => b.programId === program.id
              );

              return (
                <div
                  key={program.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {program.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {program.partnerName}
                      </p>
                    </div>
                    <div className="text-right">
                      {balance && (
                        <>
                          <div className="text-2xl font-bold text-blue-600">
                            {balance.currentPoints.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {balance.displayName}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            (${(balance.currentUsdCents / 100).toFixed(2)}{" "}
                            value)
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Quick Stats
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {member.totalPointsEarned.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">Total Earned</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {member.totalPointsRedeemed.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">Total Redeemed</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {member.totalAdjustments >= 0 ? "+" : ""}
                {member.totalAdjustments.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">Adjustments</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
