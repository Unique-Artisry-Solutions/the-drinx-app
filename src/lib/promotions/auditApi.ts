
import { supabase } from '@/integrations/supabase/client';

export interface PromotionAuditLog {
  id: string;
  promotion_id: string;
  user_id?: string;
  action_type: 'create' | 'update' | 'redeem' | 'delete' | 'validate' | 'automatic_apply' | 'batch_create';
  status: string;
  metadata?: Record<string, any>;
  created_at: string;
  ip_address?: string;
  details?: string;
}

export interface PromotionUsageAnalytics {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  establishment_id: string;
  redemption_count: number;
  unique_users: number;
  avg_purchase_amount?: number | null;
  total_discount_amount?: number | null;
  successful_validations: number;
  failed_validations: number;
  auto_applied_count: number;
}

/**
 * Logs a promotion code action to the audit log
 */
export async function logPromotionAction(
  promotion_id: string,
  action_type: PromotionAuditLog['action_type'],
  options: {
    userId?: string;
    status?: string;
    metadata?: Record<string, any>;
    details?: string;
  } = {}
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('promotion_audit_logs')
      .insert({
        promotion_id,
        user_id: options.userId,
        action_type,
        status: options.status || 'success',
        metadata: options.metadata || {},
        details: options.details
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error logging promotion action:', error);
      return null;
    }

    return data.id;
  } catch (err) {
    console.error('Exception logging promotion action:', err);
    return null;
  }
}

/**
 * Get usage analytics for a specific promotion
 */
export async function getPromotionUsageAnalytics(promotionId: string): Promise<PromotionUsageAnalytics | null> {
  try {
    const { data, error } = await supabase
      .from('promotion_usage_analytics')
      .select('*')
      .eq('id', promotionId)
      .single();

    if (error) {
      console.error('Error fetching promotion analytics:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching promotion analytics:', err);
    return null;
  }
}

/**
 * Get audit logs for a specific promotion
 */
export async function getPromotionAuditLogs(
  promotionId: string,
  options: {
    limit?: number;
    offset?: number;
    actionTypes?: string[];
  } = {}
): Promise<PromotionAuditLog[]> {
  try {
    let query = supabase
      .from('promotion_audit_logs')
      .select('*')
      .eq('promotion_id', promotionId)
      .order('created_at', { ascending: false });

    if (options.actionTypes && options.actionTypes.length > 0) {
      query = query.in('action_type', options.actionTypes);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching promotion audit logs:', error);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Exception fetching promotion audit logs:', err);
    return [];
  }
}

/**
 * Get all audit logs for an establishment's promotions
 */
export async function getEstablishmentPromotionAuditLogs(
  establishmentId: string,
  options: {
    limit?: number;
    offset?: number;
    actionTypes?: string[];
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<PromotionAuditLog[]> {
  try {
    // First, get all promotion IDs for the establishment
    const { data: promotions, error: promoError } = await supabase
      .from('establishment_promotions')
      .select('id')
      .eq('establishment_id', establishmentId);

    if (promoError || !promotions?.length) {
      console.error('Error fetching establishment promotions:', promoError);
      return [];
    }

    const promotionIds = promotions.map(p => p.id);

    // Then fetch audit logs for those promotions
    let query = supabase
      .from('promotion_audit_logs')
      .select(`
        *,
        establishment_promotions:promotion_id (
          code,
          discount_type,
          discount_value
        )
      `)
      .in('promotion_id', promotionIds)
      .order('created_at', { ascending: false });

    if (options.actionTypes && options.actionTypes.length > 0) {
      query = query.in('action_type', options.actionTypes);
    }

    if (options.startDate) {
      query = query.gte('created_at', options.startDate);
    }

    if (options.endDate) {
      query = query.lte('created_at', options.endDate);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching establishment promotion audit logs:', error);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Exception fetching establishment promotion audit logs:', err);
    return [];
  }
}
