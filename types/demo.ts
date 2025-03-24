/**
 * Demo System Types
 */

export interface UserProfile {
  name: string;
  role: string;
  businessName: string;
  avatar: string;
  technicalProficiency: 'low' | 'moderate' | 'high' | 'very high' | 'expert';
  goals?: string[];
  painPoints?: string[];
}

export interface DemoInstance {
  id: string;
  title: string;
  description: string;
  role: string;
  clientId: string;
  scenario: string;
  category?: string;
  emoji?: string;
  themeMode?: 'light' | 'dark';
  tags?: string[];
  userProfile?: UserProfile;
}

export interface DemoState {
  role: string;
  clientId: string;
  clientName?: string;
  scenario: string;
  themeMode: 'light' | 'dark';
  userProfile?: any; // Make compatible with both types
}

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

// Client configuration
export interface ClientConfig {
  id: string;
  name: string;
  logo: string;
  themes: {
    light: ThemeColors;
    dark: ThemeColors;
  }
}

// Role configuration
export interface RoleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Scenario configuration
export interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  availableFor: string[]; // roles that can access this scenario
} 