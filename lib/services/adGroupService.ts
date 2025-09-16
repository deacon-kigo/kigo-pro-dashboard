// Mock service for ad group operations
export interface AdGroupData {
  name: string;
  description: string;
  selectedAds: string[];
  selectedPrograms: string[];
  merchantIds: string[];
}

export interface AdGroupCreationResult {
  success: boolean;
  adGroupId?: string;
  error?: string;
}

export interface ProgramAssignmentResult {
  success: boolean;
  assignedPrograms?: number;
  error?: string;
}

// Mock API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adGroupService = {
  // Create ad group
  async createAdGroup(data: AdGroupData): Promise<AdGroupCreationResult> {
    // Simulate API call
    await delay(1500);

    // Mock success (95% success rate)
    if (Math.random() > 0.05) {
      const adGroupId = `ag_${Date.now()}`;
      return {
        success: true,
        adGroupId,
      };
    } else {
      return {
        success: false,
        error: "Failed to create ad group. Please try again.",
      };
    }
  },

  // Assign to programs
  async assignToPrograms(
    adGroupId: string,
    programIds: string[]
  ): Promise<ProgramAssignmentResult> {
    // Simulate API call
    await delay(1000);

    // Mock success (98% success rate)
    if (Math.random() > 0.02) {
      return {
        success: true,
        assignedPrograms: programIds.length,
      };
    } else {
      return {
        success: false,
        error: "Failed to assign ad group to programs. Please try again.",
      };
    }
  },

  // Publish ad group
  async publishAdGroup(
    adGroupId: string
  ): Promise<{ success: boolean; error?: string }> {
    // Simulate API call
    await delay(800);

    // Mock success (99% success rate)
    if (Math.random() > 0.01) {
      return { success: true };
    } else {
      return {
        success: false,
        error: "Failed to publish ad group. Please try again.",
      };
    }
  },

  // Get ad group details
  async getAdGroup(adGroupId: string) {
    await delay(500);

    return {
      id: adGroupId,
      name: "Sample Ad Group",
      description: "Sample description",
      status: "draft" as const,
      adsCount: 5,
      merchantsCount: 2,
      programsCount: 3,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
  },
};
