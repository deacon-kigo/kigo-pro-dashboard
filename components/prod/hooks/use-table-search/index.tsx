import type { BaseSearchParams } from "@/components/prod/constants/search-params";

import { useCallback } from "react";

import { useUpdateSearchParams } from "@/components/prod/hooks/use-update-search-params";

export const useTableSearch = () => {
  const { setParams } = useUpdateSearchParams<BaseSearchParams>();

  const handleSearch = useCallback(
    (value: string) => {
      setParams({
        page: "1", // Reset to first page when searching
        searchQuery: value,
      });
    },
    [setParams]
  );

  const clearSearch = useCallback(() => {
    setParams({
      page: "1",
      searchQuery: "",
    });
  }, [setParams]);

  return {
    clearSearch,
    handleSearch,
  };
};
