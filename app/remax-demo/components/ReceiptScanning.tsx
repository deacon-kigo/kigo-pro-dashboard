"use client";

import { useState } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Signal, Wifi, BatteryMedium } from "lucide-react";

interface ReceiptScanningProps {
  onNext: () => void;
}

export function ReceiptScanning({ onNext }: ReceiptScanningProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedReceipt, setScannedReceipt] = useState<any>(null);

  const simulateScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      setScannedReceipt({
        business: "The Roasterie",
        location: "Kansas City, MO",
        amount: "$12.45",
        points: 35,
        category: "Coffee & Dining",
      });
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="h-full bg-white text-gray-900 overflow-hidden">
      {/* Sticky Status Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
        <div className="flex justify-between items-center px-6 py-4 text-sm font-medium">
          <span className="select-none">9:41</span>
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-black" />
            <Wifi className="w-4 h-4 text-black" />
            <BatteryMedium className="w-5 h-4 text-black" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="px-3 py-1 bg-red-100 rounded-full">
            <span className="text-xs font-medium text-red-700">
              Moving Streak 1/3
            </span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📱 Receipt Scanner
          </h1>
          <p className="text-gray-600 text-sm">
            Scan receipts to earn points instantly
          </p>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="px-6 mb-6">
        <div className="relative">
          {/* Camera Preview */}
          <div className="aspect-[4/3] bg-gray-800 rounded-2xl overflow-hidden relative">
            {!isScanning && !scannedReceipt && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-white font-medium mb-1">
                    Position receipt in frame
                  </p>
                  <p className="text-gray-400 text-sm">Tap to scan</p>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg
                      className="w-8 h-8 text-white animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <p className="text-white font-medium mb-1">
                    Scanning receipt...
                  </p>
                  <p className="text-gray-400 text-sm">Please wait</p>
                </div>
              </div>
            )}

            {scannedReceipt && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {scannedReceipt.business}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {scannedReceipt.location}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900">
                            {scannedReceipt.amount}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                +
                              </span>
                            </div>
                            <span className="font-semibold text-red-600">
                              {scannedReceipt.points} points
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Scanning Frame */}
            <div className="absolute inset-4 border-2 border-white/50 rounded-2xl">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400 rounded-br-lg"></div>
            </div>
          </div>

          {/* Scan Button */}
          {!scannedReceipt && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={simulateScan}
                disabled={isScanning}
                className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
              >
                {isScanning ? (
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="px-6 mb-6">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="text-center">
            <h3 className="font-semibold text-white mb-2">How it works</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Position receipt clearly in the frame</p>
              <p>• Tap the scan button to capture</p>
              <p>• Earn points instantly for verified purchases</p>
              <p>• Even Kansas City purchases count!</p>
            </div>
          </div>
        </Card>
      </div>

      {scannedReceipt && (
        <div className="px-6 mb-6">
          <Card className="bg-green-500/20 border border-green-400/30">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Receipt Scanned Successfully!
              </h3>
              <p className="text-gray-600 text-sm">
                "Even my local Kansas City coffee shop counts!"
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
