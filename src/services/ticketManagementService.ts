import { supabase } from '@/integrations/supabase/client';
import { 
  TicketPurchase, 
  TicketTransactionHistory, 
  TicketPricingTier, 
  TicketTransfer, 
  TicketRefund, 
  TicketCancellationPolicy, 
  TicketInventory, 
  BulkTicketOperation 
} from '@/types/TicketManagementTypes';
import { 
  safeJsonToStringArray, 
  safeJsonToRecord, 
  convertToTransactionType, 
  convertToTransferStatus, 
  convertToRefundStatus, 
  convertToPaymentStatus, 
  convertToTicketStatus 
} from '@/utils/ticketTypeGuards';

export class TicketManagementService {
  static async getTicketPurchases(params: { eventId?: string; swigCircuitId?: string }): Promise<TicketPurchase[]> {
    let query = supabase.from('ticket_purchases').select('*');

    if (params.eventId) {
      query = query.eq('event_id', params.eventId);
    }
    if (params.swigCircuitId) {
      query = query.eq('swig_circuit_id', params.swigCircuitId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data.map(purchase => ({
      ...purchase,
      payment_status: convertToPaymentStatus(purchase.payment_status),
      status: convertToTicketStatus(purchase.status)
    }));
  }

  static async getTicketHistory(ticketId: string): Promise<TicketTransactionHistory[]> {
    const { data, error } = await supabase
      .from('ticket_transaction_history')
      .select('*')
      .eq('ticket_purchase_id', ticketId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(history => ({
      ...history,
      transaction_type: convertToTransactionType(history.transaction_type)
    }));
  }

  static async getTicketInventory(eventId?: string, swigCircuitId?: string): Promise<TicketInventory[]> {
    let query = supabase.from('ticket_inventory').select('*');
    
    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async initiateTicketTransfer(ticketId: string, toEmail: string): Promise<TicketTransfer> {
    const transferCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const { data, error } = await supabase
      .from('ticket_transfers')
      .insert({
        ticket_purchase_id: ticketId,
        to_email: toEmail,
        transfer_code: transferCode,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: convertToTransferStatus(data.status)
    };
  }

  static async acceptTicketTransfer(transferCode: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('ticket_transfers')
      .update({
        to_user_id: user.user.id,
        status: 'completed',
        transferred_at: new Date().toISOString()
      })
      .eq('transfer_code', transferCode);

    if (error) throw error;
  }

  static async requestTicketRefund(ticketId: string, reason?: string): Promise<TicketRefund> {
    const { data, error } = await supabase
      .from('ticket_refunds')
      .insert({
        ticket_purchase_id: ticketId,
        refund_reason: reason,
        refund_amount: 0,
        processing_fee: 0,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: convertToRefundStatus(data.status)
    };
  }

  static async processTicketRefund(refundId: string, approved: boolean): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('ticket_refunds')
      .update({
        status: approved ? 'processed' : 'failed',
        processed_at: new Date().toISOString(),
        processed_by: user.user.id
      })
      .eq('id', refundId);

    if (error) throw error;
  }

  static async performBulkOperation(operation: BulkTicketOperation): Promise<Array<{ id: string; success: boolean; error?: string }>> {
    const results = [];
    
    for (const ticketId of operation.ticket_ids) {
      try {
        switch (operation.operation) {
          case 'cancel':
            await supabase
              .from('ticket_purchases')
              .update({ status: 'cancelled' })
              .eq('id', ticketId);
            break;
          case 'refund':
            await this.requestTicketRefund(ticketId);
            break;
          case 'update_status':
            await supabase
              .from('ticket_purchases')
              .update({ status: operation.parameters?.status || 'cancelled' })
              .eq('id', ticketId);
            break;
        }
        results.push({ id: ticketId, success: true });
      } catch (error) {
        results.push({ 
          id: ticketId, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return results;
  }

  static async getCancellationPolicies(eventId?: string, swigCircuitId?: string): Promise<TicketCancellationPolicy[]> {
    let query = supabase.from('ticket_cancellation_policies').select('*');
    
    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createCancellationPolicy(policy: Omit<TicketCancellationPolicy, 'id' | 'created_at'>): Promise<TicketCancellationPolicy> {
    const { data, error } = await supabase
      .from('ticket_cancellation_policies')
      .insert(policy)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async calculateRefund(ticketPurchaseId: string): Promise<{ refund_amount: number; processing_fee: number; refund_percentage: number }> {
    const { data, error } = await supabase.rpc('calculate_refund_amount', {
      p_ticket_purchase_id: ticketPurchaseId
    });

    if (error) throw error;
    return Array.isArray(data) && data.length > 0 ? data[0] : { refund_amount: 0, processing_fee: 0, refund_percentage: 0 };
  }

  static async getCurrentTicketPrice(eventId?: string, swigCircuitId?: string): Promise<TicketPricingTier[]> {
    const { data, error } = await supabase.rpc('get_current_ticket_price', {
      p_event_id: eventId || null,
      p_swig_circuit_id: swigCircuitId || null
    });

    if (error) throw error;
    
    return (data || []).map((tier: any) => ({
      id: tier.tier_id,
      event_id: eventId,
      swig_circuit_id: swigCircuitId,
      tier_name: tier.tier_name,
      base_price: tier.base_price,
      tier_order: 1,
      valid_from: new Date().toISOString(),
      valid_until: null,
      max_quantity: tier.remaining_quantity,
      sold_quantity: 0,
      is_early_bird: tier.is_early_bird,
      early_bird_discount_percentage: 0,
      early_bird_discount_amount: tier.discount_amount,
      early_bird_end_date: null,
      tier_benefits: [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  static async createPricingTier(tier: Omit<TicketPricingTier, 'id' | 'created_at' | 'updated_at'>): Promise<TicketPricingTier> {
    const { data, error } = await supabase
      .from('ticket_pricing_tiers')
      .insert(tier)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      tier_benefits: safeJsonToStringArray(data.tier_benefits)
    };
  }

  static async updatePricingTier(id: string, updates: Partial<TicketPricingTier>): Promise<TicketPricingTier> {
    const { data, error } = await supabase
      .from('ticket_pricing_tiers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      tier_benefits: safeJsonToStringArray(data.tier_benefits)
    };
  }

  static async getPricingTiers(eventId?: string, swigCircuitId?: string): Promise<TicketPricingTier[]> {
    let query = supabase.from('ticket_pricing_tiers').select('*');
    
    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(tier => ({
      ...tier,
      tier_benefits: safeJsonToStringArray(tier.tier_benefits)
    }));
  }
}
