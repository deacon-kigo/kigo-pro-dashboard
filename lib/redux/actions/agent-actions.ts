/**
 * Agent Actions for Redux Integration
 *
 * These actions trigger agent workflows and enable agents to control UI state.
 * Agents can dispatch these actions to update forms, navigate, show notifications, etc.
 */

export interface AgentWorkflowPayload {
  agentType: "campaign" | "analytics" | "filter" | "supervisor";
  action: string;
  userInput: any;
  uiContext: any;
}

export interface UIControlPayload {
  componentId?: string;
  data?: any;
  message?: string;
  type?: "success" | "error" | "info" | "warning";
}

export const agentActions = {
  // Trigger agent workflows
  triggerWorkflow: (payload: AgentWorkflowPayload) => ({
    type: "agent/triggerWorkflow",
    payload,
  }),

  // Agent UI control actions
  navigateTo: (path: string) => ({
    type: "agent/navigateTo",
    payload: path,
  }),

  updateForm: (formData: any) => ({
    type: "agent/updateForm",
    payload: formData,
  }),

  showNotification: (payload: UIControlPayload) => ({
    type: "agent/showNotification",
    payload,
  }),

  highlightComponent: (componentId: string) => ({
    type: "agent/highlightComponent",
    payload: componentId,
  }),

  toggleComponent: (componentId: string) => ({
    type: "agent/toggleComponent",
    payload: componentId,
  }),

  showModal: (modalType: string, data?: any) => ({
    type: "agent/showModal",
    payload: { modalType, data },
  }),

  updateCampaignForm: (formData: any) => ({
    type: "agent/updateCampaignForm",
    payload: formData,
  }),

  updateFilters: (filterData: any) => ({
    type: "agent/updateFilters",
    payload: filterData,
  }),

  setLoadingState: (isLoading: boolean, message?: string) => ({
    type: "agent/setLoadingState",
    payload: { isLoading, message },
  }),

  logAgentInteraction: (agentType: string, action: string, result: any) => ({
    type: "agent/logInteraction",
    payload: { agentType, action, result, timestamp: Date.now() },
  }),
};
