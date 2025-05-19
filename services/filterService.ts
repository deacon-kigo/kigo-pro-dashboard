// Mock filter service for development

interface Filter {
  id?: string;
  name: string;
  description: string;
  criteria: any[];
  queryViewName?: string;
}

interface APIResponse {
  success: boolean;
  id?: string;
  message?: string;
}

// Mock implementation for saving a filter
const saveFilter = async (filterData: Filter): Promise<APIResponse> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate a random ID for the new filter
  const id = Math.random().toString(36).substring(2, 9);

  console.log("Filter saved:", { ...filterData, id });

  return {
    success: true,
    id,
  };
};

// Mock implementation for updating a filter
const updateFilter = async (
  filterId: string,
  filterData: Filter
): Promise<APIResponse> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Filter updated:", { ...filterData, id: filterId });

  return {
    success: true,
    id: filterId,
  };
};

// Mock implementation for creating a filter
const createFilter = async (filterData: Filter): Promise<APIResponse> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate a random ID for the new filter
  const id = Math.random().toString(36).substring(2, 9);

  console.log("Filter created:", { ...filterData, id });

  return {
    success: true,
    id,
  };
};

// Mock implementation for getting a filter
const getFilter = async (filterId: string): Promise<Filter | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock filter
  return {
    id: filterId,
    name: "Mock Filter",
    description: "This is a mock filter for development",
    criteria: [],
  };
};

// Export all methods
const filterService = {
  saveFilter,
  updateFilter,
  createFilter,
  getFilter,
};

export default filterService;
