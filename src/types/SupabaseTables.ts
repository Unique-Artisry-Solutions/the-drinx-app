
// Core establishment type definition
export interface Establishment {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  image_url?: string;
  cocktail_count: number;
  owner_id: string;
  created_at: string;
}

// Additional types for the application
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  is_protected: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}
