import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import { FilterCoverageStats } from "@/services/ai/filterHandler";

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return (
    Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9)
  );
};

// Define FilterCriteria type
export interface FilterCriteria {
  id: string;
  type: string;
  value: string;
  rule: string;
  and_or: string;
  isRequired: boolean;
}

// Define ProductFilterState
export interface ProductFilterState {
  filterName: string;
  queryViewName: string;
  description: string;
  criteria: FilterCriteria[];
  selectedSources: string[];
  isGenerating: boolean;
  lastGeneratedFilter: string | null;
  coverageStats: FilterCoverageStats | null;
}

// Initial state
const initialState: ProductFilterState = {
  filterName: "",
  queryViewName: "",
  description: "",
  criteria: [],
  selectedSources: [], // No default selection - users must actively choose sources
  isGenerating: false,
  lastGeneratedFilter: null,
  coverageStats: null,
};

// Create a helper function to ensure all properties are serializable
const ensureSerializable = <T>(obj: T): T => {
  // If it's null or undefined, return as is
  if (obj === null || obj === undefined) {
    return obj;
  }

  // If it's a Date, convert to ISO string
  if (obj instanceof Date) {
    return obj.toISOString() as unknown as T;
  }

  // If it's an array, process each element
  if (Array.isArray(obj)) {
    return obj.map(ensureSerializable) as unknown as T;
  }

  // If it's an object, process each property
  if (typeof obj === "object") {
    const result = {} as T;
    Object.entries(obj).forEach(([key, value]) => {
      result[key as keyof T] = ensureSerializable(value);
    });
    return result;
  }

  // Otherwise return as is (for primitives)
  return obj;
};

// Create a properly typed action creator for filter updates
export const applyFilterUpdate = createAction<{
  filterName?: string;
  queryViewName?: string;
  description?: string;
  criteriaToAdd?: Omit<FilterCriteria, "id">[];
}>("productFilter/applyFilterUpdate");

// Create the slice
export const productFilterSlice = createSlice({
  name: "productFilter",
  initialState,
  reducers: {
    setFilterName: (state, action: PayloadAction<string>) => {
      state.filterName = action.payload;
    },
    setQueryViewName: (state, action: PayloadAction<string>) => {
      state.queryViewName = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    addCriteria: (state, action: PayloadAction<Omit<FilterCriteria, "id">>) => {
      const id = generateUniqueId();
      state.criteria.push({ ...action.payload, id });
    },
    removeCriteria: (state, action: PayloadAction<string>) => {
      state.criteria = state.criteria.filter((c) => c.id !== action.payload);
    },
    setCriteria: (state, action: PayloadAction<FilterCriteria[]>) => {
      state.criteria = action.payload;
    },
    setSelectedSources: (state, action: PayloadAction<string[]>) => {
      state.selectedSources = action.payload;
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setLastGeneratedFilter: (state, action: PayloadAction<string | null>) => {
      state.lastGeneratedFilter = action.payload;
    },
    resetFilter: (state) => {
      return initialState;
    },
    // Internal reducer, not exported directly
    _applyFilterUpdate: (
      state,
      action: PayloadAction<{
        filterName?: string;
        queryViewName?: string;
        description?: string;
        criteriaToAdd?: Omit<FilterCriteria, "id">[];
      }>
    ) => {
      const { filterName, queryViewName, description, criteriaToAdd } =
        action.payload;

      if (filterName !== undefined) state.filterName = filterName;
      if (queryViewName !== undefined) state.queryViewName = queryViewName;
      if (description !== undefined) state.description = description;

      if (criteriaToAdd && criteriaToAdd.length > 0) {
        // Always add new criteria with new IDs, no longer replacing existing ones
        const newCriteria = criteriaToAdd.map((criteria) => ({
          ...ensureSerializable(criteria),
          id: generateUniqueId(),
        }));

        // Simply add all new criteria to the existing array
        state.criteria = [...state.criteria, ...newCriteria];
      }
    },
    setCoverageStats: (state, action: PayloadAction<FilterCoverageStats>) => {
      state.coverageStats = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle filter update with serialization
    builder.addCase(applyFilterUpdate, (state, action) => {
      const { filterName, queryViewName, description, criteriaToAdd } =
        action.payload;

      productFilterSlice.caseReducers._applyFilterUpdate(state, {
        type: "_applyFilterUpdate",
        payload: {
          filterName,
          queryViewName,
          description,
          criteriaToAdd,
        },
      });
    });
  },
});

// Export other actions directly
export const {
  setFilterName,
  setQueryViewName,
  setDescription,
  addCriteria,
  removeCriteria,
  setCriteria,
  setSelectedSources,
  setIsGenerating,
  setLastGeneratedFilter,
  resetFilter,
  setCoverageStats,
} = productFilterSlice.actions;

export default productFilterSlice.reducer;
