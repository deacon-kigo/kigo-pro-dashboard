/**
 * Types for the lightweight external ticketing integration
 */

// External ticketing systems we support integration with
export type ExternalTicketingSystem = 'ServiceNow' | 'Zendesk' | 'Salesforce' | 'Jira' | 'Custom';

// Status of an external ticket
export type ExternalTicketStatus = 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';

// Sync status for activities
export type ActivitySyncStatus = 'Pending' | 'Synced' | 'Failed';

// Types of token actions that can be performed
export type TokenActionType = 
  | 'ADD_TOKEN' 
  | 'REMOVE_TOKEN' 
  | 'REISSUE_TOKEN' 
  | 'DISPUTE_TOKEN' 
  | 'UPDATE_TOKEN' 
  | 'VIEW_TOKEN'
  | 'OTHER';

// External ticket reference - minimal information about an external ticket
export interface ExternalTicketReference {
  id: string;                   // Internal ID
  externalId: string;           // External system's ticket ID (e.g., ServiceNow ticket ID)
  externalSystem: ExternalTicketingSystem;
  externalStatus: ExternalTicketStatus;
  customerId: string;           // Reference to customer in Kigo Pro
  subject: string;              // Ticket subject from external system
  description: string;          // Issue description
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;            // When ticket was created in external system
  updatedAt: string;            // When ticket was last updated in external system
  lastSyncedAt: string;         // Last time data was synced
  externalUrl: string;          // Deep link back to external ticket
  createdBy: string;            // User who created the ticket in the external system
}

// Activity log entry - records a token action performed for a ticket
export interface ActivityLog {
  id: string;
  externalTicketId: string;      // Reference to external ticket
  customerId: string;            // Reference to customer
  actionType: TokenActionType;   // Type of token action
  tokenId: string;               // Reference to affected token
  beforeState?: any;             // Token state before action (if applicable)
  afterState?: any;              // Token state after action (if applicable)
  notes: string;                 // Agent notes about the action
  performedBy: string;           // Agent who performed the action
  performedAt: string;           // When the action was performed
  syncStatus: ActivitySyncStatus; // Status of synchronization back to external system
}

// Params passed from external system to Kigo Pro
export interface ExternalTicketParams {
  ticket_id: string;             // External ticket ID
  system: string;                // External system name
  customer_id?: string;          // Optional customer ID if known
  subject?: string;              // Ticket subject
  description?: string;          // Ticket description
  priority?: string;             // Ticket priority
  created_at?: string;           // Creation timestamp
  created_by?: string;           // Creator name/ID
  return_url: string;            // URL to return to after completing actions
}

// Summary of actions to return to external system
export interface ActionSummary {
  ticketId: string;              // External ticket ID
  activities: ActivityLog[];     // Activities performed
  summary: string;               // Overall summary text
  resolution?: string;           // Resolution details if issue is resolved
  status: 'Completed' | 'In Progress' | 'Needs Additional Action';
} 