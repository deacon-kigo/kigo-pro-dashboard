/**
 * Service for handling external ticketing operations
 */
import { 
  ExternalTicketReference,
  ExternalTicketParams,
  ActionSummary,
  ActivityLog
} from '@/lib/types/ticketing';
import { v4 as uuidv4 } from 'uuid';

// Mock implementation for demo purposes - in a real app, this would call actual APIs
class ExternalTicketingService {
  /**
   * Create a ticket reference from URL parameters
   */
  createTicketReferenceFromParams(params: ExternalTicketParams): ExternalTicketReference {
    // In a real implementation, this would validate the parameters and potentially
    // call an API to get additional information about the ticket
    
    const now = new Date().toISOString();
    
    return {
      id: uuidv4(),
      externalId: params.ticket_id,
      externalSystem: this.validateExternalSystem(params.system),
      externalStatus: 'Open',
      customerId: params.customer_id || '',
      subject: params.subject || 'No subject provided',
      description: params.description || 'No description provided',
      priority: this.validatePriority(params.priority),
      createdAt: params.created_at || now,
      updatedAt: now,
      lastSyncedAt: now,
      externalUrl: params.return_url,
      createdBy: params.created_by || 'External User'
    };
  }
  
  /**
   * Parse URL parameters for external ticket reference
   */
  parseUrlParams(url: string): ExternalTicketParams | null {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const ticket_id = params.get('ticket_id');
      const system = params.get('system');
      const return_url = params.get('return_url');
      
      if (!ticket_id || !system || !return_url) {
        console.error('Missing required parameters: ticket_id, system, or return_url');
        return null;
      }
      
      return {
        ticket_id,
        system,
        customer_id: params.get('customer_id') || undefined,
        subject: params.get('subject') || undefined,
        description: params.get('description') || undefined,
        priority: params.get('priority') || undefined,
        created_at: params.get('created_at') || undefined,
        created_by: params.get('created_by') || undefined,
        return_url
      };
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
      return null;
    }
  }
  
  /**
   * Synchronize activities back to the external system
   */
  async syncActivitiesToExternalSystem(
    externalTicketId: string,
    system: string,
    activities: ActivityLog[],
    returnUrl: string
  ): Promise<boolean> {
    // In a real implementation, this would call the external system's API
    // to update the ticket with the activities performed in Kigo Pro
    
    console.log(`Syncing ${activities.length} activities to ${system} ticket ${externalTicketId}`);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful sync
      return true;
    } catch (error) {
      console.error('Error syncing activities to external system:', error);
      return false;
    }
  }
  
  /**
   * Generate a return URL with action summary data
   */
  generateReturnUrl(returnUrl: string, summary: ActionSummary): string {
    try {
      const url = new URL(returnUrl);
      
      // Add summary data as URL parameters
      url.searchParams.append('action_count', summary.activities.length.toString());
      url.searchParams.append('status', summary.status);
      url.searchParams.append('summary', encodeURIComponent(summary.summary));
      
      if (summary.resolution) {
        url.searchParams.append('resolution', encodeURIComponent(summary.resolution));
      }
      
      return url.toString();
    } catch (error) {
      console.error('Error generating return URL:', error);
      return returnUrl;
    }
  }
  
  /**
   * Create a summary of activities for syncing back to external system
   */
  createActionSummary(activities: ActivityLog[], customMessage?: string): ActionSummary {
    const actionsByType = activities.reduce((acc, activity) => {
      acc[activity.actionType] = (acc[activity.actionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Generate summary text
    let summaryText = 'Actions performed in Kigo Pro: ';
    
    const actionDescriptions = Object.entries(actionsByType).map(([type, count]) => {
      const actionName = this.getActionTypeDisplayName(type);
      return `${count} ${actionName}${count > 1 ? 's' : ''}`;
    });
    
    summaryText += actionDescriptions.join(', ');
    
    if (customMessage) {
      summaryText += `\n\nAdditional notes: ${customMessage}`;
    }
    
    return {
      ticketId: activities[0]?.externalTicketId || '',
      activities,
      summary: summaryText,
      status: 'Completed'
    };
  }
  
  // Helper methods
  private validateExternalSystem(system: string): any {
    const validSystems = ['ServiceNow', 'Zendesk', 'Salesforce', 'Jira', 'Custom'];
    return validSystems.includes(system) ? system : 'Custom';
  }
  
  private validatePriority(priority?: string): 'Low' | 'Medium' | 'High' {
    if (!priority) return 'Medium';
    
    switch (priority.toLowerCase()) {
      case 'low': return 'Low';
      case 'high': return 'High';
      default: return 'Medium';
    }
  }
  
  private getActionTypeDisplayName(actionType: string): string {
    switch (actionType) {
      case 'ADD_TOKEN': return 'Token Addition';
      case 'REMOVE_TOKEN': return 'Token Removal';
      case 'REISSUE_TOKEN': return 'Token Reissue';
      case 'DISPUTE_TOKEN': return 'Token Dispute';
      case 'UPDATE_TOKEN': return 'Token Update';
      case 'VIEW_TOKEN': return 'Token View';
      default: return 'Action';
    }
  }
}

export default new ExternalTicketingService(); 