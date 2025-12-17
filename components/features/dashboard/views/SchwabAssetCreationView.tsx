"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import {
  SparklesIcon,
  TicketIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function SchwabAssetCreationView() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    eventName: "Investor Workshop Series",
    eventDescription: "Q2 2025 Financial Planning",
    eventDate: "2025-05-15",
    eventTime: "10:00",
    location: "Schwab Financial Center",
    address: "101 Montgomery St, San Francisco, CA",
    capacity: "50",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreate = () => {
    setIsCreating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsCreating(false);
      setShowSuccess(true);
      // Navigate to client hub after 2 seconds
      setTimeout(() => {
        router.push("/demos/schwab-client-hub");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header - Consistent with dashboard */}
      <div className="flex-shrink-0 p-4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 border border-slate-200 shadow-sm">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-40">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="schwab-pattern"
                    x="0"
                    y="0"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="30" cy="30" r="1" fill="#CBD5E1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#schwab-pattern)" />
              </svg>
            </div>

            {/* Decorative accent shapes */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute left-0 bottom-0 w-48 h-48 bg-slate-100/50 rounded-full blur-3xl translate-y-24 -translate-x-24" />

            <div className="relative z-10 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  {/* Logo */}
                  <div className="flex-shrink-0 bg-white p-2 shadow-md border border-slate-200">
                    <Image
                      src="/logos/CharlesSchwab_Logo.svg"
                      alt="Charles Schwab"
                      width={48}
                      height={48}
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  {/* Vertical divider */}
                  <div className="h-12 w-px bg-slate-300" />

                  {/* Title section */}
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-[#009DDB]" />
                      Create Digital Pass
                    </h1>
                    <p className="text-sm text-gray-600 mt-0.5">
                      AI-powered event pass creation for your clients
                    </p>
                  </div>
                </div>

                {/* Back button */}
                <Link
                  href="/demos/schwab"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#009DDB] bg-white/80 hover:bg-white border border-slate-200 rounded-lg transition-all shadow-sm"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto px-3 sm:px-4 pb-3">
          {showSuccess ? (
            /* Success message */
            <Card className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <CheckCircleIcon className="h-16 w-16 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Digital Pass Created Successfully!
                </h2>
                <p className="text-gray-600 mb-4">
                  The pass has been created and is being sent to the client's
                  Hub...
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin h-4 w-4 border-2 border-[#009DDB] border-t-transparent rounded-full" />
                  <span>Redirecting to client view...</span>
                </div>
              </div>
            </Card>
          ) : (
            /* Two Panel Layout */
            <div className="flex gap-3 h-full">
              {/* Left Panel - Form */}
              <div className="w-2/3 h-full flex flex-col">
                <Card className="h-full flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <TicketIcon className="h-5 w-5 text-[#009DDB]" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Event Details
                      </h3>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4 max-w-2xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Name
                        </label>
                        <input
                          type="text"
                          value={formData.eventName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              eventName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009DDB]/20 focus:border-[#009DDB]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={formData.eventDescription}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              eventDescription: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009DDB]/20 focus:border-[#009DDB]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Date
                          </label>
                          <input
                            type="date"
                            value={formData.eventDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                eventDate: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009DDB]/20 focus:border-[#009DDB]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Time
                          </label>
                          <input
                            type="time"
                            value={formData.eventTime}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                eventTime: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009DDB]/20 focus:border-[#009DDB]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location Name
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009DDB]/20 focus:border-[#009DDB]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009DDB]/20 focus:border-[#009DDB]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Capacity
                        </label>
                        <input
                          type="number"
                          value={formData.capacity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              capacity: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009DDB]/20 focus:border-[#009DDB]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions - Fixed at bottom */}
                  <div className="px-4 py-3 border-t border-gray-200 flex gap-3 flex-shrink-0">
                    <Button
                      onClick={() => router.push("/demos/schwab")}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreate}
                      disabled={isCreating}
                      size="sm"
                      className="flex-1 bg-[#009DDB] hover:bg-[#0078A8] text-white"
                    >
                      {isCreating ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Creating with AI...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-4 w-4 mr-2" />
                          Create Digital Pass
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Right Panel - Preview */}
              <div className="w-1/3 h-full flex flex-col">
                <Card className="h-full flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                      <SparklesIcon className="h-5 w-5 text-[#009DDB]" />
                      <h3 className="text-base font-semibold text-gray-900">
                        AI Preview
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500">
                      Live preview of your digital pass
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-[#009DDB] to-[#0078A8] rounded-lg p-3 text-white shadow-md">
                        <div className="text-[10px] opacity-80 mb-1">
                          Event Pass
                        </div>
                        <h4 className="font-bold mb-1.5 text-sm">
                          {formData.eventName}
                        </h4>
                        <p className="text-xs opacity-90 mb-2">
                          {formData.eventDescription}
                        </p>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>
                              {new Date(formData.eventDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-3.5 w-3.5" />
                            <span>{formData.eventTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            <span>{formData.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="h-3.5 w-3.5" />
                            <span>{formData.capacity} attendees</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start gap-2 mb-2">
                          <SparklesIcon className="h-4 w-4 text-[#009DDB] mt-0.5 flex-shrink-0" />
                          <div className="text-xs font-medium text-gray-900">
                            AI will automatically:
                          </div>
                        </div>
                        <ul className="space-y-1 ml-6 text-xs text-gray-700">
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#009DDB] mt-0.5">•</span>
                            <span>Generate QR code for check-in</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#009DDB] mt-0.5">•</span>
                            <span>Format event details for mobile</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#009DDB] mt-0.5">•</span>
                            <span>Create branded design</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#009DDB] mt-0.5">•</span>
                            <span>Send to client's digital Hub</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
