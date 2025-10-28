"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/atoms/Breadcrumb";
import { Card } from "@/components/ui/card";
import {
  GiftIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

function YardiPresentationContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Yardi Kigo PRO Platform Presentation
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Enterprise-grade tenant engagement and offer management solutions
          powered by AI
        </p>
      </div>

      {/* Slide Cards */}
      <div className="grid grid-cols-2 gap-8">
        {/* Slide 1 */}
        <Link href="/yardi-presentation/slide-1">
          <Card className="p-8 border-2 border-blue-200 hover:border-blue-400 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-white group">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform"
              style={{ backgroundColor: "#0066CC" }}
            >
              <GiftIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Slide 1: Offer Manager
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Showcase comprehensive offer creation, management, and
              multi-channel deployment capabilities
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                AI-powered offer recommendations
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                Multi-channel distribution (Hub, Marketplace, Campaigns)
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                Real-time performance tracking
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                Property portfolio management
              </div>
            </div>
            <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              View Slide
              <ArrowRightIcon className="h-5 w-5" />
            </div>
          </Card>
        </Link>

        {/* Slide 2 */}
        <Link href="/yardi-presentation/slide-2">
          <Card className="p-8 border-2 border-purple-200 hover:border-purple-400 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-white group">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform"
              style={{ backgroundColor: "#8B5CF6" }}
            >
              <ChartBarIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Slide 2: Analytics Dashboard
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Demonstrate real-time reporting, predictive analytics, and ROI
              tracking capabilities
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-3" />
                AI-powered predictive forecasting
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-3" />
                Comprehensive ROI tracking
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-3" />
                Property portfolio analytics
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-3" />
                Tenant segment performance
              </div>
            </div>
            <div className="flex items-center justify-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              View Slide
              <ArrowRightIcon className="h-5 w-5" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Info Box */}
      <Card className="p-6 border border-gray-200 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#0066CC" }}
          >
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">
              Screenshot Instructions
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              These slides are optimized for presentation screenshots. Each
              slide is designed to be captured full-screen at 1920x1080 or
              higher resolution for maximum clarity.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-1">Slide 1 Features:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Performance trend charts</li>
                  <li>• Top performing offers</li>
                  <li>• Property portfolio breakdown</li>
                  <li>• Offer type distribution</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">Slide 2 Features:</p>
                <ul className="space-y-1 text-xs">
                  <li>• AI predictive forecasting</li>
                  <li>• ROI tracking metrics</li>
                  <li>• Portfolio performance charts</li>
                  <li>• Tenant segment radar analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function YardiPresentationIndex() {
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Yardi Presentation</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AppLayout customBreadcrumb={breadcrumb}>
        <YardiPresentationContent />
      </AppLayout>
    </Suspense>
  );
}
