"use client";

import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { MobileLayout } from "./MobileLayout";
import { OffersBanner } from "./OffersBanner";

interface SarahBankingDashboardProps {
  showNotification: boolean;
  onNotificationClick: () => void;
  onNotificationDismiss?: () => void;
  onNavigate?: (screen: string) => void;
}

export function SarahBankingDashboard({
  showNotification,
  onNotificationClick,
  onNotificationDismiss,
  onNavigate,
}: SarahBankingDashboardProps) {
  return (
    <MobileLayout>
      <div className="relative animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <img
              src="/logos/abc-fi-logo.png"
              alt="ABC FI"
              className="w-8 h-8"
            />
            <span className="text-lg font-bold text-gray-900">ABC FI</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="px-6 py-2">
          <h1 className="text-lg font-medium text-gray-700">
            Good morning, Kendall
          </h1>
        </div>

        {/* Offers Banner */}
        <OffersBanner onTap={() => onNavigate?.("kigo-marketplace")} />

        {/* Account Cards */}
        <div className="px-6 mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Credit Card */}
            <div
              className="min-w-[320px] text-white rounded-3xl p-6"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-indigo-200 text-sm font-medium mb-2">
                    Credit Card
                  </p>
                  <p className="text-3xl font-bold tracking-tight">$2,540.05</p>
                </div>
                <div className="w-10 h-10 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mastercard Logo */}
                  <div className="w-8 h-6 flex items-center justify-center">
                    <img
                      src="/logos/ma_symbol-dark.svg"
                      alt="Mastercard"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium">•••• 5567</span>
                </div>
                <span className="text-indigo-200 text-xs font-medium">
                  12/28
                </span>
              </div>
            </div>

            {/* Debit Card */}
            <div
              className="min-w-[320px] rounded-3xl p-6 border"
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                borderColor: "#cbd5e1",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-2">
                    Debit Card
                  </p>
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">
                    $3,247.82
                  </p>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* VISA Logo */}
                  <div className="px-2 py-1 bg-white rounded border border-gray-300 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-black tracking-wider">
                      VISA
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    •••• 2142
                  </span>
                </div>
                <span className="text-slate-400 text-xs font-medium">
                  08/27
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-8">
          <div className="flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-white rounded-2xl border border-gray-200 active:bg-gray-50 active:scale-[0.98] transition-all touch-manipulation select-none"
              style={{
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-900">
                Transfer to Card
              </span>
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-white rounded-2xl border border-gray-200 active:bg-gray-50 active:scale-[0.98] transition-all touch-manipulation select-none"
              style={{
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-900">
                Transfer to Account
              </span>
            </button>
          </div>
        </div>

        {/* Spendings Section */}
        <div className="px-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Spendings in April
            </h3>
            <button className="text-blue-600 font-semibold text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
              All
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center" shadow="lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="font-bold text-gray-900">$10,000</p>
              <p className="text-xs text-gray-600">All Transactions</p>
            </Card>

            <Card className="text-center" shadow="lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <p className="font-bold text-gray-900">$1,456</p>
              <p className="text-xs text-gray-600">Transferred</p>
            </Card>

            <Card className="text-center" shadow="lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <p className="font-bold text-gray-900">$271</p>
              <p className="text-xs text-gray-600">Online Shopping</p>
            </Card>
          </div>
        </div>

        {/* Savings Promotion */}
        <div className="px-6 mb-6">
          <div
            className="relative overflow-hidden rounded-2xl p-4 border"
            style={{
              background: "linear-gradient(90deg, #bfdbfe 0%, #93c5fd 100%)",
              borderColor: "#60a5fa",
              borderWidth: "1px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Savings</h4>
                <p className="text-sm text-gray-600">
                  Save and earn up to 16% annual interest
                </p>
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "#60a5fa",
                }}
              >
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <button
                className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <svg
                  className="w-3 h-3 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Native Push Notification */}
        {showNotification && (
          <div
            className="absolute top-4 left-4 right-4 z-50 animate-slide-down"
            style={{
              animation: "slideDown 0.5s ease-out",
            }}
          >
            <div
              onClick={onNotificationClick}
              className="bg-white rounded-2xl p-4 shadow-xl border border-gray-200 active:scale-[0.98] active:bg-gray-50 transition-all touch-manipulation select-none"
            >
              <div className="flex items-start gap-3">
                {/* ABC FI Logo */}
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 p-2 shadow-sm">
                  <img
                    src="/logos/abc-fi-logo.png"
                    alt="ABC FI"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      ABC FI
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">now</p>
                      {onNotificationDismiss && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNotificationDismiss();
                          }}
                          className="text-gray-400 hover:text-gray-600 text-lg leading-none p-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    🏡 Congratulations on your new Denver home!
                  </h4>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    We've found everything you need for your Kansas City to
                    Denver move.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </MobileLayout>
  );
}
