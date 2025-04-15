"use client";

import React, { useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog";
import { Button } from "@/components/atoms/Button";
import { useSessionState, useSessionActions } from "@/lib/redux/hooks";

interface InactivityProviderProps {
  children: ReactNode;
  timeoutInMinutes?: number; // Inactivity timeout in minutes
  warningBeforeTimeoutInMinutes?: number; // How many minutes before timeout to show warning
}

export const InactivityProvider: React.FC<InactivityProviderProps> = ({
  children,
  timeoutInMinutes = 60, // Default to 60 minutes (1 hour)
  warningBeforeTimeoutInMinutes = 5, // Default to 5 minutes warning
}) => {
  const router = useRouter();

  // Get session state and actions from Redux
  const {
    showTimeoutWarning: showWarning,
    lastActivity,
    remainingSeconds,
    sessionTimeoutMinutes,
    warningTimeoutMinutes,
  } = useSessionState();

  const {
    recordActivity,
    showTimeoutWarning,
    hideTimeoutWarning,
    updateRemainingTime,
    expireUserSession,
    configureSessionTimeouts,
  } = useSessionActions();

  // Set the configured timeout values when component mounts
  useEffect(() => {
    configureSessionTimeouts({
      sessionTimeoutMinutes: timeoutInMinutes,
      warningTimeoutMinutes: warningBeforeTimeoutInMinutes,
    });
  }, [
    timeoutInMinutes,
    warningBeforeTimeoutInMinutes,
    configureSessionTimeouts,
  ]);

  // Handle sign out
  const handleSignOut = useCallback(() => {
    // Hide warning dialog
    hideTimeoutWarning();

    // Call expireUserSession action which will dispatch logout
    // and redirect to sign-in page
    expireUserSession();

    // Redirect to SSO login page
    router.push("/sso/login");
  }, [expireUserSession, hideTimeoutWarning, router]);

  // User chose to continue session
  const handleStayActive = useCallback(() => {
    // Record new activity and hide warning
    recordActivity();
  }, [recordActivity]);

  // Set up inactivity detection timers
  useEffect(() => {
    // Calculate when to show warning
    const warningDelay =
      (sessionTimeoutMinutes - warningTimeoutMinutes) * 60 * 1000;

    // Timer to show warning dialog
    const warningTimer = setTimeout(() => {
      showTimeoutWarning();

      // Timer for actual logout
      const logoutTimer = setTimeout(
        () => {
          handleSignOut();
        },
        warningTimeoutMinutes * 60 * 1000
      );

      return () => clearTimeout(logoutTimer);
    }, warningDelay);

    return () => clearTimeout(warningTimer);
  }, [
    lastActivity,
    sessionTimeoutMinutes,
    warningTimeoutMinutes,
    showTimeoutWarning,
    handleSignOut,
  ]);

  // Countdown timer when warning is showing
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;

    if (showWarning) {
      // Set up countdown interval
      countdownInterval = setInterval(() => {
        updateRemainingTime(Math.max(0, remainingSeconds - 1));
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [showWarning, remainingSeconds, updateRemainingTime]);

  // Set up event listeners for user activity
  useEffect(() => {
    // Events to track for user activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "keypress",
    ];

    // Event handler for user activity
    const handleUserActivity = () => {
      // Only record activity if warning is not showing
      if (!showWarning) {
        recordActivity();
      }
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [showWarning, recordActivity]);

  // Format countdown time as MM:SS
  const formatCountdown = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {children}

      <AlertDialog
        open={showWarning}
        onOpenChange={(open) => {
          if (!open) hideTimeoutWarning();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
            <AlertDialogDescription>
              Due to inactivity, your session will automatically log out in{" "}
              <span className="font-semibold text-red-500">
                {formatCountdown()}
              </span>
              .
              <br />
              <br />
              Please click "Stay Signed In" to continue your session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out Now
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleStayActive}>Stay Signed In</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InactivityProvider;
