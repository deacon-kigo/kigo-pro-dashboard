"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { toast } from "@/lib/hooks/use-toast";

/**
 * SSO Login Demo Error Page
 * Shows what happens when a user without proper Kigo Pro access group tries to sign in
 */
export default function LoginDemoErrorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Auto trigger the error toast on page load
  useEffect(() => {
    // Show the unauthorized access toast
    toast({
      variant: "destructive",
      title: "Access Denied",
      description:
        "You are not authorized to access Kigo Pro, please contact IT Support at sysadmin@kigo.io",
    });

    // Simulate a loading state for a short period
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 via-blue-50/80 to-pastel-purple/10 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
        <div className="flex flex-col items-center p-8">
          {/* Kigo Logo */}
          <div className="mb-8 flex items-center justify-center">
            <Image
              src="/kigo logo.svg"
              alt="Kigo Logo"
              width={140}
              height={60}
              priority
            />
          </div>

          {/* Heading */}
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Sign in to Kigo PRO
          </h2>

          {/* Subheading */}
          <p className="mb-8 text-center text-sm text-gray-600">
            Sign in using your Augeo credentials associated with the
            augeocorp.net domain
          </p>

          {/* SSO Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full mb-6 flex items-center justify-center"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 mr-2 relative flex items-center justify-center">
                <Image
                  src="/logos/okta logo.svg"
                  alt="Okta Logo"
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
              </div>
              <span>
                {isLoading ? "Authenticating..." : "Sign in with Okta SSO"}
              </span>
            </div>
          </Button>

          {/* Help Section - More Explicit */}
          <div className="w-full mt-4 p-4 bg-gray-50 rounded-md border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Need Help?
            </h3>
            <ul className="text-xs text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Make sure you're using your{" "}
                  <strong>Augeo email address</strong> (@augeocorp.net)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Contact{" "}
                  <a
                    href="mailto:sysadmin@kigo.io"
                    className="text-blue-600 font-bold hover:underline"
                  >
                    IT Support
                  </a>{" "}
                  for access issues
                </span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Access is restricted to authorized internal users with valid Augeo
            credentials.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Kigo. All rights reserved.
      </div>
    </div>
  );
}
