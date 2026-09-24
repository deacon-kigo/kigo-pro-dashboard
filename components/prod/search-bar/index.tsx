"use client";

import type React from "react";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";

import { useSearchParams } from "@/components/prod/_runtime/navigation";
import { useDebounce } from "use-debounce";

import { SearchInput } from "@/components/prod/search-bar/atoms/search-input";
import { SEARCH_CONFIG } from "@/components/prod/constants/search-config";
import { useTableSearch } from "@/components/prod/hooks/use-table-search";
import { cn } from "@/components/prod/utils/cn";

interface SearchBarProps extends Omit<
  ComponentProps<typeof SearchInput>,
  "onChange" | "value"
> {}

function SearchBar({ className, ...props }: SearchBarProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") ?? ""
  );
  const { clearSearch, handleSearch } = useTableSearch();
  const [debouncedSearchQuery] = useDebounce(
    searchQuery,
    SEARCH_CONFIG.DEBOUNCE_DELAY
  );
  const lastSearchRef = useRef<string>("");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearchQuery(value);
  };

  useEffect(() => {
    if (
      debouncedSearchQuery &&
      debouncedSearchQuery.length >= SEARCH_CONFIG.MIN_LENGTH
    ) {
      // Only search if the query is different from the last search
      if (lastSearchRef.current !== debouncedSearchQuery) {
        lastSearchRef.current = debouncedSearchQuery;
        handleSearch(debouncedSearchQuery);
      }
    } else if (debouncedSearchQuery.length === 0) {
      // Only clear if we haven't already cleared
      if (lastSearchRef.current !== "") {
        lastSearchRef.current = "";
        clearSearch();
      }
    }
  }, [debouncedSearchQuery, handleSearch, clearSearch]);

  return (
    <SearchInput
      {...props}
      className={cn(
        "w-full rounded-md border border-gray-300 py-2 pr-3",
        className
      )}
      onChange={handleOnChange}
      value={searchQuery}
    />
  );
}

export { SearchBar };
