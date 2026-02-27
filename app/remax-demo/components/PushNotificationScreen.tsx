"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Signal, Wifi, BatteryMedium } from "lucide-react";

interface PushNotificationScreenProps {
  onNotificationClick: () => void;
}

export function PushNotificationScreen({
  onNotificationClick,
}: PushNotificationScreenProps) {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification after a brief delay
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNotificationTap = () => {
    setShowNotification(false);
    setTimeout(onNotificationClick, 300);
  };

  return (
    <div className="h-full bg-white relative overflow-hidden">
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

      {/* Blurred Background Content */}
      <div className="px-6 py-4 filter blur-sm opacity-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full"></div>
          <div>
            <p className="text-gray-600 text-sm">Good morning,</p>
            <p className="font-semibold text-gray-900">Jessica T.</p>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="h-32 bg-gradient-to-br from-red-400 to-red-600"></Card>
          <Card className="h-20"></Card>
          <Card className="h-16"></Card>
        </div>
      </div>

      {/* Push Notification */}
      <div
        className={`absolute top-16 left-4 right-4 transition-all duration-500 transform ${
          showNotification
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <Card
          className="bg-white border border-gray-200 cursor-pointer active:scale-95 transition-transform"
          onClick={handleNotificationTap}
          shadow="lg"
        >
          <div className="flex items-start gap-3">
            {/* RE/MAX Logo */}
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 p-2">
              <img
                src="/mock/remax_logo.svg"
                alt="RE/MAX"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-900 text-sm">RE/MAX</p>
                <p className="text-xs text-gray-500">now</p>
              </div>

              <h4 className="font-medium text-gray-900 text-sm mb-1">
                Congratulations on your new home purchase, Jessica!
              </h4>

              <p className="text-xs text-gray-600 leading-relaxed">
                We have a housewarming gift for you.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Instruction Text */}
      <div className="absolute bottom-8 left-4 right-4">
        <Card className="bg-red-50 border border-red-200">
          <div className="text-center">
            <p className="text-sm font-medium text-red-900 mb-2">
              📱 Demo Instruction
            </p>
            <p className="text-xs text-red-700">
              Tap the notification above to continue Jessica's journey
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
