"use client";

import React from "react";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  siblingsCount?: number;
}

/**
 * Pagination component
 *
 * A reusable pagination component that wraps shadcn/ui pagination
 * and provides additional functionality.
 */
export function Pagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  className,
  showFirstLast = true,
  siblingsCount = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first page, last page, current page, and siblings
    const siblingRange = Array.from(
      { length: siblingsCount * 2 + 1 },
      (_, i) => {
        const page = currentPage - siblingsCount + i;
        return page > 0 && page <= totalPages ? page : null;
      }
    ).filter(Boolean) as number[];

    // Add first and last pages if not already included
    if (!siblingRange.includes(1)) {
      siblingRange.unshift(1);
      // Add ellipsis if there's a gap
      if (siblingRange[1] > 2) {
        siblingRange.splice(1, 0, -1); // -1 represents ellipsis
      }
    }

    if (!siblingRange.includes(totalPages)) {
      // Add ellipsis if there's a gap
      if (siblingRange[siblingRange.length - 1] < totalPages - 1) {
        siblingRange.push(-1); // -1 represents ellipsis
      }
      siblingRange.push(totalPages);
    }

    return siblingRange;
  };

  const pages = generatePagination();

  return (
    <div className={cn("py-4", className)}>
      <ShadcnPagination>
        <PaginationContent>
          {showFirstLast && (
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to first page</span>
                <span>First</span>
              </Button>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {pages.map((page, index) => (
            <PaginationItem key={`page-${page}-${index}`}>
              {page === -1 ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>

          {showFirstLast && (
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <span>Last</span>
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
}

export default Pagination;
