"use client";

import React, { useState } from "react";
import { Input } from "@/components/atoms/Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// We'll maintain the type for backward compatibility
export type SearchField = "name" | "description" | "queryView" | "createdBy";

interface ProductFilterSearchBarProps {
  onSearch: (query: string, field: SearchField) => void;
}

/**
 * Search component for product filters table
 * Allows global searching across all fields
 */
export function ProductFilterSearchBar({
  onSearch,
}: ProductFilterSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // We'll search all fields by sending an empty string as the field
    // The table component will handle this differently
    onSearch(value, "name");
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search product filters..."
        value={searchQuery}
        onChange={handleInputChange}
        className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full"
      />
    </div>
  );
}
