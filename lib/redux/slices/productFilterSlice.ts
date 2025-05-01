import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

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
  expiryDate: string | null;
  criteria: FilterCriteria[];
  isGenerating: boolean;
  lastGeneratedFilter: string | null;
}

// Initial state
const initialState: ProductFilterState = {
  filterName: "",
  queryViewName: "",
  description: "",
  expiryDate: null,
  criteria: [],
  isGenerating: false,
  lastGeneratedFilter: null,
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

// Create a properly typed action creator for dates
export const setExpiryDate = createAction<Date | null>(
  "productFilter/setExpiryDate"
);

// Create a properly typed action creator for filter updates
export const applyFilterUpdate = createAction<{
  filterName?: string;
  queryViewName?: string;
  description?: string;
  expiryDate?: Date | null;
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
    // Direct string setter, but we'll use the action creator above
    _setExpiryDate: (state, action: PayloadAction<string | null>) => {
      state.expiryDate = action.payload;
    },
    addCriteria: (state, action: PayloadAction<Omit<FilterCriteria, "id">>) => {
      const id =
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substring(2, 9);
      state.criteria.push({ ...action.payload, id });
    },
    removeCriteria: (state, action: PayloadAction<string>) => {
      state.criteria = state.criteria.filter((c) => c.id !== action.payload);
    },
    setCriteria: (state, action: PayloadAction<FilterCriteria[]>) => {
      state.criteria = action.payload;
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
        expiryDate?: string | null;
        criteriaToAdd?: Omit<FilterCriteria, "id">[];
      }>
    ) => {
      const {
        filterName,
        queryViewName,
        description,
        expiryDate,
        criteriaToAdd,
      } = action.payload;

      if (filterName !== undefined) state.filterName = filterName;
      if (queryViewName !== undefined) state.queryViewName = queryViewName;
      if (description !== undefined) state.description = description;
      if (expiryDate !== undefined) state.expiryDate = expiryDate;

      if (criteriaToAdd && criteriaToAdd.length > 0) {
        const newCriteria = criteriaToAdd.map((criteria) => ({
          ...ensureSerializable(criteria),
          id:
            Date.now().toString() +
            "-" +
            Math.random().toString(36).substring(2, 9),
        }));

        // Replace existing criteria of the same type or add new ones
        const updatedCriteria = [...state.criteria];

        newCriteria.forEach((newC) => {
          const existingIndex = updatedCriteria.findIndex(
            (c) => c.type === newC.type
          );
          if (existingIndex >= 0) {
            updatedCriteria[existingIndex] = newC;
          } else {
            updatedCriteria.push(newC);
          }
        });

        state.criteria = updatedCriteria;
      }
    },
  },
  extraReducers: (builder) => {
    // Handle date serialization
    builder.addCase(setExpiryDate, (state, action) => {
      state.expiryDate = action.payload ? action.payload.toISOString() : null;
    });

    // Handle filter update with serialization
    builder.addCase(applyFilterUpdate, (state, action) => {
      const {
        filterName,
        queryViewName,
        description,
        expiryDate,
        criteriaToAdd,
      } = action.payload;

      productFilterSlice.caseReducers._applyFilterUpdate(state, {
        type: "_applyFilterUpdate",
        payload: {
          filterName,
          queryViewName,
          description,
          expiryDate: expiryDate ? expiryDate.toISOString() : null,
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
  setIsGenerating,
  setLastGeneratedFilter,
  resetFilter,
} = productFilterSlice.actions;

export default productFilterSlice.reducer;
