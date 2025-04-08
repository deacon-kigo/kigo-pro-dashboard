"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";
import { useDemoState, useDemoActions } from "@/lib/redux/hooks";
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  ShieldCheckIcon,
  HomeIcon,
  RocketLaunchIcon,
  TicketIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { VersionType } from "@/lib/redux/slices/demoSlice";
import AppLayout from "@/components/templates/AppLayout/AppLayout";

// Client emojis for visual representation
const clientEmojis: Record<string, string> = {
  "deacons-pizza": "🍕",
  cvs: "💊",
  generic: "🏢",
  "boutique-fitness": "💪",
  "tech-solutions": "💻",
};

// Define version info
const versionInfo: Record<VersionType, { name: string; description: string }> =
  {
    current: {
      name: "Current Release",
      description: "Features currently implemented in production",
    },
    upcoming: {
      name: "Next Release",
      description: "Features planned for the next release cycle",
    },
    future: {
      name: "Future Roadmap",
      description: "Features in the long-term development roadmap",
    },
    experimental: {
      name: "Experimental",
      description: "Experimental concepts and designs for feedback",
    },
  };

export default function RootPage() {
  // Replace the DemoContext usage with Redux hooks
  const { userProfile } = useDemoState();
  const { updateDemoState } = useDemoActions();
  const { role, clientId, clientName, version } = useAppSelector(
    (state) => state.demo
  );

  // Role selection handler
  const handleRoleChange = (newRole: string) => {
    updateDemoState({ role: newRole });
  };

  // Client selection handler
  const handleClientChange = (newClientId: string) => {
    updateDemoState({ clientId: newClientId });
  };

  // Version selection handler
  const handleVersionChange = (newVersion: VersionType) => {
    updateDemoState({ version: newVersion });
  };

  // Get main destination links based on role
  const getMainLinks = () => {
    switch (role) {
      case "merchant":
        return [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
          },
          {
            href: "/campaigns",
            label: "Campaigns",
            icon: <RocketLaunchIcon className="w-5 h-5" />,
          },
          {
            href: "/analytics",
            label: "Analytics",
            icon: <ChartBarIcon className="w-5 h-5" />,
          },
        ];
      case "support":
        return [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
          },
          {
            href: "/tickets",
            label: "Tickets",
            icon: <TicketIcon className="w-5 h-5" />,
          },
          {
            href: "/merchants",
            label: "Merchants",
            icon: <BuildingStorefrontIcon className="w-5 h-5" />,
          },
        ];
      case "admin":
        return [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
          },
          {
            href: "/merchants",
            label: "Merchants",
            icon: <UserGroupIcon className="w-5 h-5" />,
          },
          {
            href: "/analytics",
            label: "Analytics",
            icon: <ChartBarIcon className="w-5 h-5" />,
          },
        ];
      default:
        return [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
          },
        ];
    }
  };

  // Get special demo links based on role and client
  const getDemoLinks = () => {
    if (role === "merchant" && clientId === "deacons-pizza") {
      return [
        {
          href: "/demos/ai-campaign-creation",
          label: "AI Campaign Creator",
          icon: "🤖",
        },
      ];
    }

    if (role === "support" && clientId === "cvs") {
      return [
        {
          href: "/demos/cvs-token-management",
          label: "ExtraCare Token Management",
          icon: "🎟️",
        },
      ];
    }

    return [];
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
              Kigo PRO Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: User & Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                  <div className="h-24 w-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <span className="text-4xl">
                      {clientEmojis[clientId] || "🏢"}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {clientName || clientId}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Welcome,{" "}
                    {userProfile?.firstName || "User"}
                  </p>
                  <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {role === "merchant"
                      ? "Business Owner"
                      : role === "support"
                        ? "Support Agent"
                        : role === "admin"
                          ? "Administrator"
                          : "User"}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      Current Version
                    </div>
                    <div className="text-sm bg-gray-100 rounded-md p-2">
                      {versionInfo[version as VersionType]?.name ||
                        "Current Release"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      Mode
                    </div>
                    <div className="text-sm bg-gray-100 rounded-md p-2">
                      {version === "current"
                        ? "Production"
                        : version === "upcoming"
                          ? "Preview"
                          : version === "future"
                            ? "Prototype"
                            : "Experimental"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column: Navigation */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Navigate to
                </h2>

                <div className="space-y-3">
                  {getMainLinks().map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        {link.icon}
                      </div>
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}

                  {getDemoLinks().length > 0 && (
                    <>
                      <div className="border-t border-gray-200 my-4"></div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Special Demos
                      </h3>

                      {getDemoLinks().map((link, index) => (
                        <Link
                          key={index}
                          href={link.href}
                          className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xl">{link.icon}</span>
                          </div>
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Demo Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Demo Settings
                </h2>

                {/* Role Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    User Role
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRoleChange("merchant")}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                        role === "merchant"
                          ? "bg-emerald-100 text-emerald-800 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <BuildingStorefrontIcon className="w-5 h-5 mr-2" />
                      <span>Merchant</span>
                    </button>
                    <button
                      onClick={() => handleRoleChange("support")}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                        role === "support"
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <PhoneIcon className="w-5 h-5 mr-2" />
                      <span>Support</span>
                    </button>
                    <button
                      onClick={() => handleRoleChange("admin")}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                        role === "admin"
                          ? "bg-purple-100 text-purple-800 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ShieldCheckIcon className="w-5 h-5 mr-2" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>

                {/* Client Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Client
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(clientEmojis).map(([id, emoji]) => (
                      <button
                        key={id}
                        onClick={() => handleClientChange(id)}
                        className={`py-2 px-3 rounded-lg flex items-center justify-between ${
                          clientId === id
                            ? "bg-blue-100 text-blue-800 font-medium border border-blue-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <span className="truncate">
                          {id
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                        <span className="text-lg">{emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Version Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Version
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(versionInfo).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => handleVersionChange(key as VersionType)}
                        className={`w-full py-2 px-3 rounded-lg text-left ${
                          version === key
                            ? "bg-blue-100 text-blue-800 font-medium"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <div className="font-medium">{value.name}</div>
                        <div className="text-xs opacity-75">
                          {value.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
