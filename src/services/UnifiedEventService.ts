
// Unified Event Service - consolidates all event-related functionality
import { supabase } from '@/integrations/supabase/client';
import { serviceConfig } from './ServiceConfig';
import { ServiceUtils, type ServiceResponse } from './ServiceUtils';

export interface EventDetails {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  capacity?: number;
  venue_id?: string;
  created_by: string;
  image_url?: string;
  event_type?: string;
  event_url?: string;
}

export interface EventAccessToken {
  token: string;
  event_id: string;
  expires_at: string;
  is_active: boolean;
}

export class UnifiedEventService {
  private static initialized = false;

  static async initialize(): Promise<void> {
    if (this.initialized) return;
    
    const config = serviceConfig.getConfig();
    if (config.enableLogging) {
      console.log('UnifiedEventService: Initializing...');
    }
    
    this.initialized = true;
  }

  // Event status management
  static async updateEventStatus(eventId: string, status: 'draft' | 'published' | 'cancelled' | 'completed'): Promise<void> {
    const { error } = await supabase
      .from('events')
      .update({ status })
      .eq('id', eventId);
    
    if (error) throw error;
  }

  // Access token management
  static async generateEventAccessToken(eventId: string, daysValid: number = 30): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .rpc('generate_event_access_token', {
          p_event_id: eventId,
          p_days_valid: daysValid
        });

      if (error) throw error;
      console.log('Generated new token:', data);
      return data;
    } catch (error) {
      console.error('Error generating event access token:', error);
      throw error;
    }
  }

  static async verifyEventAccessToken(eventId: string, token: string): Promise<boolean> {
    try {
      console.log('Verifying token for event:', eventId, 'token:', token);
      const { data, error } = await supabase
        .rpc('verify_event_access_token', {
          p_event_id: eventId,
          p_token: token
        });

      if (error) {
        console.error('Token verification error:', error);
        throw error;
      }
      
      console.log('Token verification result:', data);
      return data === true;
    } catch (error) {
      console.error('Error verifying event access token:', error);
      return false;
    }
  }

  static async getCurrentEventToken(eventId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('event_access_tokens')
        .select('token')
        .eq('event_id', eventId)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw error;
      }

      return data?.token || null;
    } catch (error) {
      console.error('Error getting current event token:', error);
      return null;
    }
  }

  // Event data adaptation
  static adaptToABTestingData(campaignData: any) {
    if (!campaignData || !campaignData.metrics) {
      return {
        controlData: { conversionRate: 0, traffic: 0 },
        testData: { conversionRate: 0, traffic: 0 }
      };
    }

    const metrics = typeof campaignData.metrics === 'string' 
      ? JSON.parse(campaignData.metrics) 
      : campaignData.metrics;
    const abTest = metrics.abTest || {};
    
    // Get control variant data
    const controlVariant = abTest.variantA || {};
    const controlImpressions = controlVariant.impressions || 0;
    const controlConversions = controlVariant.conversions || 0;
    const controlConversionRate = controlImpressions > 0 
      ? (controlConversions / controlImpressions) * 100 
      : 0;
      
    // Get test variant data
    const testVariant = abTest.variantB || {};
    const testImpressions = testVariant.impressions || 0;
    const testConversions = testVariant.conversions || 0;
    const testConversionRate = testImpressions > 0 
      ? (testConversions / testImpressions) * 100 
      : 0;

    return {
      controlData: {
        conversionRate: controlConversionRate,
        traffic: controlImpressions
      },
      testData: {
        conversionRate: testConversionRate,
        traffic: testImpressions
      }
    };
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      // Test basic database connectivity
      const { error } = await supabase
        .from('events')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('UnifiedEventService health check failed:', error);
      return false;
    }
  }
}
