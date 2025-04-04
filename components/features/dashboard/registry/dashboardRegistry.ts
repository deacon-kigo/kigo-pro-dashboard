import { ComponentType } from 'react';
import CVSTokenManagementView from '../views/CVSTokenManagementView';
import CVSDashboardView from '../views/CVSDashboardView';
import DeaconsPizzaView from '../views/DeaconsPizzaView';
import GenericDashboardView from '../views/GenericDashboardView';

/**
 * Dashboard registry interface
 * Allows for easy registration and retrieval of dashboard views based on client and scenario
 */
interface DashboardRegistry {
  registerView(clientId: string, scenario: string, component: ComponentType): void;
  getView(clientId?: string, scenario?: string): ComponentType;
}

/**
 * Implementation of the DashboardRegistry interface
 */
class DashboardRegistryImpl implements DashboardRegistry {
  private registry: Record<string, Record<string, ComponentType>> = {};
  private defaultView: ComponentType = GenericDashboardView;
  
  constructor() {
    this.initializeRegistry();
  }
  
  /**
   * Initialize the registry with default views
   */
  private initializeRegistry(): void {
    // CVS views
    this.registerView('cvs', 'support-flow', CVSTokenManagementView);
    this.registerView('cvs', 'dashboard', CVSDashboardView);
    
    // Deacons Pizza views
    this.registerView('deacons', 'dashboard', DeaconsPizzaView);
    this.registerView('deacons', 'campaign-creation', DeaconsPizzaView);
    this.registerView('deacons', 'pizza', DeaconsPizzaView);
    
    // You can add more views here without modifying the DashboardView component
  }
  
  /**
   * Register a view component for a specific client and scenario
   */
  registerView(clientId: string, scenario: string, component: ComponentType): void {
    if (!this.registry[clientId]) {
      this.registry[clientId] = {};
    }
    
    this.registry[clientId][scenario] = component;
    console.log(`Registered view for ${clientId}/${scenario}`);
  }
  
  /**
   * Get the appropriate view component based on client and scenario
   * Falls back to the default view if no matching view is found
   */
  getView(clientId?: string, scenario?: string): ComponentType {
    if (!clientId || !scenario) {
      return this.defaultView;
    }
    
    if (this.registry[clientId]?.[scenario]) {
      console.log(`Found view for ${clientId}/${scenario}`);
      return this.registry[clientId][scenario];
    }
    
    console.log(`No view found for ${clientId}/${scenario}, using default view`);
    return this.defaultView;
  }
  
  /**
   * Set the default view component
   */
  setDefaultView(component: ComponentType): void {
    this.defaultView = component;
    console.log('Set new default view');
  }
}

// Export singleton instance
export const dashboardRegistry = new DashboardRegistryImpl();

// Export type for use in other components
export type { DashboardRegistry }; 