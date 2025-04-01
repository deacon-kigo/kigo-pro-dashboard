/**
 * Interface for Redux actions with a type property
 * Used for type-checking middleware
 */
export interface ActionWithType {
  type: string;
  [key: string]: any;
} 