"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  id: string;
  placeholder: string;
  className?: string;
  debounceMs?: number;
  minLength?: number;
}

/**
 * SearchBar component with URL-based search state and debouncing
 * Follows the pattern from kigo-admin-tools SearchBar
 */
export function SearchBar({
  id,
  placeholder,
  className,
  debounceMs = 300,
  minLength = 3,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("searchQuery") ?? "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const lastSearchRef = useRef<string>(initialQuery);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the search
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value.length >= minLength) {
        // Only search if different from last search
        if (lastSearchRef.current !== value) {
          lastSearchRef.current = value;
          params.set("searchQuery", value);
          params.set("page", "1"); // Reset to first page on new search
        }
      } else if (value.length === 0) {
        // Clear search
        if (lastSearchRef.current !== "") {
          lastSearchRef.current = "";
          params.delete("searchQuery");
          params.set("page", "1");
        }
      } else {
        // Query too short, don't search yet
        return;
      }

      router.push(`${pathname}?${params.toString()}`);
    }, debounceMs);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync with URL changes - DISABLED to prevent loops
  // useEffect(() => {
  //   const urlQuery = searchParams.get("searchQuery") ?? "";
  //   if (urlQuery !== lastSearchRef.current) {
  //     setSearchQuery(urlQuery);
  //     lastSearchRef.current = urlQuery;
  //   }
  // }, [searchParams]);

  return (
    <div className={cn("relative", className)}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        className="pl-10 w-full"
      />
    </div>
  );
}
