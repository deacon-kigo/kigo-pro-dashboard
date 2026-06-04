"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";

/**
 * Simulated SSO login for the John Deere Perks Pro dealer experience (Dealer Dan).
 * On sign-in we route into the dealer-scoped Campaign Manager; the dealer persona
 * is set there by DealerShell.
 */
export default function JohnDeereSSOPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/campaign-manager/john-deere");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
        {/* Brand bar */}
        <div
          className="flex items-center gap-3 px-8 py-5"
          style={{ backgroundColor: "#367C2B" }}
        >
          <span
            className="text-lg font-extrabold tracking-wide"
            style={{ color: "#FFDE00" }}
          >
            JOHN DEERE
          </span>
          <span className="text-sm font-medium text-white/80">Perks Pro</span>
        </div>

        <div className="flex flex-col items-center p-8">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Image
              src="/kigo logo.svg"
              alt="Kigo Logo"
              width={120}
              height={50}
              priority
            />
          </div>

          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Dealer Sign In
          </h2>
          <p className="mb-8 text-center text-sm text-gray-600">
            Sign in to manage your John Deere Perks campaigns for Everglades
            Equipment.
          </p>

          <Button
            variant="primary"
            size="lg"
            className="mb-4 w-full"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign in with John Deere SSO"}
          </Button>

          <p className="text-center text-xs text-gray-400">
            Signed in as Dealer Dan · Everglades Equipment
          </p>
        </div>
      </div>
    </div>
  );
}
