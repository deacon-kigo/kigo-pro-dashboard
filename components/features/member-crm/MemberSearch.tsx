"use client";

import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { MemberWithPoints } from "./types";
import { searchMembers } from "./data";
import { formatDate } from "./utils";

interface MemberSearchProps {
  onSelectMember: (member: MemberWithPoints) => void;
}

/**
 * MemberSearch component - Allows CS agents to search for members
 * @classification organism
 * @description Search interface for finding members by email, name, or account ID
 */
export default function MemberSearch({ onSelectMember }: MemberSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MemberWithPoints[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const results = searchMembers(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const recentSearches = [
    {
      query: "john.doe@email.com",
      program: "Optum HealthyBenefits+",
      time: "2 minutes ago",
    },
    {
      query: "sarah.johnson@email.com",
      program: "Optum HealthyBenefits+",
      time: "15 minutes ago",
    },
    {
      query: "michael.chen@email.com",
      program: "Optum HealthyBenefits+",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="space-y-6">
      <Card title="Find Member">
        <div className="p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Search by email, name, or account ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Recent Searches */}
          {!hasSearched && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Recent Searches:
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(search.query);
                      handleSearch();
                    }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {search.query}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {search.time}
                      </span>
                    </div>
                    <div className="ml-6 text-xs text-gray-500">
                      {search.program}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {hasSearched && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {searchResults.length > 0
                  ? `Found ${searchResults.length} member${searchResults.length !== 1 ? "s" : ""}`
                  : "No members found"}
              </h3>

              {searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No members found matching "{searchQuery}"
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Try searching by email address, full name, or account ID
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((member) => (
                    <div
                      key={member.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => onSelectMember(member)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {member.firstName[0]}
                              {member.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-base font-semibold text-gray-900">
                              {member.fullName}
                            </h4>
                            <div className="flex items-center mt-1">
                              <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">
                                {member.email}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">
                                Account ID: {member.accountId}
                              </span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-gray-500">
                                Member Since: {formatDate(member.memberSince)}
                              </span>
                            </div>
                            <div className="mt-2">
                              {member.programs.map((program) => (
                                <span
                                  key={program.id}
                                  className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mr-2"
                                >
                                  {program.displayName}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm">
                          View Details →
                        </Button>
                      </div>

                      {/* Points Balance Preview */}
                      {member.pointsBalances.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Current Balance:
                            </span>
                            <span className="text-base font-semibold text-gray-900">
                              {member.pointsBalances[0].currentPoints.toLocaleString()}{" "}
                              points
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
