"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BuildingStorefrontIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setMerchantCreationState,
  resetMerchantManager,
} from "@/lib/redux/slices/merchantManagerSlice";

/**
 * Merchant Manager Dashboard View
 * This is a placeholder view for the Merchants module
 */
const MerchantManagerView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { merchants, isCreatingMerchant } = useAppSelector(
    (state) => state.merchantManager
  );

  const handleStartCreation = () => {
    dispatch(
      setMerchantCreationState({
        isCreatingMerchant: true,
        currentStep: "profile",
        workflowPhase: "profile_setup",
      })
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-gradient-to-r from-white/95 via-white/90 to-white/85 backdrop-blur-md">
        <div className="h-[72px] flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Merchant Manager
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage merchants, locations, and contracts
            </p>
          </div>
          <Button
            onClick={handleStartCreation}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Merchant
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Coming Soon Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BuildingStorefrontIcon className="h-6 w-6 text-primary" />
                Merchant Management Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  The Merchant Manager will provide comprehensive tools for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Merchant onboarding and profile management</li>
                  <li>Location management with bulk upload support</li>
                  <li>Image and logo management with auto-scraping</li>
                  <li>Contract generation and communication</li>
                  <li>Closure detection and reporting</li>
                </ul>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    🚧 This module is currently under development and will be
                    available soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <BuildingStorefrontIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {merchants.length}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Total Merchants</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900">0</h3>
                  <p className="text-sm text-gray-600 mt-1">Active Locations</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900">0</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Pending Onboarding
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantManagerView;
