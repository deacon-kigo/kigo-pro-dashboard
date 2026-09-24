"use client";

import { useSearchParams } from "@/components/prod/_runtime/navigation";

import { SingleSelect } from "@/components/prod/select/single";
import { useUpdateSearchParams } from "@/components/prod/hooks/use-update-search-params";

import { PAGE_SIZES } from "../../constants/page-size";

const PaginationPageSizeSelector = () => {
  const searchParams = useSearchParams();
  const { setParams } = useUpdateSearchParams();
  const pageSize = searchParams.get("pageSize") ?? PAGE_SIZES[0];

  const handlePageSizeChange = (
    value: null | { label: string; value: string }
  ) => {
    setParams(
      {
        page: "1",
        pageSize: value?.value ?? PAGE_SIZES[0].toString(),
      },
      { mode: "push" }
    );
  };

  return (
    <div
      className="flex items-center space-x-2"
      data-testid="pagination-page-size-selector"
    >
      <p className="text-muted-foreground text-sm font-medium">
        Items per page:
      </p>

      <SingleSelect
        className="h-8 w-20"
        onChange={handlePageSizeChange}
        options={PAGE_SIZES.map((pageSize) => ({
          label: pageSize.toString(),
          value: pageSize.toString(),
        }))}
        value={{ label: pageSize.toString(), value: pageSize.toString() }}
      />
    </div>
  );
};

export { PaginationPageSizeSelector };
