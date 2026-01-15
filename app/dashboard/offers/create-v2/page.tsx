"use client";

import { useRouter } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

/**
 * Offer Creation V2 - Enhanced with Smart Features
 *
 * This is a placeholder for the V2 offer creation form.
 * When ready, this will include:
 * - Smart defaults based on merchant selection
 * - Real-time inline validation
 * - Auto-save drafts
 * - Field dependencies and suggestions
 * - Progress indicator
 *
 * To enable: Set NEXT_PUBLIC_OFFER_CREATION_VERSION=v2
 */
export default function OfferCreationV2Page() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🚲</div>
            <h1 className="text-3xl font-bold mb-4">
              Offer Creation V2 - Coming Soon
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              The enhanced offer creation form with smart defaults, inline
              validation, and auto-save features is currently in development.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
              <h2 className="font-semibold text-blue-900 mb-3">
                Planned Features:
              </h2>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">🎯</span>
                  <span>Smart defaults based on merchant selection</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Real-time inline validation with helpful messages</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💾</span>
                  <span>Auto-save drafts every 30 seconds</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔗</span>
                  <span>Field dependencies and auto-suggestions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📊</span>
                  <span>Progress indicator showing completion percentage</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
              <p>
                <strong>For now, use V1:</strong> You've been automatically
                redirected here because
                <code className="bg-white px-2 py-1 rounded mx-1">
                  NEXT_PUBLIC_OFFER_CREATION_VERSION=v2
                </code>
                is set. To use the current production form, set it to
                <code className="bg-white px-2 py-1 rounded mx-1">v1</code>.
              </p>
            </div>

            <div className="mt-8">
              <Button
                onClick={() => router.push("/dashboard/offers/create")}
                className="mr-4"
              >
                Use V1 Form (Current)
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
