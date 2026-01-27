"use client";

import React, { useState, useRef, useEffect } from "react";
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
  UserIcon,
  PhotoIcon,
  ShareIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// Mock client data for demo
const MOCK_CLIENTS = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    tier: "Premier",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    tier: "Signature",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    tier: "Premier",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    tier: "Standard",
  },
  {
    id: "5",
    name: "Amanda Foster",
    email: "a.foster@email.com",
    tier: "Signature",
  },
  {
    id: "6",
    name: "Robert Williams",
    email: "r.williams@email.com",
    tier: "Premier",
  },
];

export default function SchwabAssetCreationView() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    eventName: "Investor Workshop Series",
    eventDescription: "Q2 2025 Financial Planning",
    eventDate: "2025-05-15",
    eventTime: "10:00",
    location: "Schwab Financial Center",
    address: "101 Montgomery St, San Francisco, CA",
    capacity: "50",
  });

  // Recipient state
  const [selectedRecipients, setSelectedRecipients] = useState<
    typeof MOCK_CLIENTS
  >([]);
  const [recipientSearchQuery, setRecipientSearchQuery] = useState("");
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);

  // Image upload state
  const [passImage, setPassImage] = useState<string | null>(null);
  const [passImageName, setPassImageName] = useState<string>("");

  // Sharing settings state
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [sharingType, setSharingType] = useState<"transfer" | "duplicate">(
    "transfer"
  );

  const filteredClients = MOCK_CLIENTS.filter(
    (client) =>
      !selectedRecipients.find((r) => r.id === client.id) &&
      (client.name.toLowerCase().includes(recipientSearchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(recipientSearchQuery.toLowerCase()))
  );

  const handleAddRecipient = (client: (typeof MOCK_CLIENTS)[0]) => {
    setSelectedRecipients([...selectedRecipients, client]);
    setRecipientSearchQuery("");
    setShowRecipientDropdown(false);
  };

  const handleRemoveRecipient = (clientId: string) => {
    setSelectedRecipients(selectedRecipients.filter((r) => r.id !== clientId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPassImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Close dropdown when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowRecipientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                <p className="text-gray-600 mb-2">
                  {selectedRecipients.length > 0
                    ? `Sending pass to ${selectedRecipients.length} recipient${selectedRecipients.length > 1 ? "s" : ""}:`
                    : "The pass has been created and is being sent to the client's Hub..."}
                </p>
                {selectedRecipients.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {selectedRecipients.map((r) => (
                      <span
                        key={r.id}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <div className="w-5 h-5 bg-[#009DDB] rounded-full flex items-center justify-center text-white text-xs">
                          {r.name.charAt(0)}
                        </div>
                        {r.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  {sharingEnabled
                    ? sharingType === "transfer"
                      ? "Pass is transferable (1-of-1)"
                      : "Pass can be shared as a copy"
                    : "Pass is non-transferable"}
                </div>
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
                <Card className="h-full flex flex-col overflow-hidden p-0">
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
                      {/* RECIPIENT SELECTION SECTION */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-3">
                          <UserIcon className="h-5 w-5 text-[#009DDB]" />
                          <label className="text-sm font-semibold text-gray-900">
                            Send To (Recipients)
                          </label>
                        </div>

                        {/* Selected Recipients */}
                        {selectedRecipients.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {selectedRecipients.map((recipient) => (
                              <div
                                key={recipient.id}
                                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-blue-200 text-sm"
                              >
                                <div className="w-6 h-6 bg-[#009DDB] rounded-full flex items-center justify-center text-white text-xs font-medium">
                                  {recipient.name.charAt(0)}
                                </div>
                                <span className="text-gray-800">
                                  {recipient.name}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {recipient.tier}
                                </span>
                                <button
                                  onClick={() =>
                                    handleRemoveRecipient(recipient.id)
                                  }
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Search/Add Recipients */}
                        <div className="relative" ref={dropdownRef}>
                          <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search clients by name or email..."
                              value={recipientSearchQuery}
                              onChange={(e) => {
                                setRecipientSearchQuery(e.target.value);
                                setShowRecipientDropdown(true);
                              }}
                              onFocus={() => setShowRecipientDropdown(true)}
                              className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#009DDB]/20 focus:border-[#009DDB] text-sm"
                            />
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>

                          {/* Dropdown */}
                          {showRecipientDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {filteredClients.length > 0 ? (
                                filteredClients.map((client) => (
                                  <button
                                    key={client.id}
                                    onClick={() => handleAddRecipient(client)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 text-left"
                                  >
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                                      {client.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">
                                        {client.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {client.email}
                                      </div>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                      {client.tier}
                                    </span>
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                  No clients found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Select one or more clients to receive this digital
                          pass
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-2" />

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

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-2" />

                      {/* IMAGE UPLOAD SECTION */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <PhotoIcon className="h-5 w-5 text-[#009DDB]" />
                          <label className="text-sm font-semibold text-gray-900">
                            Pass Image
                          </label>
                          <span className="text-xs text-gray-500">
                            (Optional)
                          </span>
                        </div>

                        {passImage ? (
                          <div className="relative">
                            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                              <Image
                                src={passImage}
                                alt="Pass preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-600 truncate max-w-[200px]">
                                {passImageName}
                              </span>
                              <button
                                onClick={() => {
                                  setPassImage(null);
                                  setPassImageName("");
                                }}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#009DDB] hover:bg-blue-50/50 transition-colors"
                          >
                            <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload an image for the pass
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG up to 5MB. Recommended: 800x400px
                            </p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          This image will appear on the digital pass in the
                          client's Hub
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-2" />

                      {/* SHARING SETTINGS SECTION */}
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                        <div className="flex items-center gap-2 mb-3">
                          <ShareIcon className="h-5 w-5 text-amber-600" />
                          <label className="text-sm font-semibold text-gray-900">
                            Sharing Settings
                          </label>
                        </div>

                        {/* Enable/Disable Sharing Toggle */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              Allow pass sharing
                            </p>
                            <p className="text-xs text-gray-600">
                              Recipients can share this pass with others
                            </p>
                          </div>
                          <button
                            onClick={() => setSharingEnabled(!sharingEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              sharingEnabled ? "bg-[#009DDB]" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                sharingEnabled
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Sharing Type Options (shown when sharing is enabled) */}
                        {sharingEnabled && (
                          <div className="space-y-3 pt-3 border-t border-amber-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              When shared, this pass will:
                            </p>

                            <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-[#009DDB] transition-colors">
                              <input
                                type="radio"
                                name="sharingType"
                                checked={sharingType === "transfer"}
                                onChange={() => setSharingType("transfer")}
                                className="mt-0.5 h-4 w-4 text-[#009DDB] focus:ring-[#009DDB]"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Transfer ownership (1-of-1)
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  Pass transfers completely to new recipient.
                                  Original holder loses access.
                                </p>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-[#009DDB] transition-colors">
                              <input
                                type="radio"
                                name="sharingType"
                                checked={sharingType === "duplicate"}
                                onChange={() => setSharingType("duplicate")}
                                className="mt-0.5 h-4 w-4 text-[#009DDB] focus:ring-[#009DDB]"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Share a copy
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  Creates a duplicate pass. Both original and
                                  new recipient have valid passes.
                                </p>
                              </div>
                            </label>

                            <div className="bg-amber-100 rounded-lg p-3 mt-2">
                              <p className="text-xs text-amber-800">
                                <span className="font-semibold">Note:</span>{" "}
                                {sharingType === "transfer"
                                  ? "With 1-of-1 transfer, only one person can hold the pass at a time. Use for exclusive access events."
                                  : "With copy sharing, capacity limits still apply. The system tracks all issued passes."}
                              </p>
                            </div>
                          </div>
                        )}

                        {!sharingEnabled && (
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-xs text-gray-600">
                              <span className="font-semibold">
                                Sharing disabled:
                              </span>{" "}
                              Only the selected recipients above will have
                              access to this pass. They cannot forward or share
                              it with others.
                            </p>
                          </div>
                        )}
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
                <Card className="h-full flex flex-col overflow-hidden p-0">
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
                      {/* Recipients Preview */}
                      {selectedRecipients.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <UserIcon className="h-4 w-4 text-[#009DDB]" />
                            <span className="text-xs font-medium text-gray-900">
                              Sending to {selectedRecipients.length} recipient
                              {selectedRecipients.length > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedRecipients.slice(0, 3).map((r) => (
                              <span
                                key={r.id}
                                className="text-xs bg-white px-2 py-0.5 rounded-full border border-blue-200 text-gray-700"
                              >
                                {r.name.split(" ")[0]}
                              </span>
                            ))}
                            {selectedRecipients.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{selectedRecipients.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Pass Preview Card */}
                      <div className="bg-gradient-to-br from-[#009DDB] to-[#0078A8] rounded-lg overflow-hidden text-white shadow-md">
                        {/* Pass Image */}
                        {passImage && (
                          <div className="relative h-24 w-full">
                            <Image
                              src={passImage}
                              alt="Pass image"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#009DDB]/80 to-transparent" />
                          </div>
                        )}
                        <div className="p-3">
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
                                {new Date(
                                  formData.eventDate
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
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

                          {/* Sharing Badge */}
                          <div className="mt-3 pt-2 border-t border-white/20">
                            <div className="flex items-center gap-2">
                              <ShareIcon className="h-3.5 w-3.5" />
                              <span className="text-xs">
                                {sharingEnabled
                                  ? sharingType === "transfer"
                                    ? "Transferable (1-of-1)"
                                    : "Shareable (Copy)"
                                  : "Non-transferable"}
                              </span>
                            </div>
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
                            <span>
                              Create branded design
                              {passImage ? " with your image" : ""}
                            </span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#009DDB] mt-0.5">•</span>
                            <span>
                              Send to{" "}
                              {selectedRecipients.length > 0
                                ? `${selectedRecipients.length} client${selectedRecipients.length > 1 ? "s'" : "'s"}`
                                : "client's"}{" "}
                              digital Hub
                            </span>
                          </li>
                          {sharingEnabled && (
                            <li className="flex items-start gap-1.5">
                              <span className="text-[#009DDB] mt-0.5">•</span>
                              <span>
                                Enable{" "}
                                {sharingType === "transfer"
                                  ? "1-of-1 transfer"
                                  : "copy sharing"}{" "}
                                capability
                              </span>
                            </li>
                          )}
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
