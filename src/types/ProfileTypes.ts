
export interface Establishment {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  bio?: string;
  description?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  user_type: 'individual' | 'establishment' | 'promoter' | 'admin';
  bio?: string;
  phone?: string;
  avatar_url?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  created_at?: string;
  updated_at?: string;
}
