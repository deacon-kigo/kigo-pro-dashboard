/**
 * Agent Navigation Hook
 *
 * This hook bridges Redux state changes to actual Next.js navigation.
 * When agents dispatch setCurrentPage(), this triggers router.push().
 */

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../redux/hooks";

export function useAgentNavigation() {
  const router = useRouter();
  const currentPage = useAppSelector((state) => state.ui.currentPage);
  const previousPage = useRef<string>("");

  // Log every state change for debugging
  console.log(
    "[Agent Navigation] Hook render - currentPage:",
    currentPage,
    "previousPage:",
    previousPage.current
  );

  useEffect(() => {
    console.log(
      "[Agent Navigation] useEffect triggered - currentPage:",
      currentPage,
      "previousPage:",
      previousPage.current
    );

    // Only navigate if currentPage actually changed and it's a real navigation
    if (
      currentPage &&
      currentPage !== previousPage.current &&
      currentPage !== "/" && // Ignore default/empty state
      currentPage.startsWith("/") // Ensure it's a valid path
    ) {
      console.log("[Agent Navigation] ✅ Navigation conditions met!");
      console.log(
        "[Agent Navigation] Navigating from",
        previousPage.current,
        "to",
        currentPage
      );

      // Perform actual Next.js navigation
      router.push(currentPage);

      // Update previous page reference
      previousPage.current = currentPage;

      console.log("[Agent Navigation] Navigation dispatched via router.push()");
    } else {
      console.log("[Agent Navigation] ❌ Navigation conditions not met:", {
        currentPage,
        hasCurrentPage: !!currentPage,
        isDifferent: currentPage !== previousPage.current,
        notRoot: currentPage !== "/",
        isValidPath: currentPage?.startsWith("/"),
      });
    }
  }, [currentPage, router]);

  return currentPage;
}
