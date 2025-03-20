import { Theme } from '../contexts/DemoContext';

export interface ScenarioConfig {
  title: string;
  description: string;
  initialStep?: string;
}

export interface ClientConfig {
  name: string;
  industry: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

interface DemoConfigsType {
  scenarios: Record<string, ScenarioConfig>;
  clients: Record<string, ClientConfig>;
  getThemeForClient: (clientId: string) => Theme;
}

const demoConfigs: DemoConfigsType = {
  scenarios: {
    'default': {
      title: 'Default Dashboard',
      description: 'General dashboard view'
    },
    'campaign-creation': {
      title: 'AI Campaign Creation',
      description: 'Create a new campaign with AI assistance',
      initialStep: 'ai-intro'
    },
    'support-flow': {
      title: 'Customer Support',
      description: 'Manage customer token issues',
      initialStep: 'account-lookup'
    }
  },
  
  clients: {
    'deacons-pizza': {
      name: 'Deacon\'s Pizza',
      industry: 'Restaurant',
      logo: '/logos/deacons-pizza.png',
      primaryColor: '#D13B40',
      secondaryColor: '#2C8C3C'
    },
    'cvs': {
      name: 'CVS Pharmacy',
      industry: 'Pharmacy',
      logo: '/logos/cvs.png',
      primaryColor: '#CC0000',
      secondaryColor: '#0000AA'
    },
    'generic': {
      name: 'Generic Merchant',
      industry: 'Retail',
      logo: '/logos/generic.png',
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6'
    }
  },
  
  getThemeForClient(clientId: string): Theme {
    const client = this.clients[clientId as keyof typeof this.clients];
    if (client) {
      return {
        primaryColor: client.primaryColor,
        secondaryColor: client.secondaryColor,
        logo: client.logo
      };
    }
    
    // Default theme
    return {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      logo: '/logos/generic.png'
    };
  }
};

export default demoConfigs; 