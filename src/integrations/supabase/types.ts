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
          user_type: string | null
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
          user_type?: string | null
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
          user_type?: string | null
          username?: string | null
        }
        Relationships: []
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
    }
    Functions: {
      aggregate_daily_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      aggregate_establishment_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      can_join_bar_crawl: {
        Args: { user_id: string }
        Returns: boolean
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
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
