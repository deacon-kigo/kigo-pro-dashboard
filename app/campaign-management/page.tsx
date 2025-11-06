"use client";

import React from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/atoms/Button";
import {
  RectangleGroupIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

/**
 * Campaign Management - Main Page
 *
 * This is a placeholder page for the Campaign Management feature.
 * The complete design and implementation guide is available in the documentation.
 *
 * Documentation:
 * - BRD: /documentation/brd/campaign-management.md
 * - Design Spec: /documentation/features/campaign-management-design.md
 * - Implementation Summary: /documentation/features/campaign-management-implementation-summary.md
 * - Quick Start: /documentation/features/campaign-management-quick-start.md
 *
 * Foundation Code (Ready):
 * - Types: /types/campaign-management.ts
 * - Redux Slice: /lib/redux/slices/campaignManagementSlice.ts
 * - API Service: /lib/services/campaignManagementService.ts
 */

export default function CampaignManagementPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Campaign Management", href: "/campaign-management" },
      ]}
    >
      <div className="container mx-auto py-8 px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <RectangleGroupIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Campaign Management</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Self-service campaign creation and management for internal teams
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">
              🎉 Design Complete - Ready for Implementation
            </CardTitle>
            <CardDescription className="text-blue-700">
              All foundation code, types, and documentation are ready. Follow
              the implementation checklist to build the feature.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border border-blue-200">
                <div className="font-semibold text-blue-900">Foundation ✅</div>
                <div className="text-gray-600 text-xs mt-1">
                  Types, Redux, API Service
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <div className="font-semibold text-blue-900">
                  Documentation ✅
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  BRD, Design Spec, Quick Start
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <div className="font-semibold text-orange-600">
                  Components 🚧
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  Ready to build (see checklist)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What It Does</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Create and manage campaigns without Postman</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>3-step wizard for campaign creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Filter by partner, program, and status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Real-time validation and error prevention</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Dashboard with stats and quick actions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-semibold">
                    {"<5 min"}
                  </span>
                  <span>Campaign setup time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-semibold">{"<5%"}</span>
                  <span>Error rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-semibold">100%</span>
                  <span>UI adoption (vs Postman)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-semibold">90%</span>
                  <span>User satisfaction target</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Links */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5" />
              Documentation
            </CardTitle>
            <CardDescription>
              Complete design documentation and implementation guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/documentation/brd/campaign-management.md"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                  📋 Business Requirements (BRD)
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Business context, goals, and success metrics
                </div>
              </Link>

              <Link
                href="/documentation/features/campaign-management-design.md"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                  🎨 Design Specification
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Detailed UI/UX specs, wireframes, and component designs
                </div>
              </Link>

              <Link
                href="/documentation/features/campaign-management-implementation-summary.md"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                  📦 Implementation Summary
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Complete guide with architecture, data flow, and checklist
                </div>
              </Link>

              <Link
                href="/documentation/features/campaign-management-quick-start.md"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                  🚀 Quick Start Guide
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  TL;DR for developers with code examples
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Foundation Code */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CodeBracketIcon className="w-5 h-5" />
              Foundation Code (Ready ✅)
            </CardTitle>
            <CardDescription>
              All foundation code is complete and ready to use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded border">
                <div className="font-mono text-sm text-gray-800 font-semibold">
                  /types/campaign-management.ts
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  500+ lines of TypeScript types, interfaces, and type guards
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded border">
                <div className="font-mono text-sm text-gray-800 font-semibold">
                  /lib/redux/slices/campaignManagementSlice.ts
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  420+ lines of Redux state management with 30+ actions
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded border">
                <div className="font-mono text-sm text-gray-800 font-semibold">
                  /lib/services/campaignManagementService.ts
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  460+ lines of API service layer with 10 methods
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <div className="text-sm font-semibold text-blue-900 mb-1">
                Next Step: Add Redux Reducer
              </div>
              <div className="text-xs text-blue-700 font-mono">
                Import campaignManagementReducer in lib/redux/store.ts
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BeakerIcon className="w-5 h-5" />
              Implementation Checklist
            </CardTitle>
            <CardDescription>
              Follow this checklist to build the feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-green-600 mb-2">
                  ✅ Phase 1: Foundation (COMPLETE)
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  Types, Redux slice, API service, and documentation are ready
                </div>
              </div>

              <div>
                <div className="font-semibold text-orange-600 mb-2">
                  🚧 Phase 2: Core Components (NEXT)
                </div>
                <ul className="text-sm text-gray-600 ml-6 space-y-1">
                  <li>• CampaignStatusBadge</li>
                  <li>• CampaignCard</li>
                  <li>• CampaignFilters</li>
                  <li>• CampaignStats</li>
                  <li>• ConfirmActionDialog</li>
                </ul>
              </div>

              <div>
                <div className="font-semibold text-gray-600 mb-2">
                  ⏳ Phase 3: List Page
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  Campaign list with filters, search, and pagination
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-600 mb-2">
                  ⏳ Phase 4: Creation Wizard
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  3-step wizard with validation and submission
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-600 mb-2">
                  ⏳ Phase 5: Details/Edit
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  View and edit campaign details
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-600 mb-2">
                  ⏳ Phase 6: Polish
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  Toasts, loading states, error handling, responsive design
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/documentation/features/campaign-management-quick-start.md">
                <Button className="w-full">View Quick Start Guide →</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-gray-50 border rounded-lg text-sm text-gray-600 text-center">
          This placeholder page will be replaced with the actual Campaign
          Management UI once Phase 2-6 are complete.
          <br />
          Estimated implementation time: 30-40 hours
        </div>
      </div>
    </AppLayout>
  );
}
