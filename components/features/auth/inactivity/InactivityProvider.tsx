"use client";

import React, { useEffect, useCallback, ReactNode, useRef } from "react";
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track current countdown value
  const currentValueRef = useRef<number>(0);

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

  // Clear any existing timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start a countdown timer
  const startTimer = useCallback(
    (seconds: number) => {
      // Initialize with the starting value
      updateRemainingTime(seconds);
      currentValueRef.current = seconds;

      // Clear any existing timer first
      clearTimer();

      // Start a new timer that ticks every second
      timerRef.current = setInterval(() => {
        // Decrement the current value
        currentValueRef.current = Math.max(0, currentValueRef.current - 1);
        // Update Redux state with new value
        updateRemainingTime(currentValueRef.current);
      }, 1000);
    },
    [clearTimer, updateRemainingTime]
  );

  // Set the configured timeout values when component mounts
  useEffect(() => {
    configureSessionTimeouts({
      sessionTimeoutMinutes: timeoutInMinutes,
      warningTimeoutMinutes: warningBeforeTimeoutInMinutes,
    });

    // Cleanup on unmount
    return clearTimer;
  }, [
    timeoutInMinutes,
    warningBeforeTimeoutInMinutes,
    configureSessionTimeouts,
    clearTimer,
  ]);

  // Handle sign out
  const handleSignOut = useCallback(() => {
    // Clear timer
    clearTimer();

    // Hide warning dialog
    hideTimeoutWarning();

    // Call expireUserSession action which will dispatch logout
    // and redirect to sign-in page
    expireUserSession();

    // Redirect to SSO login page
    router.push("/sso/login");
  }, [expireUserSession, hideTimeoutWarning, router, clearTimer]);

  // User chose to continue session
  const handleStayActive = useCallback(() => {
    // Record new activity and hide warning
    recordActivity();
    hideTimeoutWarning();
    clearTimer();
  }, [recordActivity, hideTimeoutWarning, clearTimer]);

  // Set up inactivity detection timer
  useEffect(() => {
    // Calculate when to show warning
    const warningDelay =
      (sessionTimeoutMinutes - warningTimeoutMinutes) * 60 * 1000;

    // Timer to show warning dialog
    const inactivityTimer = setTimeout(() => {
      showTimeoutWarning();
      startTimer(warningTimeoutMinutes * 60);
    }, warningDelay);

    return () => clearTimeout(inactivityTimer);
  }, [
    lastActivity,
    sessionTimeoutMinutes,
    warningTimeoutMinutes,
    showTimeoutWarning,
    startTimer,
  ]);

  // Handle auto logout when countdown reaches zero
  useEffect(() => {
    if (showWarning && remainingSeconds === 0) {
      handleSignOut();
    }
  }, [showWarning, remainingSeconds, handleSignOut]);

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
              Due to inactivity, your session will automatically sign out in{" "}
              <span className="font-semibold text-red-500">5 minutes</span>
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
