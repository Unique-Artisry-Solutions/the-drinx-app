
// Extend the CustomDatabase interface to include the new tables
interface CustomDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      subscription_settings: {
        Row: {
          id: string;
          user_id: string;
          location_sharing: boolean;
          notification_radius: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location_sharing?: boolean;
          notification_radius?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          location_sharing?: boolean;
          notification_radius?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_notification_schedules: {
        Row: {
          id: string;
          event_id: string;
          title: string;
          content: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          scheduled_for: string;
          location_based: boolean;
          coordinates?: any;
          target_radius?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          content: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          scheduled_for: string;
          location_based?: boolean;
          coordinates?: any;
          target_radius?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          title?: string;
          content?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          scheduled_for?: string;
          location_based?: boolean;
          coordinates?: any;
          target_radius?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    }
  }
}
