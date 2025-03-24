// Define Theme interface locally instead of importing it
export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
}

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

export interface VersionConfig {
  name: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

interface DemoConfigsType {
  scenarios: Record<string, ScenarioConfig>;
  clients: Record<string, ClientConfig>;
  versions: Record<string, VersionConfig>;
  getThemeForClient: (clientId: string) => Theme;
}

const demoConfigs: DemoConfigsType = {
  scenarios: {
    'default': {
      title: 'Default Dashboard',
      description: 'General dashboard view'
    },
    'dashboard': {
      title: 'Personalized Dashboard',
      description: 'Dynamic dashboard with personalized content',
      initialStep: 'dashboard'
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
  
  versions: {
    'current': {
      name: 'Current Release',
      description: 'Features currently implemented in production',
      badge: 'PRODUCTION',
      badgeColor: '#10b981' // emerald-500
    },
    'upcoming': {
      name: 'Next Release',
      description: 'Features planned for the next release cycle',
      badge: 'UPCOMING',
      badgeColor: '#3b82f6' // blue-500
    },
    'future': {
      name: 'Future Roadmap',
      description: 'Long-term vision and planned features',
      badge: 'FUTURE',
      badgeColor: '#8b5cf6' // purple-500
    },
    'experimental': {
      name: 'Experimental',
      description: 'Experimental concepts and designs for feedback',
      badge: 'EXPERIMENTAL',
      badgeColor: '#f59e0b' // amber-500
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