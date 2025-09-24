"use client";

import { useState, useEffect } from "react";

interface TransactionConfirmationProps {
  onComplete: () => void;
}

export function TransactionConfirmation({
  onComplete,
}: TransactionConfirmationProps) {
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);

  useEffect(() => {
    // Show success notification immediately
    setShowSuccessNotification(true);

    // Show points animation after 1 second
    const pointsTimer = setTimeout(() => {
      setShowPointsAnimation(true);
    }, 1000);

    // Auto-complete after 5 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(pointsTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Success background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-100/50 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-100/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-16 h-16 bg-yellow-100/50 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 space-y-8">
        {/* Success icon */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success message */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Successful! ☕️
          </h1>
          <p className="text-lg text-gray-700">
            Thank you for trying Starbucks, Sarah!
          </p>
        </div>

        {/* Transaction details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm space-y-4">
          <div className="text-center border-b pb-4">
            <h3 className="font-bold text-gray-900">Transaction Complete</h3>
            <p className="text-sm text-gray-600">Just now</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Pike Place Roast</span>
              <span className="font-medium">$2.45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">ABC FI •••• 4567</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-bold">Total</span>
              <span className="font-bold">$2.45</span>
            </div>
          </div>
        </div>

        {/* Points notification */}
        {showPointsAnimation && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-xl p-6 w-full max-w-sm animate-slide-up">
            <div className="text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-bold text-white">
                Bonus Points Earned!
              </h3>
              <div className="text-3xl font-bold text-white">+1,000 Points</div>
              <p className="text-white/90 text-sm">
                Added to your ABC FI account
              </p>
            </div>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={onComplete}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl hover:bg-blue-700 transition-colors"
        >
          Continue Demo
        </button>
      </div>

      {/* Push notification overlay */}
      {showSuccessNotification && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-4 max-w-sm animate-slide-down z-20">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src="/logos/abc-fi-logo.png"
                alt="ABC FI"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">ABC FI</h4>
                <span className="text-xs text-gray-500">now</span>
              </div>

              <h3 className="font-bold text-gray-900 text-base mb-1">
                Transaction Successful
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-bold text-green-600">
                  1,000 bonus points
                </span>{" "}
                have been added to your account! ☕️🎉
              </p>

              <div className="flex items-center mt-2 space-x-2">
                <div className="text-xs text-green-600 font-medium">
                  Starbucks • $2.45
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
