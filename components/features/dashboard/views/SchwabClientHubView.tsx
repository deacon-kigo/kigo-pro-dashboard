"use client";

import React from "react";
import Image from "next/image";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import {
  TicketIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  QrCodeIcon,
  ChevronRightIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

// Mobile device mockup wrapper
const MobileFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-8">
    <div className="relative">
      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-black rounded-[3rem] p-3 shadow-2xl">
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
      </div>

      {/* Annotation */}
      <div className="absolute -right-64 top-1/2 -translate-y-1/2 w-56">
        <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            Client View
          </div>
          <div className="text-xs text-gray-600">
            This is what a Schwab client sees in their mobile app Hub when they
            receive a digital pass from the Events team.
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function SchwabClientHubView() {
  return (
    <MobileFrame>
      {/* Status bar */}
      <div className="bg-[#009DDB] px-4 py-3 flex items-center justify-between text-white text-xs">
        <span className="font-medium">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-2 bg-white rounded-sm" />
            <div className="w-1 h-3 bg-white rounded-sm" />
            <div className="w-1 h-4 bg-white rounded-sm" />
            <div className="w-1 h-4 bg-white rounded-sm" />
          </div>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <div className="w-6 h-3 border border-white rounded-sm relative">
            <div className="absolute inset-0.5 bg-white rounded-sm w-3/4" />
          </div>
        </div>
      </div>

      {/* App header */}
      <div className="bg-[#009DDB] px-4 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/CharlesSchwab_Logo.svg"
            alt="Schwab"
            width={32}
            height={32}
            className="bg-white rounded p-0.5"
          />
          <div>
            <div className="text-sm font-semibold">My Hub</div>
            <div className="text-xs text-white/80">Digital Wallet</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BellIcon className="h-5 w-5" />
          <UserCircleIcon className="h-6 w-6" />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {/* New item notification */}
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <CheckCircleIcon className="h-5 w-5 text-blue-600" />
            <span className="font-medium">New pass added to your wallet</span>
          </div>
        </div>

        {/* Section header */}
        <div className="px-4 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Event Passes
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Your upcoming Schwab events
          </p>
        </div>

        {/* Digital pass card */}
        <div className="px-4 pb-4">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
            {/* Pass header with gradient */}
            <div className="bg-gradient-to-br from-[#009DDB] to-[#0078A8] p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <TicketIcon className="h-5 w-5 text-[#009DDB]" />
                    </div>
                    <div>
                      <div className="text-xs text-white/80">Event Pass</div>
                      <div className="text-[10px] text-white/60">
                        Complimentary
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium backdrop-blur-sm">
                    Active
                  </div>
                </div>

                <h3 className="text-base font-bold mb-1">
                  Investor Workshop Series
                </h3>
                <p className="text-xs text-white/90">
                  Q2 2025 Financial Planning
                </p>
              </div>
            </div>

            {/* Pass details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">May 15, 2025</div>
                  <div className="text-gray-600">Thursday</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">
                    10:00 AM - 12:00 PM
                  </div>
                  <div className="text-gray-600">Pacific Time</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">
                    Schwab Financial Center
                  </div>
                  <div className="text-gray-600">
                    101 Montgomery St, San Francisco
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-3" />

              {/* QR Code section */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Show this pass at check-in
                </div>
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                  <QrCodeIcon className="h-10 w-10 text-gray-400" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 space-y-2">
                <Button
                  className="w-full bg-[#009DDB] hover:bg-[#0078A8] text-white text-sm"
                  size="sm"
                >
                  Add to Calendar
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 text-sm"
                  size="sm"
                >
                  View Event Details
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="px-4 pb-6">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-900">
                <span className="font-medium">Pass activated.</span> You're all
                set for the event. We'll send you a reminder 24 hours before.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around">
        <div className="flex flex-col items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-[#009DDB] flex items-center justify-center">
            <TicketIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-[10px] font-medium text-[#009DDB]">Hub</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-6 h-6 text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <span className="text-[10px] text-gray-500">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-6 h-6 text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="text-[10px] text-gray-500">Account</span>
        </div>
      </div>
    </MobileFrame>
  );
}
