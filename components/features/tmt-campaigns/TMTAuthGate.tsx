"use client";

import { useState, useEffect, ReactNode } from "react";
import { authService } from "@/lib/services/tmtAuthService";

interface TMTAuthGateProps {
  children: ReactNode;
}

/**
 * TMTAuthGate — transparently authenticates with the TMT backend.
 * In v1 (test), auto-logs in with static credentials.
 * In production, this will be replaced with Okta SSO token passthrough.
 */
export default function TMTAuthGate({ children }: TMTAuthGateProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function ensureAuth() {
      // If already authenticated, just start refresh timer
      if (authService.initialize()) {
        setIsReady(true);
        return;
      }

      // Auto-login with test credentials (v1)
      // TODO: Replace with Okta SSO token passthrough in production
      try {
        await authService.login("admin@kigo.io", "Kigo123!");
      } catch (err: any) {
        console.warn(
          "TMT auto-auth failed, running in offline mode:",
          err.message
        );
      }
      // Always render children — API calls will gracefully fail individually
      setIsReady(true);
    }

    ensureAuth();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <p className="text-sm text-red-500">
            TMT authentication failed: {error}
          </p>
          <p className="text-xs text-muted-foreground">
            Check that the Kigo Core Server is reachable.
          </p>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">
            Connecting to Campaign Manager...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
