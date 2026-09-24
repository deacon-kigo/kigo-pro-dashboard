"use client";

import dynamic from "next/dynamic";
import {
  usePathname,
  useSearchParams,
} from "@/components/prod/_runtime/navigation";

import { useGetUpdatedSearchParams } from "@/components/prod/hooks/use-get-update-search-params";
import { cn } from "@/components/prod/utils/cn";

import { PaginationContent } from "./atoms/pagination-content";
import { PaginationEllipsis } from "./atoms/pagination-ellipsis";
import { PaginationFirst } from "./atoms/pagination-first";
import { PaginationItem } from "./atoms/pagination-item";
import { PaginationLast } from "./atoms/pagination-last";
import { PaginationLink } from "./atoms/pagination-link";
import { PaginationNext } from "./atoms/pagination-next";
import { PaginationPrevious } from "./atoms/pagination-previous";
import { PaginationWrapper } from "./atoms/pagination-wrapper";
import { PAGE_SIZES } from "./constants/page-size";
import { generatePages } from "./utils/generate-pages";

const PaginationPageSizeSelector = dynamic(
  () =>
    import("./atoms/pagination-page-size-selector").then(
      (module) => module.PaginationPageSizeSelector
    ),
  { ssr: false }
);

interface PaginationProps {
  className?: string;
  /** Noun for the counted rows, e.g. `"offers"` → "Showing 1 - 5 of 42 offers". */
  itemNoun?: string;
  pageCount: number;
  rowCount: number;
}

const Pagination = ({
  className,
  itemNoun = "items",
  pageCount,
  rowCount,
}: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getUpdateSearchParams = useGetUpdatedSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pages = generatePages({ currentPage, pageCount });

  const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZES[0];
  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(firstItem + pageSize - 1, rowCount);

  return (
    <div
      className={cn("flex w-full items-center", className)}
      data-testid="pagination"
    >
      <PaginationPageSizeSelector />
      <div className="text-muted-foreground ml-2 flex items-center text-sm font-medium">
        Showing {firstItem} - {lastItem} of {rowCount} {itemNoun}
      </div>

      <PaginationWrapper className="grow basis-0 justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              href={`${pathname}?${getUpdateSearchParams({ page: "1" })}`}
              isDisabled={currentPage === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href={`${pathname}?${getUpdateSearchParams({ page: (currentPage - 1).toString() })}`}
              isDisabled={currentPage === 1}
            />
          </PaginationItem>
          {pages.map((page, index) => (
            <PaginationItem key={`${page.toString()}-${index.toString()}`}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={`${pathname}?${getUpdateSearchParams({ page: page.toString() })}`}
                  isActive={currentPage === page}
                  isDisabled={page === currentPage}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={`${pathname}?${getUpdateSearchParams({
                page: (currentPage + 1).toString(),
              })}`}
              isDisabled={currentPage >= pageCount}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              href={`${pathname}?${getUpdateSearchParams({
                page: pageCount.toString(),
              })}`}
              isDisabled={currentPage >= pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationWrapper>
    </div>
  );
};

export { Pagination };
