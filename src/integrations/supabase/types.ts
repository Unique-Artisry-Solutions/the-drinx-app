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
      affiliate_commissions: {
        Row: {
          affiliate_partner_id: string
          approved_at: string | null
          commission_amount: number
          created_at: string
          id: string
          paid_at: string | null
          status: string
          ticket_purchase_id: string | null
          tracking_link_id: string
          updated_at: string
        }
        Insert: {
          affiliate_partner_id: string
          approved_at?: string | null
          commission_amount: number
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: string
          ticket_purchase_id?: string | null
          tracking_link_id: string
          updated_at?: string
        }
        Update: {
          affiliate_partner_id?: string
          approved_at?: string | null
          commission_amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: string
          ticket_purchase_id?: string | null
          tracking_link_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_affiliate_partner_id_fkey"
            columns: ["affiliate_partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_ticket_purchase_id_fkey"
            columns: ["ticket_purchase_id"]
            isOneToOne: false
            referencedRelation: "ticket_purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_tracking_link_id_fkey"
            columns: ["tracking_link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_tracking_links"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_partners: {
        Row: {
          affiliate_code: string
          affiliate_program_id: string
          approved_at: string | null
          created_at: string
          id: string
          status: string
          suspended_at: string | null
          total_clicks: number | null
          total_conversions: number | null
          total_earnings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          affiliate_program_id: string
          approved_at?: string | null
          created_at?: string
          id?: string
          status?: string
          suspended_at?: string | null
          total_clicks?: number | null
          total_conversions?: number | null
          total_earnings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          affiliate_program_id?: string
          approved_at?: string | null
          created_at?: string
          id?: string
          status?: string
          suspended_at?: string | null
          total_clicks?: number | null
          total_conversions?: number | null
          total_earnings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_partners_affiliate_program_id_fkey"
            columns: ["affiliate_program_id"]
            isOneToOne: false
            referencedRelation: "affiliate_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_partner_id: string
          amount: number
          created_at: string
          id: string
          payout_method: Json
          processed_at: string | null
          provider_transaction_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_partner_id: string
          amount: number
          created_at?: string
          id?: string
          payout_method?: Json
          processed_at?: string | null
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_partner_id?: string
          amount?: number
          created_at?: string
          id?: string
          payout_method?: Json
          processed_at?: string | null
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_partner_id_fkey"
            columns: ["affiliate_partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_programs: {
        Row: {
          commission_rate: number
          commission_type: string
          cookie_duration_days: number | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          min_payout_amount: number | null
          name: string
          promoter_id: string
          terms_and_conditions: string | null
          updated_at: string
        }
        Insert: {
          commission_rate: number
          commission_type: string
          cookie_duration_days?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          min_payout_amount?: number | null
          name: string
          promoter_id: string
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          commission_type?: string
          cookie_duration_days?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          min_payout_amount?: number | null
          name?: string
          promoter_id?: string
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_programs_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_tracking_links: {
        Row: {
          affiliate_partner_id: string
          click_count: number | null
          conversion_count: number | null
          created_at: string
          event_id: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          link_url: string
          swig_circuit_id: string | null
          tracking_code: string
          updated_at: string
        }
        Insert: {
          affiliate_partner_id: string
          click_count?: number | null
          conversion_count?: number | null
          created_at?: string
          event_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          link_url: string
          swig_circuit_id?: string | null
          tracking_code: string
          updated_at?: string
        }
        Update: {
          affiliate_partner_id?: string
          click_count?: number | null
          conversion_count?: number | null
          created_at?: string
          event_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          link_url?: string
          swig_circuit_id?: string | null
          tracking_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_tracking_links_affiliate_partner_id_fkey"
            columns: ["affiliate_partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_tracking_links_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "affiliate_tracking_links_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_tracking_links_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "affiliate_tracking_links_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
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
      app_subscriptions: {
        Row: {
          created_at: string
          id: string
          payment_id: string | null
          payment_provider: string | null
          status: string
          subscription_end: string | null
          subscription_start: string
          subscription_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          status?: string
          subscription_end?: string | null
          subscription_start?: string
          subscription_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          status?: string
          subscription_end?: string | null
          subscription_start?: string
          subscription_type?: string
          updated_at?: string
          user_id?: string
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
      countdown_timers: {
        Row: {
          auto_hide_on_expiry: boolean | null
          created_at: string
          description: string | null
          display_style: Json | null
          event_id: string | null
          id: string
          is_active: boolean
          swig_circuit_id: string | null
          target_datetime: string
          timer_type: string
          title: string
          updated_at: string
          urgency_message: string | null
        }
        Insert: {
          auto_hide_on_expiry?: boolean | null
          created_at?: string
          description?: string | null
          display_style?: Json | null
          event_id?: string | null
          id?: string
          is_active?: boolean
          swig_circuit_id?: string | null
          target_datetime: string
          timer_type: string
          title: string
          updated_at?: string
          urgency_message?: string | null
        }
        Update: {
          auto_hide_on_expiry?: boolean | null
          created_at?: string
          description?: string | null
          display_style?: Json | null
          event_id?: string | null
          id?: string
          is_active?: boolean
          swig_circuit_id?: string | null
          target_datetime?: string
          timer_type?: string
          title?: string
          updated_at?: string
          urgency_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "countdown_timers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "countdown_timers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "countdown_timers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "countdown_timers_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_metrics: {
        Row: {
          cart_abandonments: number | null
          cart_additions: number | null
          created_at: string
          demand_score: number | null
          event_id: string | null
          id: string
          metric_date: string
          page_views: number | null
          sales_velocity: number | null
          swig_circuit_id: string | null
          ticket_inquiries: number | null
          unique_visitors: number | null
          updated_at: string
        }
        Insert: {
          cart_abandonments?: number | null
          cart_additions?: number | null
          created_at?: string
          demand_score?: number | null
          event_id?: string | null
          id?: string
          metric_date?: string
          page_views?: number | null
          sales_velocity?: number | null
          swig_circuit_id?: string | null
          ticket_inquiries?: number | null
          unique_visitors?: number | null
          updated_at?: string
        }
        Update: {
          cart_abandonments?: number | null
          cart_additions?: number | null
          created_at?: string
          demand_score?: number | null
          event_id?: string | null
          id?: string
          metric_date?: string
          page_views?: number | null
          sales_velocity?: number | null
          swig_circuit_id?: string | null
          ticket_inquiries?: number | null
          unique_visitors?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demand_metrics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "demand_metrics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demand_metrics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "demand_metrics_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
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
      engagement_scoring_rules: {
        Row: {
          base_weight: number | null
          conditions: Json | null
          created_at: string | null
          current_weight: number | null
          id: string
          is_active: boolean | null
          promoter_id: string | null
          rule_name: string
          score_formula: Json | null
          signal_type: string
          updated_at: string | null
        }
        Insert: {
          base_weight?: number | null
          conditions?: Json | null
          created_at?: string | null
          current_weight?: number | null
          id?: string
          is_active?: boolean | null
          promoter_id?: string | null
          rule_name: string
          score_formula?: Json | null
          signal_type: string
          updated_at?: string | null
        }
        Update: {
          base_weight?: number | null
          conditions?: Json | null
          created_at?: string | null
          current_weight?: number | null
          id?: string
          is_active?: boolean | null
          promoter_id?: string | null
          rule_name?: string
          score_formula?: Json | null
          signal_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_scoring_rules_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_tier_thresholds: {
        Row: {
          benefits: Json | null
          color_code: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          max_score: number | null
          min_score: number
          promoter_id: string | null
          tier_name: string
          updated_at: string | null
        }
        Insert: {
          benefits?: Json | null
          color_code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_score?: number | null
          min_score: number
          promoter_id?: string | null
          tier_name: string
          updated_at?: string | null
        }
        Update: {
          benefits?: Json | null
          color_code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_score?: number | null
          min_score?: number
          promoter_id?: string | null
          tier_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_tier_thresholds_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          combinable: boolean
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
          min_purchase_amount: number | null
          start_date: string
          updated_at: string
          usage_limit: number | null
          user_segment: string | null
          valid_days: string[] | null
          valid_hours: Json | null
        }
        Insert: {
          code: string
          combinable?: boolean
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
          min_purchase_amount?: number | null
          start_date?: string
          updated_at?: string
          usage_limit?: number | null
          user_segment?: string | null
          valid_days?: string[] | null
          valid_hours?: Json | null
        }
        Update: {
          code?: string
          combinable?: boolean
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
          min_purchase_amount?: number | null
          start_date?: string
          updated_at?: string
          usage_limit?: number | null
          user_segment?: string | null
          valid_days?: string[] | null
          valid_hours?: Json | null
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
      fee_structures: {
        Row: {
          created_at: string
          effective_from: string
          effective_until: string | null
          event_type: string | null
          id: string
          is_active: boolean
          name: string
          payment_processing_fee_fixed: number
          payment_processing_fee_percentage: number
          platform_fee_fixed: number
          platform_fee_percentage: number
          region: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          event_type?: string | null
          id?: string
          is_active?: boolean
          name: string
          payment_processing_fee_fixed?: number
          payment_processing_fee_percentage?: number
          platform_fee_fixed?: number
          platform_fee_percentage?: number
          region: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          event_type?: string | null
          id?: string
          is_active?: boolean
          name?: string
          payment_processing_fee_fixed?: number
          payment_processing_fee_percentage?: number
          platform_fee_fixed?: number
          platform_fee_percentage?: number
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_reports: {
        Row: {
          created_at: string
          generated_at: string
          id: string
          net_earnings: number
          organizer_id: string
          payouts_completed: number
          payouts_pending: number
          period_end: string
          period_start: string
          refunds_count: number
          report_data: Json
          report_type: string
          ticket_sales_count: number
          total_fees: number
          total_revenue: number
          total_taxes: number
        }
        Insert: {
          created_at?: string
          generated_at?: string
          id?: string
          net_earnings?: number
          organizer_id: string
          payouts_completed?: number
          payouts_pending?: number
          period_end: string
          period_start: string
          refunds_count?: number
          report_data?: Json
          report_type: string
          ticket_sales_count?: number
          total_fees?: number
          total_revenue?: number
          total_taxes?: number
        }
        Update: {
          created_at?: string
          generated_at?: string
          id?: string
          net_earnings?: number
          organizer_id?: string
          payouts_completed?: number
          payouts_pending?: number
          period_end?: string
          period_start?: string
          refunds_count?: number
          report_data?: Json
          report_type?: string
          ticket_sales_count?: number
          total_fees?: number
          total_revenue?: number
          total_taxes?: number
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          event_id: string | null
          fee_amount: number
          id: string
          metadata: Json
          net_amount: number
          payout_request_id: string | null
          provider: string
          provider_transaction_id: string | null
          reconciled: boolean
          reconciled_at: string | null
          status: string
          swig_circuit_id: string | null
          tax_amount: number
          ticket_purchase_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          event_id?: string | null
          fee_amount?: number
          id?: string
          metadata?: Json
          net_amount: number
          payout_request_id?: string | null
          provider?: string
          provider_transaction_id?: string | null
          reconciled?: boolean
          reconciled_at?: string | null
          status?: string
          swig_circuit_id?: string | null
          tax_amount?: number
          ticket_purchase_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          event_id?: string | null
          fee_amount?: number
          id?: string
          metadata?: Json
          net_amount?: number
          payout_request_id?: string | null
          provider?: string
          provider_transaction_id?: string | null
          reconciled?: boolean
          reconciled_at?: string | null
          status?: string
          swig_circuit_id?: string | null
          tax_amount?: number
          ticket_purchase_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "financial_transactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "financial_transactions_payout_request_id_fkey"
            columns: ["payout_request_id"]
            isOneToOne: false
            referencedRelation: "payout_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_ticket_purchase_id_fkey"
            columns: ["ticket_purchase_id"]
            isOneToOne: false
            referencedRelation: "ticket_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      follower_achievements: {
        Row: {
          achievement_id: string | null
          achievement_type: string
          badge_id: string | null
          celebration_viewed: boolean | null
          earned_at: string | null
          follower_id: string | null
          id: string
          metadata: Json | null
          milestone_id: string | null
          notification_sent: boolean | null
          points_earned: number | null
          progress_data: Json | null
        }
        Insert: {
          achievement_id?: string | null
          achievement_type: string
          badge_id?: string | null
          celebration_viewed?: boolean | null
          earned_at?: string | null
          follower_id?: string | null
          id?: string
          metadata?: Json | null
          milestone_id?: string | null
          notification_sent?: boolean | null
          points_earned?: number | null
          progress_data?: Json | null
        }
        Update: {
          achievement_id?: string | null
          achievement_type?: string
          badge_id?: string | null
          celebration_viewed?: boolean | null
          earned_at?: string | null
          follower_id?: string | null
          id?: string
          metadata?: Json | null
          milestone_id?: string | null
          notification_sent?: boolean | null
          points_earned?: number | null
          progress_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "follower_achievements_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "follower_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follower_achievements_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "promoter_followers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follower_achievements_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "loyalty_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      follower_analytics_daily: {
        Row: {
          avg_engagement_score: number | null
          created_at: string | null
          date: string
          discovery_sources: Json | null
          id: string
          lost_followers: number | null
          new_followers: number | null
          promoter_id: string
          total_followers: number | null
        }
        Insert: {
          avg_engagement_score?: number | null
          created_at?: string | null
          date: string
          discovery_sources?: Json | null
          id?: string
          lost_followers?: number | null
          new_followers?: number | null
          promoter_id: string
          total_followers?: number | null
        }
        Update: {
          avg_engagement_score?: number | null
          created_at?: string | null
          date?: string
          discovery_sources?: Json | null
          id?: string
          lost_followers?: number | null
          new_followers?: number | null
          promoter_id?: string
          total_followers?: number | null
        }
        Relationships: []
      }
      follower_badges: {
        Row: {
          category: string
          color_code: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          points_reward: number | null
          promoter_id: string | null
          rarity: string | null
          requirements: Json | null
          unlock_condition: Json | null
          updated_at: string | null
        }
        Insert: {
          category: string
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points_reward?: number | null
          promoter_id?: string | null
          rarity?: string | null
          requirements?: Json | null
          unlock_condition?: Json | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points_reward?: number | null
          promoter_id?: string | null
          rarity?: string | null
          requirements?: Json | null
          unlock_condition?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follower_badges_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follower_engagement_history: {
        Row: {
          change_reason: string | null
          created_at: string | null
          follower_id: string | null
          id: string
          metadata: Json | null
          new_score: number | null
          new_tier: string | null
          previous_score: number | null
          previous_tier: string | null
          score_breakdown: Json | null
        }
        Insert: {
          change_reason?: string | null
          created_at?: string | null
          follower_id?: string | null
          id?: string
          metadata?: Json | null
          new_score?: number | null
          new_tier?: string | null
          previous_score?: number | null
          previous_tier?: string | null
          score_breakdown?: Json | null
        }
        Update: {
          change_reason?: string | null
          created_at?: string | null
          follower_id?: string | null
          id?: string
          metadata?: Json | null
          new_score?: number | null
          new_tier?: string | null
          previous_score?: number | null
          previous_tier?: string | null
          score_breakdown?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "follower_engagement_history_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "promoter_followers"
            referencedColumns: ["id"]
          },
        ]
      }
      follower_engagement_scores: {
        Row: {
          activity_score: number | null
          created_at: string | null
          follower_id: string | null
          id: string
          interaction_score: number | null
          last_calculated_at: string | null
          loyalty_score: number | null
          overall_score: number | null
          recency_score: number | null
          score_metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          activity_score?: number | null
          created_at?: string | null
          follower_id?: string | null
          id?: string
          interaction_score?: number | null
          last_calculated_at?: string | null
          loyalty_score?: number | null
          overall_score?: number | null
          recency_score?: number | null
          score_metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          activity_score?: number | null
          created_at?: string | null
          follower_id?: string | null
          id?: string
          interaction_score?: number | null
          last_calculated_at?: string | null
          loyalty_score?: number | null
          overall_score?: number | null
          recency_score?: number | null
          score_metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follower_engagement_scores_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: true
            referencedRelation: "promoter_followers"
            referencedColumns: ["id"]
          },
        ]
      }
      follower_journey_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          follower_id: string | null
          id: string
          ip_address: unknown | null
          referrer_url: string | null
          source_page: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          follower_id?: string | null
          id?: string
          ip_address?: unknown | null
          referrer_url?: string | null
          source_page?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          follower_id?: string | null
          id?: string
          ip_address?: unknown | null
          referrer_url?: string | null
          source_page?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follower_journey_events_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "promoter_followers"
            referencedColumns: ["id"]
          },
        ]
      }
      follower_onboarding_progress: {
        Row: {
          automation_flow_id: string | null
          completed_at: string | null
          completed_steps: Json | null
          conversion_events: Json | null
          created_at: string | null
          current_step: number | null
          engagement_score: number | null
          follower_id: string | null
          id: string
          is_completed: boolean | null
          personalization_data: Json | null
          started_at: string | null
          step_completion_dates: Json | null
          updated_at: string | null
        }
        Insert: {
          automation_flow_id?: string | null
          completed_at?: string | null
          completed_steps?: Json | null
          conversion_events?: Json | null
          created_at?: string | null
          current_step?: number | null
          engagement_score?: number | null
          follower_id?: string | null
          id?: string
          is_completed?: boolean | null
          personalization_data?: Json | null
          started_at?: string | null
          step_completion_dates?: Json | null
          updated_at?: string | null
        }
        Update: {
          automation_flow_id?: string | null
          completed_at?: string | null
          completed_steps?: Json | null
          conversion_events?: Json | null
          created_at?: string | null
          current_step?: number | null
          engagement_score?: number | null
          follower_id?: string | null
          id?: string
          is_completed?: boolean | null
          personalization_data?: Json | null
          started_at?: string | null
          step_completion_dates?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follower_onboarding_progress_automation_flow_id_fkey"
            columns: ["automation_flow_id"]
            isOneToOne: false
            referencedRelation: "welcome_automation_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follower_onboarding_progress_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "promoter_followers"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_rewards: {
        Row: {
          availability_end: string | null
          availability_start: string | null
          cost_points: number | null
          cost_tier_level: number | null
          created_at: string | null
          current_redemptions: number | null
          description: string | null
          id: string
          is_active: boolean | null
          max_redemptions: number | null
          name: string
          promoter_id: string | null
          reward_data: Json | null
          reward_type: string
          updated_at: string | null
        }
        Insert: {
          availability_end?: string | null
          availability_start?: string | null
          cost_points?: number | null
          cost_tier_level?: number | null
          created_at?: string | null
          current_redemptions?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          name: string
          promoter_id?: string | null
          reward_data?: Json | null
          reward_type: string
          updated_at?: string | null
        }
        Update: {
          availability_end?: string | null
          availability_start?: string | null
          cost_points?: number | null
          cost_tier_level?: number | null
          created_at?: string | null
          current_redemptions?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          name?: string
          promoter_id?: string | null
          reward_data?: Json | null
          reward_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gamification_rewards_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      loyalty_milestones: {
        Row: {
          auto_upgrade: boolean | null
          created_at: string | null
          engagement_threshold: number | null
          id: string
          is_active: boolean | null
          milestone_name: string
          points_threshold: number | null
          promoter_id: string | null
          requirements: Json
          rewards: Json | null
          special_conditions: Json | null
          tier_level: number
          time_requirement_days: number | null
          updated_at: string | null
        }
        Insert: {
          auto_upgrade?: boolean | null
          created_at?: string | null
          engagement_threshold?: number | null
          id?: string
          is_active?: boolean | null
          milestone_name: string
          points_threshold?: number | null
          promoter_id?: string | null
          requirements?: Json
          rewards?: Json | null
          special_conditions?: Json | null
          tier_level: number
          time_requirement_days?: number | null
          updated_at?: string | null
        }
        Update: {
          auto_upgrade?: boolean | null
          created_at?: string | null
          engagement_threshold?: number | null
          id?: string
          is_active?: boolean | null
          milestone_name?: string
          points_threshold?: number | null
          promoter_id?: string | null
          requirements?: Json
          rewards?: Json | null
          special_conditions?: Json | null
          tier_level?: number
          time_requirement_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_milestones_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string | null
          current_points: number | null
          follower_id: string | null
          id: string
          last_earned_at: string | null
          last_spent_at: string | null
          lifetime_points: number | null
          points_spent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_points?: number | null
          follower_id?: string | null
          id?: string
          last_earned_at?: string | null
          last_spent_at?: string | null
          lifetime_points?: number | null
          points_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_points?: number | null
          follower_id?: string | null
          id?: string
          last_earned_at?: string | null
          last_spent_at?: string | null
          lifetime_points?: number | null
          points_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: true
            referencedRelation: "promoter_followers"
            referencedColumns: ["id"]
          },
        ]
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
      mocktail_suggestion_notifications: {
        Row: {
          content: string
          created_at: string | null
          establishment_id: string | null
          id: string
          notification_type: string
          read_at: string | null
          suggestion_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          notification_type: string
          read_at?: string | null
          suggestion_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          notification_type?: string
          read_at?: string | null
          suggestion_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mocktail_suggestion_notifications_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mocktail_suggestion_notifications_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "mocktail_suggestions"
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
      organizer_tax_info: {
        Row: {
          address: Json
          business_name: string | null
          business_type: string | null
          country_code: string
          created_at: string
          id: string
          organizer_id: string
          region: string
          tax_exempt: boolean
          tax_exempt_certificate_url: string | null
          tax_id: string | null
          updated_at: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          address?: Json
          business_name?: string | null
          business_type?: string | null
          country_code: string
          created_at?: string
          id?: string
          organizer_id: string
          region: string
          tax_exempt?: boolean
          tax_exempt_certificate_url?: string | null
          tax_id?: string | null
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          address?: Json
          business_name?: string | null
          business_type?: string | null
          country_code?: string
          created_at?: string
          id?: string
          organizer_id?: string
          region?: string
          tax_exempt?: boolean
          tax_exempt_certificate_url?: string | null
          tax_id?: string | null
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: []
      }
      payment_failure_logs: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          error_message: string | null
          id: string
          metadata: Json
          payment_method_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json
          payment_method_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json
          payment_method_id?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      payment_receipts: {
        Row: {
          created_at: string
          id: string
          receipt_data: Json
          receipt_number: string
          receipt_url: string | null
          transaction_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          receipt_data?: Json
          receipt_number: string
          receipt_url?: string | null
          transaction_id: string
        }
        Update: {
          created_at?: string
          id?: string
          receipt_data?: Json
          receipt_number?: string
          receipt_url?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_receipts_transaction"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_refunds: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json
          provider_refund_id: string | null
          reason: string | null
          refunded_by: string | null
          status: string
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json
          provider_refund_id?: string | null
          reason?: string | null
          refunded_by?: string | null
          status?: string
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json
          provider_refund_id?: string | null
          reason?: string | null
          refunded_by?: string | null
          status?: string
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_refunds_transaction"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_retries: {
        Row: {
          attempt_number: number
          completed_at: string | null
          created_at: string
          failure_reason: string
          id: string
          max_retries: number
          metadata: Json
          retry_scheduled_for: string
          status: string
          transaction_id: string
        }
        Insert: {
          attempt_number?: number
          completed_at?: string | null
          created_at?: string
          failure_reason: string
          id?: string
          max_retries?: number
          metadata?: Json
          retry_scheduled_for: string
          status?: string
          transaction_id: string
        }
        Update: {
          attempt_number?: number
          completed_at?: string | null
          created_at?: string
          failure_reason?: string
          id?: string
          max_retries?: number
          metadata?: Json
          retry_scheduled_for?: string
          status?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_retries_transaction"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json
          payment_method_id: string | null
          provider: string
          provider_transaction_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          payment_method_id?: string | null
          provider?: string
          provider_transaction_id?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          payment_method_id?: string | null
          provider?: string
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payout_requests: {
        Row: {
          amount: number
          created_at: string
          event_id: string | null
          failure_reason: string | null
          fees_deducted: number
          id: string
          metadata: Json
          net_amount: number
          organizer_id: string
          payout_method: Json
          processed_at: string | null
          provider_transaction_id: string | null
          requested_at: string
          status: string
          swig_circuit_id: string | null
          tax_withheld: number
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          event_id?: string | null
          failure_reason?: string | null
          fees_deducted?: number
          id?: string
          metadata?: Json
          net_amount: number
          organizer_id: string
          payout_method?: Json
          processed_at?: string | null
          provider_transaction_id?: string | null
          requested_at?: string
          status?: string
          swig_circuit_id?: string | null
          tax_withheld?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          event_id?: string | null
          failure_reason?: string | null
          fees_deducted?: number
          id?: string
          metadata?: Json
          net_amount?: number
          organizer_id?: string
          payout_method?: Json
          processed_at?: string | null
          provider_transaction_id?: string | null
          requested_at?: string
          status?: string
          swig_circuit_id?: string | null
          tax_withheld?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_requests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "payout_requests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_requests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "payout_requests_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          automatic_change: boolean
          change_reason: string
          changed_by: string | null
          created_at: string
          effective_at: string
          id: string
          new_price: number
          old_price: number
          pricing_tier_id: string | null
          rule_applied: string | null
        }
        Insert: {
          automatic_change?: boolean
          change_reason: string
          changed_by?: string | null
          created_at?: string
          effective_at?: string
          id?: string
          new_price: number
          old_price: number
          pricing_tier_id?: string | null
          rule_applied?: string | null
        }
        Update: {
          automatic_change?: boolean
          change_reason?: string
          changed_by?: string | null
          created_at?: string
          effective_at?: string
          id?: string
          new_price?: number
          old_price?: number
          pricing_tier_id?: string | null
          rule_applied?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_pricing_tier_id_fkey"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "ticket_pricing_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_rule_applied_fkey"
            columns: ["rule_applied"]
            isOneToOne: false
            referencedRelation: "pricing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_automations: {
        Row: {
          cooldown_minutes: number | null
          created_at: string
          id: string
          is_active: boolean
          last_triggered: string | null
          max_triggers_per_day: number | null
          pricing_rule_id: string
          trigger_conditions: Json
          trigger_count: number | null
          updated_at: string
        }
        Insert: {
          cooldown_minutes?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_triggered?: string | null
          max_triggers_per_day?: number | null
          pricing_rule_id: string
          trigger_conditions?: Json
          trigger_count?: number | null
          updated_at?: string
        }
        Update: {
          cooldown_minutes?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_triggered?: string | null
          max_triggers_per_day?: number | null
          pricing_rule_id?: string
          trigger_conditions?: Json
          trigger_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_automations_pricing_rule_id_fkey"
            columns: ["pricing_rule_id"]
            isOneToOne: false
            referencedRelation: "pricing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          conditions: Json
          created_at: string
          effective_from: string
          effective_until: string | null
          event_id: string | null
          id: string
          is_active: boolean
          max_price: number | null
          min_price: number | null
          price_adjustment_type: string
          price_adjustment_value: number
          priority: number | null
          promoter_id: string
          rule_name: string
          rule_type: string
          swig_circuit_id: string | null
          updated_at: string
        }
        Insert: {
          conditions?: Json
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean
          max_price?: number | null
          min_price?: number | null
          price_adjustment_type: string
          price_adjustment_value: number
          priority?: number | null
          promoter_id: string
          rule_name: string
          rule_type: string
          swig_circuit_id?: string | null
          updated_at?: string
        }
        Update: {
          conditions?: Json
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean
          max_price?: number | null
          min_price?: number | null
          price_adjustment_type?: string
          price_adjustment_value?: number
          priority?: number | null
          promoter_id?: string
          rule_name?: string
          rule_type?: string
          swig_circuit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "pricing_rules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_rules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "pricing_rules_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_rules_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
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
      promoter_followers: {
        Row: {
          churn_risk_score: number | null
          created_at: string
          discovery_metadata: Json | null
          discovery_source: string | null
          engagement_count: number | null
          engagement_score: number | null
          engagement_tier: string | null
          follow_status: string
          follower_tier: string | null
          gamification_score: number | null
          id: string
          last_badge_earned_at: string | null
          last_engagement_at: string | null
          loyalty_tier_level: number | null
          notification_preferences: Json
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          onboarding_progress_score: number | null
          onboarding_stage: string | null
          onboarding_started_at: string | null
          promoter_id: string
          referral_source: string | null
          score_last_updated: string | null
          subscriber_id: string
          subscription_end: string | null
          subscription_start: string
          tier_id: string | null
          tier_progress_percentage: number | null
          tier_updated_at: string | null
          total_badges_earned: number | null
          total_interactions: number | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          welcome_flow_id: string | null
        }
        Insert: {
          churn_risk_score?: number | null
          created_at?: string
          discovery_metadata?: Json | null
          discovery_source?: string | null
          engagement_count?: number | null
          engagement_score?: number | null
          engagement_tier?: string | null
          follow_status?: string
          follower_tier?: string | null
          gamification_score?: number | null
          id?: string
          last_badge_earned_at?: string | null
          last_engagement_at?: string | null
          loyalty_tier_level?: number | null
          notification_preferences?: Json
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_progress_score?: number | null
          onboarding_stage?: string | null
          onboarding_started_at?: string | null
          promoter_id: string
          referral_source?: string | null
          score_last_updated?: string | null
          subscriber_id: string
          subscription_end?: string | null
          subscription_start?: string
          tier_id?: string | null
          tier_progress_percentage?: number | null
          tier_updated_at?: string | null
          total_badges_earned?: number | null
          total_interactions?: number | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          welcome_flow_id?: string | null
        }
        Update: {
          churn_risk_score?: number | null
          created_at?: string
          discovery_metadata?: Json | null
          discovery_source?: string | null
          engagement_count?: number | null
          engagement_score?: number | null
          engagement_tier?: string | null
          follow_status?: string
          follower_tier?: string | null
          gamification_score?: number | null
          id?: string
          last_badge_earned_at?: string | null
          last_engagement_at?: string | null
          loyalty_tier_level?: number | null
          notification_preferences?: Json
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_progress_score?: number | null
          onboarding_stage?: string | null
          onboarding_started_at?: string | null
          promoter_id?: string
          referral_source?: string | null
          score_last_updated?: string | null
          subscriber_id?: string
          subscription_end?: string | null
          subscription_start?: string
          tier_id?: string | null
          tier_progress_percentage?: number | null
          tier_updated_at?: string | null
          total_badges_earned?: number | null
          total_interactions?: number | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          welcome_flow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promoter_followers_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "promoter_subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_followers_welcome_flow_id_fkey"
            columns: ["welcome_flow_id"]
            isOneToOne: false
            referencedRelation: "welcome_automation_flows"
            referencedColumns: ["id"]
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
          is_free: boolean | null
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
          is_free?: boolean | null
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
          is_free?: boolean | null
          name?: string
          price?: number
          promoter_id?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
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
      referral_programs: {
        Row: {
          created_at: string
          description: string | null
          expiration_date: string | null
          id: string
          is_active: boolean
          max_uses_per_user: number | null
          name: string
          promoter_id: string
          referee_reward_type: string
          referee_reward_value: number
          referrer_reward_type: string
          referrer_reward_value: number
          tier_multipliers: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean
          max_uses_per_user?: number | null
          name: string
          promoter_id: string
          referee_reward_type: string
          referee_reward_value: number
          referrer_reward_type: string
          referrer_reward_value: number
          tier_multipliers?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean
          max_uses_per_user?: number | null
          name?: string
          promoter_id?: string
          referee_reward_type?: string
          referee_reward_value?: number
          referrer_reward_type?: string
          referrer_reward_value?: number
          tier_multipliers?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_programs_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_rewards: {
        Row: {
          awarded_at: string | null
          created_at: string
          id: string
          reward_amount: number
          reward_points: number | null
          reward_type: string
          status: string
          tier_bonus_applied: number | null
          updated_at: string
          user_id: string
          user_referral_id: string
        }
        Insert: {
          awarded_at?: string | null
          created_at?: string
          id?: string
          reward_amount: number
          reward_points?: number | null
          reward_type: string
          status?: string
          tier_bonus_applied?: number | null
          updated_at?: string
          user_id: string
          user_referral_id: string
        }
        Update: {
          awarded_at?: string | null
          created_at?: string
          id?: string
          reward_amount?: number
          reward_points?: number | null
          reward_type?: string
          status?: string
          tier_bonus_applied?: number | null
          updated_at?: string
          user_id?: string
          user_referral_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_rewards_user_referral_id_fkey"
            columns: ["user_referral_id"]
            isOneToOne: false
            referencedRelation: "user_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_tiers: {
        Row: {
          benefits: Json | null
          bonus_multiplier: number
          created_at: string
          id: string
          min_referrals: number
          referral_program_id: string
          tier_name: string
          tier_order: number
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          bonus_multiplier?: number
          created_at?: string
          id?: string
          min_referrals: number
          referral_program_id: string
          tier_name: string
          tier_order: number
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          bonus_multiplier?: number
          created_at?: string
          id?: string
          min_referrals?: number
          referral_program_id?: string
          tier_name?: string
          tier_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_tiers_referral_program_id_fkey"
            columns: ["referral_program_id"]
            isOneToOne: false
            referencedRelation: "referral_programs"
            referencedColumns: ["id"]
          },
        ]
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
      scarcity_indicators: {
        Row: {
          created_at: string
          display_style: Json | null
          id: string
          indicator_type: string
          is_active: boolean
          message_template: string
          priority: number | null
          threshold_value: number | null
          ticket_pricing_tier_id: string | null
          updated_at: string
          urgency_campaign_id: string | null
        }
        Insert: {
          created_at?: string
          display_style?: Json | null
          id?: string
          indicator_type: string
          is_active?: boolean
          message_template: string
          priority?: number | null
          threshold_value?: number | null
          ticket_pricing_tier_id?: string | null
          updated_at?: string
          urgency_campaign_id?: string | null
        }
        Update: {
          created_at?: string
          display_style?: Json | null
          id?: string
          indicator_type?: string
          is_active?: boolean
          message_template?: string
          priority?: number | null
          threshold_value?: number | null
          ticket_pricing_tier_id?: string | null
          updated_at?: string
          urgency_campaign_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scarcity_indicators_ticket_pricing_tier_id_fkey"
            columns: ["ticket_pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "ticket_pricing_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scarcity_indicators_urgency_campaign_id_fkey"
            columns: ["urgency_campaign_id"]
            isOneToOne: false
            referencedRelation: "urgency_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_message_deliveries: {
        Row: {
          created_at: string | null
          delivery_status: string | null
          engagement_metrics: Json | null
          error_message: string | null
          follower_id: string | null
          id: string
          onboarding_progress_id: string | null
          response_data: Json | null
          retry_count: number | null
          scheduled_for: string
          scheduled_message_id: string | null
          sent_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_status?: string | null
          engagement_metrics?: Json | null
          error_message?: string | null
          follower_id?: string | null
          id?: string
          onboarding_progress_id?: string | null
          response_data?: Json | null
          retry_count?: number | null
          scheduled_for: string
          scheduled_message_id?: string | null
          sent_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_status?: string | null
          engagement_metrics?: Json | null
          error_message?: string | null
          follower_id?: string | null
          id?: string
          onboarding_progress_id?: string | null
          response_data?: Json | null
          retry_count?: number | null
          scheduled_for?: string
          scheduled_message_id?: string | null
          sent_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_message_deliveries_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "promoter_followers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_message_deliveries_onboarding_progress_id_fkey"
            columns: ["onboarding_progress_id"]
            isOneToOne: false
            referencedRelation: "follower_onboarding_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_message_deliveries_scheduled_message_id_fkey"
            columns: ["scheduled_message_id"]
            isOneToOne: false
            referencedRelation: "scheduled_welcome_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_welcome_messages: {
        Row: {
          automation_flow_id: string | null
          created_at: string | null
          delay_minutes: number
          id: string
          is_active: boolean | null
          message_content: string
          message_data: Json | null
          message_type: string
          promoter_id: string | null
          send_conditions: Json | null
          step_name: string
          step_number: number
          subject_line: string | null
          updated_at: string | null
        }
        Insert: {
          automation_flow_id?: string | null
          created_at?: string | null
          delay_minutes?: number
          id?: string
          is_active?: boolean | null
          message_content: string
          message_data?: Json | null
          message_type: string
          promoter_id?: string | null
          send_conditions?: Json | null
          step_name: string
          step_number: number
          subject_line?: string | null
          updated_at?: string | null
        }
        Update: {
          automation_flow_id?: string | null
          created_at?: string | null
          delay_minutes?: number
          id?: string
          is_active?: boolean | null
          message_content?: string
          message_data?: Json | null
          message_type?: string
          promoter_id?: string | null
          send_conditions?: Json | null
          step_name?: string
          step_number?: number
          subject_line?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_welcome_messages_automation_flow_id_fkey"
            columns: ["automation_flow_id"]
            isOneToOne: false
            referencedRelation: "welcome_automation_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_welcome_messages_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      subscription_payments: {
        Row: {
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json
          status: string
          stripe_subscription_id: string | null
          subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          status?: string
          stripe_subscription_id?: string | null
          subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          status?: string
          stripe_subscription_id?: string | null
          subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      swig_circuit_attendees: {
        Row: {
          checked_in_at: string | null
          created_at: string
          first_check_in: string | null
          id: string
          purchase_date: string
          purchaser_info: Json | null
          quantity: number
          status: string
          swig_circuit_id: string | null
          ticket_code: string | null
          ticket_type_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          created_at?: string
          first_check_in?: string | null
          id?: string
          purchase_date?: string
          purchaser_info?: Json | null
          quantity?: number
          status?: string
          swig_circuit_id?: string | null
          ticket_code?: string | null
          ticket_type_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          created_at?: string
          first_check_in?: string | null
          id?: string
          purchase_date?: string
          purchaser_info?: Json | null
          quantity?: number
          status?: string
          swig_circuit_id?: string | null
          ticket_code?: string | null
          ticket_type_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swig_circuit_attendees_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swig_circuit_attendees_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "swig_circuit_ticket_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      swig_circuit_check_ins: {
        Row: {
          attendee_id: string | null
          checked_in_at: string
          checked_in_by: string | null
          created_at: string
          establishment_id: string | null
          id: string
          swig_circuit_id: string | null
        }
        Insert: {
          attendee_id?: string | null
          checked_in_at?: string
          checked_in_by?: string | null
          created_at?: string
          establishment_id?: string | null
          id?: string
          swig_circuit_id?: string | null
        }
        Update: {
          attendee_id?: string | null
          checked_in_at?: string
          checked_in_by?: string | null
          created_at?: string
          establishment_id?: string | null
          id?: string
          swig_circuit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swig_circuit_check_ins_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "swig_circuit_attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swig_circuit_check_ins_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swig_circuit_check_ins_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
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
      tax_configurations: {
        Row: {
          country_code: string
          created_at: string
          id: string
          is_active: boolean
          region: string
          requires_tax_id: boolean
          tax_rate: number
          tax_type: string
          threshold_amount: number | null
          updated_at: string
          withholding_required: boolean
        }
        Insert: {
          country_code: string
          created_at?: string
          id?: string
          is_active?: boolean
          region: string
          requires_tax_id?: boolean
          tax_rate: number
          tax_type: string
          threshold_amount?: number | null
          updated_at?: string
          withholding_required?: boolean
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          region?: string
          requires_tax_id?: boolean
          tax_rate?: number
          tax_type?: string
          threshold_amount?: number | null
          updated_at?: string
          withholding_required?: boolean
        }
        Relationships: []
      }
      ticket_cancellation_policies: {
        Row: {
          created_at: string | null
          days_before_event: number
          event_id: string | null
          id: string
          is_active: boolean | null
          processing_fee: number | null
          refund_percentage: number
          swig_circuit_id: string | null
        }
        Insert: {
          created_at?: string | null
          days_before_event: number
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          processing_fee?: number | null
          refund_percentage?: number
          swig_circuit_id?: string | null
        }
        Update: {
          created_at?: string | null
          days_before_event?: number
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          processing_fee?: number | null
          refund_percentage?: number
          swig_circuit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_cancellation_policies_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "ticket_cancellation_policies_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_cancellation_policies_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "ticket_cancellation_policies_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_inventory: {
        Row: {
          available_quantity: number | null
          event_id: string | null
          id: string
          last_updated: string | null
          reserved_quantity: number | null
          sold_quantity: number | null
          swig_circuit_id: string | null
          ticket_type_id: string | null
          total_quantity: number
        }
        Insert: {
          available_quantity?: number | null
          event_id?: string | null
          id?: string
          last_updated?: string | null
          reserved_quantity?: number | null
          sold_quantity?: number | null
          swig_circuit_id?: string | null
          ticket_type_id?: string | null
          total_quantity: number
        }
        Update: {
          available_quantity?: number | null
          event_id?: string | null
          id?: string
          last_updated?: string | null
          reserved_quantity?: number | null
          sold_quantity?: number | null
          swig_circuit_id?: string | null
          ticket_type_id?: string | null
          total_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_inventory_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "ticket_inventory_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_inventory_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "ticket_inventory_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_pricing_tiers: {
        Row: {
          base_price: number
          created_at: string
          early_bird_discount_amount: number | null
          early_bird_discount_percentage: number | null
          early_bird_end_date: string | null
          event_id: string | null
          id: string
          is_active: boolean | null
          is_early_bird: boolean | null
          max_quantity: number | null
          sold_quantity: number | null
          swig_circuit_id: string | null
          tier_benefits: Json | null
          tier_name: string
          tier_order: number
          updated_at: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          base_price: number
          created_at?: string
          early_bird_discount_amount?: number | null
          early_bird_discount_percentage?: number | null
          early_bird_end_date?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          is_early_bird?: boolean | null
          max_quantity?: number | null
          sold_quantity?: number | null
          swig_circuit_id?: string | null
          tier_benefits?: Json | null
          tier_name: string
          tier_order?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          base_price?: number
          created_at?: string
          early_bird_discount_amount?: number | null
          early_bird_discount_percentage?: number | null
          early_bird_end_date?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          is_early_bird?: boolean | null
          max_quantity?: number | null
          sold_quantity?: number | null
          swig_circuit_id?: string | null
          tier_benefits?: Json | null
          tier_name?: string
          tier_order?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_pricing_tiers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "ticket_pricing_tiers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_pricing_tiers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "ticket_pricing_tiers_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_purchases: {
        Row: {
          contact_email: string
          contact_name: string
          created_at: string | null
          event_id: string | null
          id: string
          payment_status: string
          price_per_ticket: number
          purchase_details: Json | null
          quantity: number
          service_fee: number | null
          service_fee_percentage: number | null
          status: string
          swig_circuit_id: string | null
          ticket_code: string | null
          ticket_type: string
          ticket_type_id: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          contact_email: string
          contact_name: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          payment_status?: string
          price_per_ticket: number
          purchase_details?: Json | null
          quantity?: number
          service_fee?: number | null
          service_fee_percentage?: number | null
          status?: string
          swig_circuit_id?: string | null
          ticket_code?: string | null
          ticket_type: string
          ticket_type_id?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          contact_email?: string
          contact_name?: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          payment_status?: string
          price_per_ticket?: number
          purchase_details?: Json | null
          quantity?: number
          service_fee?: number | null
          service_fee_percentage?: number | null
          status?: string
          swig_circuit_id?: string | null
          ticket_code?: string | null
          ticket_type?: string
          ticket_type_id?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_purchases_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "ticket_purchases_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_purchases_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "ticket_purchases_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_refunds: {
        Row: {
          created_at: string | null
          id: string
          processed_at: string | null
          processed_by: string | null
          processing_fee: number | null
          refund_amount: number
          refund_reason: string | null
          status: string
          ticket_purchase_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          processing_fee?: number | null
          refund_amount: number
          refund_reason?: string | null
          status?: string
          ticket_purchase_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          processing_fee?: number | null
          refund_amount?: number
          refund_reason?: string | null
          status?: string
          ticket_purchase_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_refunds_ticket_purchase_id_fkey"
            columns: ["ticket_purchase_id"]
            isOneToOne: false
            referencedRelation: "ticket_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_transaction_history: {
        Row: {
          created_at: string
          from_status: string | null
          id: string
          notes: string | null
          performed_by: string | null
          ticket_purchase_id: string | null
          to_status: string | null
          transaction_data: Json | null
          transaction_type: string
        }
        Insert: {
          created_at?: string
          from_status?: string | null
          id?: string
          notes?: string | null
          performed_by?: string | null
          ticket_purchase_id?: string | null
          to_status?: string | null
          transaction_data?: Json | null
          transaction_type: string
        }
        Update: {
          created_at?: string
          from_status?: string | null
          id?: string
          notes?: string | null
          performed_by?: string | null
          ticket_purchase_id?: string | null
          to_status?: string | null
          transaction_data?: Json | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_transaction_history_ticket_purchase_id_fkey"
            columns: ["ticket_purchase_id"]
            isOneToOne: false
            referencedRelation: "ticket_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_transfers: {
        Row: {
          created_at: string | null
          expires_at: string | null
          from_user_id: string | null
          id: string
          status: string
          ticket_purchase_id: string | null
          to_email: string
          to_user_id: string | null
          transfer_code: string
          transferred_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          from_user_id?: string | null
          id?: string
          status?: string
          ticket_purchase_id?: string | null
          to_email: string
          to_user_id?: string | null
          transfer_code: string
          transferred_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          from_user_id?: string | null
          id?: string
          status?: string
          ticket_purchase_id?: string | null
          to_email?: string
          to_user_id?: string | null
          transfer_code?: string
          transferred_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_transfers_ticket_purchase_id_fkey"
            columns: ["ticket_purchase_id"]
            isOneToOne: false
            referencedRelation: "ticket_purchases"
            referencedColumns: ["id"]
          },
        ]
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
      urgency_campaigns: {
        Row: {
          campaign_name: string
          campaign_type: string
          conversion_count: number | null
          created_at: string
          current_displays: number | null
          display_conditions: Json | null
          end_date: string | null
          event_id: string | null
          id: string
          is_active: boolean
          max_displays: number | null
          message_template: string
          promoter_id: string
          start_date: string
          swig_circuit_id: string | null
          trigger_conditions: Json | null
          updated_at: string
        }
        Insert: {
          campaign_name: string
          campaign_type: string
          conversion_count?: number | null
          created_at?: string
          current_displays?: number | null
          display_conditions?: Json | null
          end_date?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean
          max_displays?: number | null
          message_template: string
          promoter_id: string
          start_date?: string
          swig_circuit_id?: string | null
          trigger_conditions?: Json | null
          updated_at?: string
        }
        Update: {
          campaign_name?: string
          campaign_type?: string
          conversion_count?: number | null
          created_at?: string
          current_displays?: number | null
          display_conditions?: Json | null
          end_date?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean
          max_displays?: number | null
          message_template?: string
          promoter_id?: string
          start_date?: string
          swig_circuit_id?: string | null
          trigger_conditions?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "urgency_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_statistics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "urgency_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "urgency_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "promoter_event_performance_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "urgency_campaigns_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "urgency_campaigns_swig_circuit_id_fkey"
            columns: ["swig_circuit_id"]
            isOneToOne: false
            referencedRelation: "swig_circuits"
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
      user_referrals: {
        Row: {
          completed_at: string | null
          conversion_data: Json | null
          conversion_event: string | null
          created_at: string
          id: string
          referee_id: string | null
          referral_code: string
          referral_program_id: string
          referrer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          conversion_data?: Json | null
          conversion_event?: string | null
          created_at?: string
          id?: string
          referee_id?: string | null
          referral_code: string
          referral_program_id: string
          referrer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          conversion_data?: Json | null
          conversion_event?: string | null
          created_at?: string
          id?: string
          referee_id?: string | null
          referral_code?: string
          referral_program_id?: string
          referrer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_referrals_referral_program_id_fkey"
            columns: ["referral_program_id"]
            isOneToOne: false
            referencedRelation: "referral_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      user_saved_codes: {
        Row: {
          code_id: string
          id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          code_id: string
          id?: string
          saved_at?: string
          user_id: string
        }
        Update: {
          code_id?: string
          id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_codes_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "establishment_promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_saved_codes_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "promotion_analytics"
            referencedColumns: ["id"]
          },
        ]
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
      welcome_automation_flows: {
        Row: {
          completion_criteria: Json | null
          created_at: string | null
          description: string | null
          flow_config: Json | null
          flow_name: string
          id: string
          is_active: boolean | null
          promoter_id: string | null
          success_metrics: Json | null
          trigger_conditions: Json | null
          updated_at: string | null
        }
        Insert: {
          completion_criteria?: Json | null
          created_at?: string | null
          description?: string | null
          flow_config?: Json | null
          flow_name: string
          id?: string
          is_active?: boolean | null
          promoter_id?: string | null
          success_metrics?: Json | null
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Update: {
          completion_criteria?: Json | null
          created_at?: string | null
          description?: string | null
          flow_config?: Json | null
          flow_name?: string
          id?: string
          is_active?: boolean | null
          promoter_id?: string | null
          success_metrics?: Json | null
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "welcome_automation_flows_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      advance_onboarding_step: {
        Args: { p_follower_id: string }
        Returns: boolean
      }
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
      calculate_comprehensive_engagement_score: {
        Args: { p_follower_id: string }
        Returns: {
          overall_score: number
          activity_score: number
          interaction_score: number
          loyalty_score: number
          recency_score: number
          conversion_score: number
          recommended_tier: string
          score_breakdown: Json
        }[]
      }
      calculate_engagement_score: {
        Args: { p_follower_id: string }
        Returns: number
      }
      calculate_fees_and_taxes: {
        Args: { p_amount: number; p_region?: string; p_event_type?: string }
        Returns: {
          gross_amount: number
          platform_fee: number
          processing_fee: number
          total_fees: number
          tax_amount: number
          net_amount: number
        }[]
      }
      calculate_refund_amount: {
        Args: { p_ticket_purchase_id: string; p_event_date?: string }
        Returns: {
          refund_amount: number
          processing_fee: number
          refund_percentage: number
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
      get_current_ticket_price: {
        Args: {
          p_event_id?: string
          p_swig_circuit_id?: string
          p_ticket_type_id?: string
        }
        Returns: {
          tier_id: string
          tier_name: string
          current_price: number
          base_price: number
          discount_amount: number
          is_early_bird: boolean
          remaining_quantity: number
        }[]
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
      start_follower_onboarding: {
        Args: { p_follower_id: string }
        Returns: boolean
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
      track_follower_journey_event: {
        Args: {
          p_follower_id: string
          p_event_type: string
          p_event_data?: Json
          p_source_page?: string
          p_referrer_url?: string
          p_user_agent?: string
          p_ip_address?: unknown
        }
        Returns: string
      }
      update_user_points: {
        Args: { p_user_id: string; p_points: number }
        Returns: undefined
      }
      validate_promotion: {
        Args: {
          p_promotion_id: string
          p_user_id: string
          p_purchase_amount?: number
          p_current_time?: string
        }
        Returns: Json
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
