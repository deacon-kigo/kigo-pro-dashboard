"use client";

import React, { useState } from "react";
import { Input } from "@/components/atoms/Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export type SearchField = "name" | "merchantName" | "offerName" | "status";

interface AdSearchBarProps {
  onSearch: (query: string, field: SearchField) => void;
}

/**
 * Search component for ads table
 * Allows global searching across all fields
 */
export function AdSearchBar({ onSearch }: AdSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // We'll search all fields by sending "name" as the default field
    // The table component will handle this globally
    onSearch(value, "name");
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search ads..."
        value={searchQuery}
        onChange={handleInputChange}
        className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full"
      />
    </div>
  );
}
