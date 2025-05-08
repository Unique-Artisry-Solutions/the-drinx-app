export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_model_parameters: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          model_name: string
          parameter_name: string
          parameter_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          model_name: string
          parameter_name: string
          parameter_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          model_name?: string
          parameter_name?: string
          parameter_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      analytics_daily_rollup: {
        Row: {
          date: string
          event_count: number
          event_type: string
          id: string
          unique_users: number
        }
        Insert: {
          date: string
          event_count?: number
          event_type: string
          id?: string
          unique_users?: number
        }
        Update: {
          date?: string
          event_count?: number
          event_type?: string
          id?: string
          unique_users?: number
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          page_url: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_monthly_rollup: {
        Row: {
          event_count: number
          event_type: string
          id: string
          month: number
          unique_users: number
          year: number
        }
        Insert: {
          event_count?: number
          event_type: string
          id?: string
          month: number
          unique_users?: number
          year: number
        }
        Update: {
          event_count?: number
          event_type?: string
          id?: string
          month?: number
          unique_users?: number
          year?: number
        }
        Relationships: []
      }
      analytics_weekly_rollup: {
        Row: {
          event_count: number
          event_type: string
          id: string
          unique_users: number
          week: number
          year: number
        }
        Insert: {
          event_count?: number
          event_type: string
          id?: string
          unique_users?: number
          week: number
          year: number
        }
        Update: {
          event_count?: number
          event_type?: string
          id?: string
          unique_users?: number
          week?: number
          year?: number
        }
        Relationships: []
      }
      api_key_configurations: {
        Row: {
          api_key_name: string
          created_at: string
          id: string
          is_active: boolean
          last_verified_at: string | null
          metadata: Json | null
          service_name: string
          updated_at: string
        }
        Insert: {
          api_key_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_verified_at?: string | null
          metadata?: Json | null
          service_name: string
          updated_at?: string
        }
        Update: {
          api_key_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_verified_at?: string | null
          metadata?: Json | null
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      audience_segment_analytics: {
        Row: {
          campaign_id: string | null
          conversion_rate: number | null
          created_at: string
          date: string
          engagement_rate: number | null
          id: string
          segment_id: string
          total_members: number
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          id?: string
          segment_id: string
          total_members?: number
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          id?: string
          segment_id?: string
          total_members?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audience_segment_analytics_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "audience_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      audience_segment_criteria: {
        Row: {
          created_at: string
          criteria_type: string
          criteria_value: Json
          id: string
          operator: string
          segment_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria_type: string
          criteria_value: Json
          id?: string
          operator: string
          segment_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria_type?: string
          criteria_value?: Json
          id?: string
          operator?: string
          segment_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audience_segment_criteria_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "audience_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      audience_segment_memberships: {
        Row: {
          added_at: string
          id: string
          is_active: boolean
          score: number | null
          segment_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          is_active?: boolean
          score?: number | null
          segment_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          is_active?: boolean
          score?: number | null
          segment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audience_segment_memberships_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "audience_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      audience_segments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      bar_crawl_check_ins: {
        Row: {
          bar_crawl_id: string
          checked_in_at: string
          establishment_id: string
          id: string
          user_id: string
          verified_by: string | null
        }
        Insert: {
          bar_crawl_id: string
          checked_in_at?: string
          establishment_id: string
          id?: string
          user_id: string
          verified_by?: string | null
        }
        Update: {
          bar_crawl_id?: string
          checked_in_at?: string
          establishment_id?: string
          id?: string
          user_id?: string
          verified_by?: string | null
        }
        Relationships: []
      }
      bar_crawl_establishments: {
        Row: {
          bar_crawl_id: string
          created_at: string | null
          establishment_id: string
          id: string
          order_position: number
          status: string | null
        }
        Insert: {
          bar_crawl_id: string
          created_at?: string | null
          establishment_id: string
          id?: string
          order_position: number
          status?: string | null
        }
        Update: {
          bar_crawl_id?: string
          created_at?: string | null
          establishment_id?: string
          id?: string
          order_position?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bar_crawl_establishments_bar_crawl_id_fkey"
            columns: ["bar_crawl_id"]
            isOneToOne: false
            referencedRelation: "bar_crawls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bar_crawl_establishments_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      bar_crawl_marketing_materials: {
        Row: {
          bar_crawl_id: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          material_type: string
          promoter_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          bar_crawl_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          material_type: string
          promoter_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          bar_crawl_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          material_type?: string
          promoter_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bar_crawl_marketing_materials_bar_crawl_id_fkey"
            columns: ["bar_crawl_id"]
            isOneToOne: false
            referencedRelation: "bar_crawls"
            referencedColumns: ["id"]
          },
        ]
      }
      bar_crawl_themes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      bar_crawls: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          organizer_id: string
          start_date: string | null
          status: string | null
          theme_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          organizer_id: string
          start_date?: string | null
          status?: string | null
          theme_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          organizer_id?: string
          start_date?: string | null
          status?: string | null
          theme_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bar_crawls_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "bar_crawl_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_segment_mappings: {
        Row: {
          allocation_percentage: number
          campaign_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_control_group: boolean
          metrics: Json | null
          segment_id: string
          updated_at: string
        }
        Insert: {
          allocation_percentage?: number
          campaign_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_control_group?: boolean
          metrics?: Json | null
          segment_id: string
          updated_at?: string
        }
        Update: {
          allocation_percentage?: number
          campaign_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_control_group?: boolean
          metrics?: Json | null
          segment_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_segment_performance: {
        Row: {
          campaign_id: string
          clicks: number
          conversion_value: number | null
          conversions: number
          created_at: string
          date: string
          id: string
          impressions: number
          segment_id: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          clicks?: number
          conversion_value?: number | null
          conversions?: number
          created_at?: string
          date?: string
          id?: string
          impressions?: number
          segment_id: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          clicks?: number
          conversion_value?: number | null
          conversions?: number
          created_at?: string
          date?: string
          id?: string
          impressions?: number
          segment_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      cocktail_reviews: {
        Row: {
          cocktail_id: string
          content_status: string
          created_at: string
          id: string
          rating: number
          source: string
          text: string
          user_id: string
        }
        Insert: {
          cocktail_id: string
          content_status?: string
          created_at?: string
          id?: string
          rating: number
          source?: string
          text: string
          user_id: string
        }
        Update: {
          cocktail_id?: string
          content_status?: string
          created_at?: string
          id?: string
          rating?: number
          source?: string
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      cocktails: {
        Row: {
          created_at: string
          description: string
          establishment_id: string
          id: string
          image_url: string | null
          ingredients: Json | null
          name: string
          price: string
        }
        Insert: {
          created_at?: string
          description: string
          establishment_id: string
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          name: string
          price: string
        }
        Update: {
          created_at?: string
          description?: string
          establishment_id?: string
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          name?: string
          price?: string
        }
        Relationships: [
          {
            foreignKeyName: "cocktails_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      content_flags: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          details: string | null
          id: string
          reason: string
          reporter_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          details?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string
          created_at: string
          id: string
          is_active: boolean
          last_updated_by: string | null
          name: string
          subject: string
          updated_at: string
          variables: string[]
        }
        Insert: {
          body_html: string
          body_text: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_updated_by?: string | null
          name: string
          subject: string
          updated_at?: string
          variables?: string[]
        }
        Update: {
          body_html?: string
          body_text?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_updated_by?: string | null
          name?: string
          subject?: string
          updated_at?: string
          variables?: string[]
        }
        Relationships: []
      }
      establishment_ai_customizations: {
        Row: {
          created_at: string
          establishment_id: string
          id: string
          preference_key: string
          preference_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          establishment_id: string
          id?: string
          preference_key: string
          preference_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          establishment_id?: string
          id?: string
          preference_key?: string
          preference_value?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "establishment_ai_customizations_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_analytics: {
        Row: {
          average_rating: number | null
          created_at: string
          date: string
          establishment_id: string
          id: string
          returning_visitors: number | null
          total_revenue: number | null
          total_visitors: number | null
          unique_visitors: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          created_at?: string
          date: string
          establishment_id: string
          id?: string
          returning_visitors?: number | null
          total_revenue?: number | null
          total_visitors?: number | null
          unique_visitors?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          created_at?: string
          date?: string
          establishment_id?: string
          id?: string
          returning_visitors?: number | null
          total_revenue?: number | null
          total_visitors?: number | null
          unique_visitors?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "establishment_analytics_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_promotions: {
        Row: {
          code: string
          created_at: string
          description: string
          discount_type: string
          discount_value: number | null
          end_date: string | null
          establishment_id: string
          id: string
          is_active: boolean
          max_discount: number | null
          min_purchase: number | null
          start_date: string
          updated_at: string
          usage_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          discount_type: string
          discount_value?: number | null
          end_date?: string | null
          establishment_id: string
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_purchase?: number | null
          start_date?: string
          updated_at?: string
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          discount_type?: string
          discount_value?: number | null
          end_date?: string | null
          establishment_id?: string
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_purchase?: number | null
          start_date?: string
          updated_at?: string
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "establishment_promotions_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          address: string
          cocktail_count: number | null
          created_at: string | null
          hours: Json | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          owner_id: string | null
          phone: string | null
          website: string | null
        }
        Insert: {
          address: string
          cocktail_count?: number | null
          created_at?: string | null
          hours?: Json | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          owner_id?: string | null
          phone?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          cocktail_count?: number | null
          created_at?: string | null
          hours?: Json | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          owner_id?: string | null
          phone?: string | null
          website?: string | null
        }
        Relationships: []
      }
      event_access_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          event_id: string
          expires_at: string | null
          id: string
          is_active: boolean
          last_used_at: string | null
          token: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          token: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_access_tokens_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_access_tokens_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_access_tokens_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_analytics: {
        Row: {
          created_at: string
          date: string
          event_id: string
          id: string
          page_views: number | null
          referral_sources: Json | null
          revenue: number | null
          social_shares: number | null
          ticket_sales: number | null
          ticket_views: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          event_id: string
          id?: string
          page_views?: number | null
          referral_sources?: Json | null
          revenue?: number | null
          social_shares?: number | null
          ticket_sales?: number | null
          ticket_views?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          event_id?: string
          id?: string
          page_views?: number | null
          referral_sources?: Json | null
          revenue?: number | null
          social_shares?: number | null
          ticket_sales?: number | null
          ticket_views?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          checked_in_at: string | null
          created_at: string
          custom_fields: Json | null
          email: string | null
          event_id: string
          id: string
          name: string | null
          notes: string | null
          purchase_date: string
          status: string
          ticket_code: string | null
          ticket_type_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          event_id: string
          id?: string
          name?: string | null
          notes?: string | null
          purchase_date?: string
          status?: string
          ticket_code?: string | null
          ticket_type_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          event_id?: string
          id?: string
          name?: string | null
          notes?: string | null
          purchase_date?: string
          status?: string
          ticket_code?: string | null
          ticket_type_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_attendees_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "event_ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      event_check_ins: {
        Row: {
          attendee_id: string
          checked_in_at: string
          checked_in_by: string | null
          created_at: string
          event_id: string
          id: string
          location: string | null
          notes: string | null
        }
        Insert: {
          attendee_id: string
          checked_in_at?: string
          checked_in_by?: string | null
          created_at?: string
          event_id: string
          id?: string
          location?: string | null
          notes?: string | null
        }
        Update: {
          attendee_id?: string
          checked_in_at?: string
          checked_in_by?: string | null
          created_at?: string
          event_id?: string
          id?: string
          location?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_check_ins_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "event_attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_check_ins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_check_ins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_check_ins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_custom_fields: {
        Row: {
          created_at: string
          display_order: number | null
          event_id: string
          field_name: string
          field_type: string
          field_value: Json | null
          id: string
          is_required: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          event_id: string
          field_name: string
          field_type: string
          field_value?: Json | null
          id?: string
          is_required?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          event_id?: string
          field_name?: string
          field_type?: string
          field_value?: Json | null
          id?: string
          is_required?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_custom_fields_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_custom_fields_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_custom_fields_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_discount_codes: {
        Row: {
          applicable_ticket_types: string[] | null
          code: string
          created_at: string
          description: string | null
          discount_amount: number
          discount_type: string
          event_id: string
          expires_at: string | null
          id: string
          is_active: boolean
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          applicable_ticket_types?: string[] | null
          code: string
          created_at?: string
          description?: string | null
          discount_amount: number
          discount_type: string
          event_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          applicable_ticket_types?: string[] | null
          code?: string
          created_at?: string
          description?: string | null
          discount_amount?: number
          discount_type?: string
          event_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_discount_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_discount_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_discount_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_discount_redemptions: {
        Row: {
          discount_code_id: string
          discount_value: number
          id: string
          metadata: Json | null
          order_value: number
          redemption_date: string
          ticket_type_id: string | null
          user_id: string | null
        }
        Insert: {
          discount_code_id: string
          discount_value?: number
          id?: string
          metadata?: Json | null
          order_value?: number
          redemption_date?: string
          ticket_type_id?: string | null
          user_id?: string | null
        }
        Update: {
          discount_code_id?: string
          discount_value?: number
          id?: string
          metadata?: Json | null
          order_value?: number
          redemption_date?: string
          ticket_type_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_discount_redemptions_discount_code_id_fkey"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "event_discount_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_discount_redemptions_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "event_ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      event_marketing_campaigns: {
        Row: {
          budget: number | null
          campaign_type: string
          created_at: string
          description: string | null
          end_date: string | null
          event_id: string
          id: string
          metrics: Json | null
          name: string
          start_date: string | null
          status: string
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          campaign_type: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_id: string
          id?: string
          metrics?: Json | null
          name: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          campaign_type?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_id?: string
          id?: string
          metrics?: Json | null
          name?: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_marketing_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_marketing_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_marketing_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_notification_schedules: {
        Row: {
          content: string
          coordinates: Json | null
          created_at: string
          event_id: string
          id: string
          location_based: boolean
          priority: Database["public"]["Enums"]["notification_priority"]
          scheduled_for: string
          target_radius: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          coordinates?: Json | null
          created_at?: string
          event_id: string
          id?: string
          location_based?: boolean
          priority?: Database["public"]["Enums"]["notification_priority"]
          scheduled_for: string
          target_radius?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          coordinates?: Json | null
          created_at?: string
          event_id?: string
          id?: string
          location_based?: boolean
          priority?: Database["public"]["Enums"]["notification_priority"]
          scheduled_for?: string
          target_radius?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_notification_schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_notification_schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_notification_schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_ticket_types: {
        Row: {
          created_at: string | null
          description: string
          event_id: string | null
          id: string
          name: string
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string | null
          description: string
          event_id?: string | null
          id?: string
          name: string
          price: number
          quantity: number
        }
        Update: {
          created_at?: string | null
          description?: string
          event_id?: string | null
          id?: string
          name?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          contact_info: Json | null
          created_at: string | null
          created_by: string
          custom_settings: Json | null
          date: string
          description: string | null
          event_type: string | null
          event_url: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          location_details: Json | null
          name: string
          promotional_materials: string[] | null
          status: Database["public"]["Enums"]["event_status"] | null
          time: string
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          capacity?: number | null
          contact_info?: Json | null
          created_at?: string | null
          created_by: string
          custom_settings?: Json | null
          date: string
          description?: string | null
          event_type?: string | null
          event_url?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location_details?: Json | null
          name: string
          promotional_materials?: string[] | null
          status?: Database["public"]["Enums"]["event_status"] | null
          time: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          capacity?: number | null
          contact_info?: Json | null
          created_at?: string | null
          created_by?: string
          custom_settings?: Json | null
          date?: string
          description?: string | null
          event_type?: string | null
          event_url?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location_details?: Json | null
          name?: string
          promotional_materials?: string[] | null
          status?: Database["public"]["Enums"]["event_status"] | null
          time?: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          establishment_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          establishment_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          establishment_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          percentage_rollout: number | null
          segment_id: string | null
          status: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          percentage_rollout?: number | null
          segment_id?: string | null
          status?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          percentage_rollout?: number | null
          segment_id?: string | null
          status?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "feature_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feature_segment"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "feature_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_metrics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          feature_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          feature_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          feature_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feature_segment_mappings: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          segment_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          segment_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_segment_mappings_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "feature_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_segments: {
        Row: {
          created_at: string
          criteria: Json
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria?: Json
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      ingredient_pairing_scores: {
        Row: {
          complementary_notes: string | null
          created_at: string
          id: string
          ingredient1: string
          ingredient2: string
          pairing_score: number
        }
        Insert: {
          complementary_notes?: string | null
          created_at?: string
          id?: string
          ingredient1: string
          ingredient2: string
          pairing_score: number
        }
        Update: {
          complementary_notes?: string | null
          created_at?: string
          id?: string
          ingredient1?: string
          ingredient2?: string
          pairing_score?: number
        }
        Relationships: []
      }
      message_read_status: {
        Row: {
          id: string
          last_read_at: string
          thread_id: string
          user_id: string
        }
        Insert: {
          id?: string
          last_read_at?: string
          thread_id: string
          user_id: string
        }
        Update: {
          id?: string
          last_read_at?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_read_status_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "promoter_venue_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      mocktail_suggestions: {
        Row: {
          created_at: string
          description: string | null
          establishment_id: string
          feedback: string | null
          id: string
          ingredients: Json
          instructions: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          establishment_id: string
          feedback?: string | null
          id?: string
          ingredients: Json
          instructions: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          establishment_id?: string
          feedback?: string | null
          id?: string
          ingredients?: Json
          instructions?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mocktail_suggestions_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      mocktail_trends: {
        Row: {
          created_at: string
          id: string
          ingredient_name: string
          is_rising: boolean
          month: number
          season: string
          trend_score: number
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_name: string
          is_rising?: boolean
          month: number
          season: string
          trend_score?: number
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_name?: string
          is_rising?: boolean
          month?: number
          season?: string
          trend_score?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      moderation_actions: {
        Row: {
          action: string
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          moderator_id: string | null
          reason: string | null
        }
        Insert: {
          action: string
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          reason?: string | null
        }
        Update: {
          action?: string
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          reason?: string | null
        }
        Relationships: []
      }
      moderation_notifications: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          recipient_id: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          recipient_id?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          recipient_id?: string | null
        }
        Relationships: []
      }
      moderation_photos: {
        Row: {
          content_status: string
          content_type: string
          created_at: string
          id: string
          moderated_at: string | null
          moderated_by: string | null
          rejection_reason: string | null
          source_id: string
          source_table: string
          url: string
          user_id: string
        }
        Insert: {
          content_status?: string
          content_type?: string
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          rejection_reason?: string | null
          source_id: string
          source_table: string
          url: string
          user_id: string
        }
        Update: {
          content_status?: string
          content_type?: string
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          rejection_reason?: string | null
          source_id?: string
          source_table?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_delivery_logs: {
        Row: {
          created_at: string | null
          delivery_type: string
          error_message: string | null
          id: string
          notification_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          delivery_type: string
          error_message?: string | null
          id?: string
          notification_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          delivery_type?: string
          error_message?: string | null
          id?: string
          notification_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_delivery_logs_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_delivery_status: {
        Row: {
          channel: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          notification_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          channel: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          channel?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_delivery_status_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          category_id: string
          channels: Database["public"]["Enums"]["notification_channel"][]
          created_at: string
          id: string
          is_enabled: boolean
          metadata: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id: string
          channels?: Database["public"]["Enums"]["notification_channel"][]
          created_at?: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string
          channels?: Database["public"]["Enums"]["notification_channel"][]
          created_at?: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "notification_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category_id: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean
          metadata: Json | null
          priority: Database["public"]["Enums"]["notification_priority"]
          recipient_id: string
          recipient_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          recipient_id: string
          recipient_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          recipient_id?: string
          recipient_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "notification_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateway_configs: {
        Row: {
          configuration: Json
          created_at: string
          gateway_name: string
          id: string
          is_active: boolean
          test_mode: boolean
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          gateway_name: string
          id?: string
          is_active?: boolean
          test_mode?: boolean
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          gateway_name?: string
          id?: string
          is_active?: boolean
          test_mode?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email_notifications: boolean | null
          id: string
          phone: string | null
          push_notifications: boolean | null
          updated_at: string | null
          user_type: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email_notifications?: boolean | null
          id: string
          phone?: string | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_type: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          phone?: string | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_type?: string
          username?: string | null
        }
        Relationships: []
      }
      promoter_audience_metrics: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_value: number
          period_end: string | null
          period_start: string | null
          promoter_id: string
          segment: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_value: number
          period_end?: string | null
          period_start?: string | null
          promoter_id: string
          segment: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: number
          period_end?: string | null
          period_start?: string | null
          promoter_id?: string
          segment?: string
        }
        Relationships: []
      }
      promoter_audience_trends: {
        Row: {
          created_at: string
          date: string
          id: string
          metric_name: string
          metric_value: number
          promoter_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          metric_name: string
          metric_value: number
          promoter_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metric_name?: string
          metric_value?: number
          promoter_id?: string
        }
        Relationships: []
      }
      promoter_campaign_analytics: {
        Row: {
          campaign_id: string | null
          campaign_name: string
          clicks: number
          conversions: number
          cost: number
          created_at: string
          date: string
          id: string
          impressions: number
          promoter_id: string
          revenue: number
          source: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          campaign_name: string
          clicks?: number
          conversions?: number
          cost?: number
          created_at?: string
          date: string
          id?: string
          impressions?: number
          promoter_id: string
          revenue?: number
          source: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          campaign_name?: string
          clicks?: number
          conversions?: number
          cost?: number
          created_at?: string
          date?: string
          id?: string
          impressions?: number
          promoter_id?: string
          revenue?: number
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      promoter_event_analytics: {
        Row: {
          attendee_count: number
          created_at: string
          date: string
          engagement_score: number
          event_id: string | null
          id: string
          promoter_id: string
          revenue: number
          ticket_sales: number
          updated_at: string
        }
        Insert: {
          attendee_count?: number
          created_at?: string
          date: string
          engagement_score?: number
          event_id?: string | null
          id?: string
          promoter_id: string
          revenue?: number
          ticket_sales?: number
          updated_at?: string
        }
        Update: {
          attendee_count?: number
          created_at?: string
          date?: string
          engagement_score?: number
          event_id?: string | null
          id?: string
          promoter_id?: string
          revenue?: number
          ticket_sales?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoter_event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "promoter_event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      promoter_notification_preferences: {
        Row: {
          channels: Database["public"]["Enums"]["notification_channel"][]
          created_at: string
          id: string
          is_enabled: boolean
          notification_type_id: string
          promoter_id: string
          updated_at: string
        }
        Insert: {
          channels?: Database["public"]["Enums"]["notification_channel"][]
          created_at?: string
          id?: string
          is_enabled?: boolean
          notification_type_id: string
          promoter_id: string
          updated_at?: string
        }
        Update: {
          channels?: Database["public"]["Enums"]["notification_channel"][]
          created_at?: string
          id?: string
          is_enabled?: boolean
          notification_type_id?: string
          promoter_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoter_notification_preferences_notification_type_id_fkey"
            columns: ["notification_type_id"]
            isOneToOne: false
            referencedRelation: "promoter_notification_types"
            referencedColumns: ["id"]
          },
        ]
      }
      promoter_notification_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      promoter_subscription_tiers: {
        Row: {
          created_at: string
          features: Json
          id: string
          is_active: boolean
          name: string
          price: number
          promoter_id: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          price: number
          promoter_id: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          promoter_id?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      promoter_subscriptions: {
        Row: {
          created_at: string
          id: string
          promoter_id: string
          status: string
          subscriber_id: string
          subscription_end: string | null
          subscription_start: string
          tier_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          promoter_id: string
          status?: string
          subscriber_id: string
          subscription_end?: string | null
          subscription_start?: string
          tier_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          promoter_id?: string
          status?: string
          subscriber_id?: string
          subscription_end?: string | null
          subscription_start?: string
          tier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoter_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "promoter_subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      promoter_venue_messages: {
        Row: {
          content: string
          id: string
          is_from_promoter: boolean
          sender_id: string
          sent_at: string
          thread_id: string
        }
        Insert: {
          content: string
          id?: string
          is_from_promoter: boolean
          sender_id: string
          sent_at?: string
          thread_id: string
        }
        Update: {
          content?: string
          id?: string
          is_from_promoter?: boolean
          sender_id?: string
          sent_at?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoter_venue_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "promoter_venue_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      promoter_venue_threads: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean
          last_message_at: string
          promoter_id: string
          subject: string | null
          updated_at: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean
          last_message_at?: string
          promoter_id: string
          subject?: string | null
          updated_at?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean
          last_message_at?: string
          promoter_id?: string
          subject?: string | null
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoter_venue_threads_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          promotion_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          notification_type: string
          promotion_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          promotion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_notifications_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "establishment_promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_notifications_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotion_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_redemptions: {
        Row: {
          created_at: string
          discount_amount: number
          id: string
          order_amount: number
          order_id: string | null
          promotion_id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discount_amount: number
          id?: string
          order_amount: number
          order_id?: string | null
          promotion_id: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discount_amount?: number
          id?: string
          order_amount?: number
          order_id?: string | null
          promotion_id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_redemptions_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "establishment_promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_redemptions_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotion_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      push_notification_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          device_info: Json | null
          endpoint: string
          id: string
          p256dh: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          device_info?: Json | null
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          device_info?: Json | null
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      revenue_entries: {
        Row: {
          amount: number
          created_at: string
          entry_date: string
          establishment_id: string
          id: string
          notes: string | null
          source: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          entry_date?: string
          establishment_id: string
          id?: string
          notes?: string | null
          source: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          entry_date?: string
          establishment_id?: string
          id?: string
          notes?: string | null
          source?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_entries_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_cache_control: {
        Row: {
          cache_key: string
          expires_at: string | null
          id: string
          is_invalidated: boolean
          last_updated: string
          metadata: Json | null
          ttl_seconds: number
        }
        Insert: {
          cache_key: string
          expires_at?: string | null
          id?: string
          is_invalidated?: boolean
          last_updated?: string
          metadata?: Json | null
          ttl_seconds?: number
        }
        Update: {
          cache_key?: string
          expires_at?: string | null
          id?: string
          is_invalidated?: boolean
          last_updated?: string
          metadata?: Json | null
          ttl_seconds?: number
        }
        Relationships: []
      }
      reward_offerings: {
        Row: {
          created_at: string
          description: string | null
          establishment_id: string
          expiration_days: number | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          points_required: number
          quantity_available: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          establishment_id: string
          expiration_days?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          points_required: number
          quantity_available?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          establishment_id?: string
          expiration_days?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          points_required?: number
          quantity_available?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reward_offerings_establishment"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_offerings_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_performance_metrics: {
        Row: {
          context: Json | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          timestamp: string
        }
        Insert: {
          context?: Json | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          timestamp?: string
        }
        Update: {
          context?: Json | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          timestamp?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          created_at: string
          expires_at: string | null
          fulfilled_at: string | null
          id: string
          offering_id: string
          points_spent: number
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          fulfilled_at?: string | null
          id?: string
          offering_id: string
          points_spent: number
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          fulfilled_at?: string | null
          id?: string
          offering_id?: string
          points_spent?: number
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_redemptions_offering"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "reward_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_redemptions_transaction"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "reward_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "reward_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "reward_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          description: string | null
          establishment_id: string
          event_type: string
          id: string
          is_active: boolean
          name: string
          points: number
          updated_at: string
          version: number
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          establishment_id: string
          event_type: string
          id?: string
          is_active?: boolean
          name: string
          points?: number
          updated_at?: string
          version?: number
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          establishment_id?: string
          event_type?: string
          id?: string
          is_active?: boolean
          name?: string
          points?: number
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "reward_rules_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_system_health: {
        Row: {
          details: Json | null
          error_count: number
          id: string
          response_time_ms: number | null
          status: string
          timestamp: string
          transaction_count: number
        }
        Insert: {
          details?: Json | null
          error_count?: number
          id?: string
          response_time_ms?: number | null
          status: string
          timestamp?: string
          transaction_count?: number
        }
        Update: {
          details?: Json | null
          error_count?: number
          id?: string
          response_time_ms?: number | null
          status?: string
          timestamp?: string
          transaction_count?: number
        }
        Relationships: []
      }
      reward_tiers: {
        Row: {
          benefits: Json
          color: string | null
          created_at: string
          description: string | null
          establishment_id: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          points_required: number
          updated_at: string
        }
        Insert: {
          benefits?: Json
          color?: string | null
          created_at?: string
          description?: string | null
          establishment_id: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          points_required: number
          updated_at?: string
        }
        Update: {
          benefits?: Json
          color?: string | null
          created_at?: string
          description?: string | null
          establishment_id?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          points_required?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reward_tiers_establishment"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_tiers_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_transactions: {
        Row: {
          created_at: string
          description: string | null
          establishment_id: string | null
          id: string
          metadata: Json
          points: number
          source: string
          transaction_type: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          establishment_id?: string | null
          id?: string
          metadata?: Json
          points: number
          source: string
          transaction_type: string
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          establishment_id?: string | null
          id?: string
          metadata?: Json
          points?: number
          source?: string
          transaction_type?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "reward_transactions_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_usage_metrics: {
        Row: {
          created_at: string
          establishment_id: string | null
          id: string
          metadata: Json | null
          metric_date: string
          metric_name: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          establishment_id?: string | null
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_name: string
          metric_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          establishment_id?: string | null
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_name?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_usage_metrics_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_user_activity_patterns: {
        Row: {
          activity_type: string
          first_occurred: string
          frequency: number | null
          id: string
          last_occurred: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          first_occurred?: string
          frequency?: number | null
          id?: string
          last_occurred?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          first_occurred?: string
          frequency?: number | null
          id?: string
          last_occurred?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      streak_settings: {
        Row: {
          created_at: string
          description: string | null
          establishment_id: string | null
          grace_period_hours: number
          id: string
          is_active: boolean
          milestones: number[]
          multipliers: number[]
          name: string
          point_values: number[]
          streak_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          establishment_id?: string | null
          grace_period_hours?: number
          id?: string
          is_active?: boolean
          milestones?: number[]
          multipliers?: number[]
          name: string
          point_values?: number[]
          streak_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          establishment_id?: string | null
          grace_period_hours?: number
          id?: string
          is_active?: boolean
          milestones?: number[]
          multipliers?: number[]
          name?: string
          point_values?: number[]
          streak_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "streak_settings_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_features: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          is_enabled: boolean
          tier_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          is_enabled?: boolean
          tier_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          is_enabled?: boolean
          tier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestion_feedback: {
        Row: {
          comments: string | null
          created_at: string
          establishment_id: string
          id: string
          implementation_feasibility: number
          popularity_potential: number
          quality_score: number
          suggestion_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          establishment_id: string
          id?: string
          implementation_feasibility: number
          popularity_potential: number
          quality_score: number
          suggestion_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          establishment_id?: string
          id?: string
          implementation_feasibility?: number
          popularity_potential?: number
          quality_score?: number
          suggestion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_feedback_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestion_feedback_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "mocktail_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      swig_circuit_drink_highlights: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          swig_circuit_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          swig_circuit_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          swig_circuit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swig_circuit_drink_highlights_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      swig_circuit_pairings: {
        Row: {
          created_at: string | null
          drink: string
          food: string
          id: string
          swig_circuit_id: string | null
        }
        Insert: {
          created_at?: string | null
          drink: string
          food: string
          id?: string
          swig_circuit_id?: string | null
        }
        Update: {
          created_at?: string | null
          drink?: string
          food?: string
          id?: string
          swig_circuit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swig_circuit_pairings_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      swig_circuit_ticket_tiers: {
        Row: {
          benefits: string[]
          created_at: string | null
          description: string
          id: string
          is_vip: boolean | null
          name: string
          price: number
          swig_circuit_id: string | null
          ticket_limit: number | null
          vip_perks: Json | null
        }
        Insert: {
          benefits?: string[]
          created_at?: string | null
          description: string
          id?: string
          is_vip?: boolean | null
          name: string
          price: number
          swig_circuit_id?: string | null
          ticket_limit?: number | null
          vip_perks?: Json | null
        }
        Update: {
          benefits?: string[]
          created_at?: string | null
          description?: string
          id?: string
          is_vip?: boolean | null
          name?: string
          price?: number
          swig_circuit_id?: string | null
          ticket_limit?: number | null
          vip_perks?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "swig_circuit_ticket_tiers_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      swig_circuit_venues: {
        Row: {
          created_at: string | null
          establishment_id: string | null
          id: string
          position: number
          swig_circuit_id: string | null
        }
        Insert: {
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          position: number
          swig_circuit_id?: string | null
        }
        Update: {
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          position?: number
          swig_circuit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swig_circuit_venues_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swig_circuit_venues_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      swig_circuits: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          max_distance: number | null
          name: string
          projected_attendance: number | null
          projected_revenue: number | null
          start_date: string
          theme: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          max_distance?: number | null
          name: string
          projected_attendance?: number | null
          projected_revenue?: number | null
          start_date: string
          theme: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          max_distance?: number | null
          name?: string
          projected_attendance?: number | null
          projected_revenue?: number | null
          start_date?: string
          theme?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_protected: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_protected?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_protected?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      system_settings_audit_log: {
        Row: {
          change_reason: string | null
          changed_at: string
          changed_by: string | null
          id: string
          new_value: Json
          old_value: Json | null
          setting_key: string
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_value: Json
          old_value?: Json | null
          setting_key: string
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_value?: Json
          old_value?: Json | null
          setting_key?: string
        }
        Relationships: []
      }
      trend_data_points: {
        Row: {
          created_at: string
          establishment_id: string
          id: string
          metric_name: string
          metric_value: number
          tags: Json | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          establishment_id: string
          id?: string
          metric_name: string
          metric_value: number
          tags?: Json | null
          timestamp?: string
        }
        Update: {
          created_at?: string
          establishment_id?: string
          id?: string
          metric_name?: string
          metric_value?: number
          tags?: Json | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_data_points_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_streaks: {
        Row: {
          created_at: string
          current_count: number
          establishment_id: string | null
          id: string
          last_activity_date: string
          longest_count: number
          metadata: Json
          streak_start_date: string
          streak_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_count?: number
          establishment_id?: string | null
          id?: string
          last_activity_date?: string
          longest_count?: number
          metadata?: Json
          streak_start_date?: string
          streak_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_count?: number
          establishment_id?: string | null
          id?: string
          last_activity_date?: string
          longest_count?: number
          metadata?: Json
          streak_start_date?: string
          streak_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_streaks_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_bar_crawl_participation: {
        Row: {
          bar_crawl_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          bar_crawl_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          bar_crawl_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bar_crawl_participation_bar_crawl_id_fkey"
            columns: ["bar_crawl_id"]
            isOneToOne: false
            referencedRelation: "bar_crawls"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recipes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          ingredients: Json
          instructions: string
          is_public: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients: Json
          instructions: string
          is_public?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          instructions?: string
          is_public?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reward_preferences: {
        Row: {
          created_at: string
          id: string
          preference_key: string
          preference_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preference_key: string
          preference_value?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preference_key?: string
          preference_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          config: Json
          created_at: string
          current_tier_id: string | null
          establishment_id: string | null
          id: string
          lifetime_points: number
          points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          current_tier_id?: string | null
          establishment_id?: string | null
          id?: string
          lifetime_points?: number
          points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          current_tier_id?: string | null
          establishment_id?: string | null
          id?: string
          lifetime_points?: number
          points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_rewards_current_tier"
            columns: ["current_tier_id"]
            isOneToOne: false
            referencedRelation: "reward_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_rewards_tier"
            columns: ["current_tier_id"]
            isOneToOne: false
            referencedRelation: "reward_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      visitor_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          establishment_id: string
          id: string
          is_returning: boolean | null
          session_end: string | null
          session_start: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          establishment_id: string
          id?: string
          is_returning?: boolean | null
          session_end?: string | null
          session_start?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          establishment_id?: string
          id?: string
          is_returning?: boolean | null
          session_end?: string | null
          session_start?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitor_sessions_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      campaign_segment_analytics: {
        Row: {
          allocation_percentage: number | null
          campaign_id: string | null
          campaign_name: string | null
          campaign_type: string | null
          click_through_rate: number | null
          conversion_rate: number | null
          is_control_group: boolean | null
          segment_id: string | null
          segment_name: string | null
          status: string | null
          total_clicks: number | null
          total_conversion_value: number | null
          total_conversions: number | null
          total_impressions: number | null
        }
        Relationships: []
      }
      cocktail_reviews_with_users: {
        Row: {
          avatar_url: string | null
          cocktail_id: string | null
          created_at: string | null
          id: string | null
          rating: number | null
          source: string | null
          text: string | null
          user_name: string | null
        }
        Relationships: []
      }
      drink_popularity_metrics: {
        Row: {
          average_rating: number | null
          cocktail_id: string | null
          cocktail_name: string | null
          created_at: string | null
          establishment_id: string | null
          month: string | null
          review_count: number | null
          unique_reviewers: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cocktails_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      event_statistics: {
        Row: {
          cancelled_attendees: number | null
          checked_in_attendees: number | null
          date: string | null
          event_id: string | null
          event_name: string | null
          marketing_campaign_count: number | null
          promoter_id: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          total_attendees: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      flagged_content_queue: {
        Row: {
          content_id: string | null
          content_preview: string | null
          content_type: string | null
          details: string | null
          flag_id: string | null
          reason: string | null
          reported_at: string | null
          reporter_id: string | null
          reporter_name: string | null
        }
        Relationships: []
      }
      promoter_audience_segments_view: {
        Row: {
          data_points: number | null
          latest_update: string | null
          metric_name: string | null
          promoter_id: string | null
          segment: string | null
          total_value: number | null
        }
        Relationships: []
      }
      promoter_audience_trends_view: {
        Row: {
          average_value: number | null
          data_points: number | null
          max_value: number | null
          metric_name: string | null
          min_value: number | null
          month: string | null
          promoter_id: string | null
        }
        Relationships: []
      }
      promoter_campaign_performance_view: {
        Row: {
          campaign_id: string | null
          campaign_name: string | null
          click_through_rate: number | null
          conversion_rate: number | null
          end_date: string | null
          profit: number | null
          promoter_id: string | null
          roi_percentage: number | null
          source: string | null
          start_date: string | null
          total_clicks: number | null
          total_conversions: number | null
          total_cost: number | null
          total_impressions: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      promoter_event_performance_view: {
        Row: {
          avg_engagement_score: number | null
          date: string | null
          event_id: string | null
          event_name: string | null
          promoter_id: string | null
          total_attendees: number | null
          total_revenue: number | null
          total_ticket_sales: number | null
          venue_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_analytics: {
        Row: {
          average_order_value: number | null
          code: string | null
          days_remaining: number | null
          description: string | null
          discount_type: string | null
          discount_value: number | null
          end_date: string | null
          establishment_id: string | null
          id: string | null
          is_active: boolean | null
          start_date: string | null
          total_discount_amount: number | null
          total_order_value: number | null
          total_redemptions: number | null
          usage_limit: number | null
          usage_percentage: number | null
        }
        Relationships: [
          {
            foreignKeyName: "establishment_promotions_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_reports: {
        Row: {
          average_transaction: number | null
          establishment_id: string | null
          month: string | null
          monthly_revenue: number | null
          period_end: string | null
          period_start: string | null
          transaction_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_entries_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_analytics_materialized: {
        Row: {
          date: string | null
          establishment_id: string | null
          points_total: number | null
          transaction_type: string | null
          unique_users: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reward_transactions_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_system_analytics: {
        Row: {
          date: string | null
          points_total: number | null
          transaction_count: number | null
          transaction_type: string | null
          unique_users: number | null
        }
        Relationships: []
      }
      seasonal_trend_analysis: {
        Row: {
          avg_quality_score: number | null
          ingredient_name: string | null
          season: string | null
          suggestion_count: number | null
          trend_score: number | null
          year: number | null
        }
        Relationships: []
      }
      streak_performance: {
        Row: {
          avg_current_streak_length: number | null
          max_streak_length: number | null
          streak_type: string | null
          streaks_3_plus: number | null
          streaks_30_plus: number | null
          streaks_7_plus: number | null
          total_streaks: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      aggregate_daily_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      aggregate_daily_reward_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      aggregate_establishment_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      batch_update_user_points: {
        Args: { p_operations: Json }
        Returns: {
          user_id: string
          success: boolean
          points_change: number
          new_balance: number
          error: string
        }[]
      }
      can_join_bar_crawl: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_feature_access: {
        Args: { p_feature_name: string; p_user_id?: string }
        Returns: boolean
      }
      generate_event_access_token: {
        Args: { p_event_id: string; p_days_valid?: number }
        Returns: string
      }
      generate_expiring_promotion_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_retention: {
        Args: { p_start_date: string; p_end_date: string }
        Returns: {
          cohort_date: string
          total_users: number
          retained_users_week1: number
          retained_users_week2: number
          retained_users_week3: number
          retained_users_week4: number
        }[]
      }
      get_user_streaks: {
        Args: { p_user_id: string }
        Returns: {
          streak_type: string
          streak_name: string
          current_count: number
          longest_count: number
          last_activity_date: string
          streak_start_date: string
          is_active: boolean
          days_to_milestone: number
          next_milestone: number
          next_milestone_reward: number
          streak_metadata: Json
          establishment_id: string
        }[]
      }
      initialize_admin_roles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_allowed_multi_role_user: {
        Args: { user_email: string }
        Returns: boolean
      }
      record_campaign_segment_interaction: {
        Args: {
          p_campaign_id: string
          p_segment_id: string
          p_interaction_type: string
          p_value?: number
          p_date?: string
        }
        Returns: undefined
      }
      refresh_reward_analytics_materialized: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_reward_profile_cache: {
        Args: { p_user_id: string; p_establishment_id?: string }
        Returns: undefined
      }
      switch_active_role: {
        Args: { role_to_activate: Database["public"]["Enums"]["user_role"] }
        Returns: undefined
      }
      test_reward_system_performance: {
        Args: { test_size?: number }
        Returns: {
          test_name: string
          duration_ms: number
          rows_processed: number
          status: string
        }[]
      }
      track_analytics_event: {
        Args: {
          p_user_id: string
          p_event_type: string
          p_event_data?: Json
          p_page_url?: string
          p_user_agent?: string
          p_ip_address?: string
        }
        Returns: string
      }
      update_user_points: {
        Args: { p_user_id: string; p_points: number }
        Returns: undefined
      }
      verify_event_access_token: {
        Args: { p_event_id: string; p_token: string }
        Returns: boolean
      }
    }
    Enums: {
      audience_filter_operator:
        | "equals"
        | "not_equals"
        | "contains"
        | "not_contains"
        | "greater_than"
        | "less_than"
        | "between"
        | "in_list"
      audience_segment_status: "draft" | "active" | "archived"
      event_status: "draft" | "published" | "cancelled" | "completed"
      notification_channel: "in_app" | "email" | "push"
      notification_priority: "low" | "medium" | "high" | "urgent"
      subscription_tier: "free" | "basic" | "premium"
      user_role: "individual" | "establishment" | "promoter"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      audience_filter_operator: [
        "equals",
        "not_equals",
        "contains",
        "not_contains",
        "greater_than",
        "less_than",
        "between",
        "in_list",
      ],
      audience_segment_status: ["draft", "active", "archived"],
      event_status: ["draft", "published", "cancelled", "completed"],
      notification_channel: ["in_app", "email", "push"],
      notification_priority: ["low", "medium", "high", "urgent"],
      subscription_tier: ["free", "basic", "premium"],
      user_role: ["individual", "establishment", "promoter"],
    },
  },
} as const
