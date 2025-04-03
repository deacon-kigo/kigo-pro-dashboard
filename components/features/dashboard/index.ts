'use client';

// Main dashboard components
export { default as DashboardView } from './DashboardView';
export { default as PersonalizedDashboard } from './PersonalizedDashboard';
export { default as Tasks } from './Tasks';
export { default as UserGreeting } from './UserGreeting';

// Re-export subcomponents from views and charts
export * from './views';
export * from './charts'; 