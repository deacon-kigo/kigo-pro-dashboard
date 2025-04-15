"use client";

import React, { useEffect, useCallback, ReactNode, useState } from "react";
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
  // Local state for countdown instead of relying solely on Redux
  const [localRemainingSeconds, setLocalRemainingSeconds] = useState(
    warningBeforeTimeoutInMinutes * 60
  );

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
    // Initialize local countdown with the warning time
    setLocalRemainingSeconds(warningBeforeTimeoutInMinutes * 60);
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
    // Reset local countdown
    setLocalRemainingSeconds(warningTimeoutMinutes * 60);
  }, [recordActivity, warningTimeoutMinutes]);

  // Set up inactivity detection timers
  useEffect(() => {
    // Calculate when to show warning
    const warningDelay =
      (sessionTimeoutMinutes - warningTimeoutMinutes) * 60 * 1000;

    // Timer to show warning dialog
    const warningTimer = setTimeout(() => {
      showTimeoutWarning();
      // Initialize countdown when showing warning
      setLocalRemainingSeconds(warningTimeoutMinutes * 60);

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

    if (showWarning && localRemainingSeconds > 0) {
      // Set up countdown interval
      countdownInterval = setInterval(() => {
        setLocalRemainingSeconds((prevSeconds) => {
          const newSeconds = Math.max(0, prevSeconds - 1);
          // Keep Redux in sync with our local state
          updateRemainingTime(newSeconds);
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [showWarning, localRemainingSeconds, updateRemainingTime]);

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
    const minutes = Math.floor(localRemainingSeconds / 60);
    const seconds = localRemainingSeconds % 60;
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
