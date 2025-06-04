
// DatabaseTypes.ts - Contains specific database-related types

export interface MocktailSuggestion {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  establishment_id: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}
