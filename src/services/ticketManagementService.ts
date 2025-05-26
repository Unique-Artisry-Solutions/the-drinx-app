
import { supabase } from '@/integrations/supabase/client';
import { 
  TicketPurchase, 
  TicketTransfer, 
  TicketRefund, 
  TicketCancellationPolicy,
  TicketInventory,
  TicketTransactionHistory,
  TicketPricingTier,
  BulkTicketOperation,
  RefundCalculation
} from '@/types/TicketManagementTypes';
import { 
  safeJsonToStringArray, 
  safeJsonToRecord,
  convertToTransferStatus,
  convertToRefundStatus,
  convertToPaymentStatus,
  convertToTicketStatus,
  convertToTransactionType
} from '@/utils/ticketTypeGuards';

export class TicketManagementService {
  // Get ticket purchases with flexible parameters
  static async getTicketPurchases(params?: {
    eventId?: string;
    swigCircuitId?: string;
    userId?: string;
    status?: string;
  }): Promise<TicketPurchase[]> {
    let query = supabase
      .from('ticket_purchases')
      .select('*');

    if (params?.eventId) {
      query = query.eq('event_id', params.eventId);
    }
    if (params?.swigCircuitId) {
      query = query.eq('swig_circuit_id', params.swigCircuitId);
    }
    if (params?.userId) {
      query = query.eq('user_id', params.userId);
    }
    if (params?.status) {
      query = query.eq('status', params.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch ticket purchases: ${error.message}`);

    return data?.map(purchase => ({
      ...purchase,
      purchase_details: safeJsonToRecord(purchase.purchase_details),
      payment_status: convertToPaymentStatus(purchase.payment_status),
      status: convertToTicketStatus(purchase.status)
    })) || [];
  }

  // Initiate ticket transfer
  static async initiateTicketTransfer(ticketId: string, toEmail: string): Promise<TicketTransfer> {
    // Generate transfer code
    const transferCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const transferData = {
      ticket_purchase_id: ticketId,
      to_email: toEmail,
      transfer_code: transferCode,
      status: 'pending' as const
    };

    const { data, error } = await supabase
      .from('ticket_transfers')
      .insert([transferData])
      .select()
      .single();

    if (error) throw new Error(`Failed to initiate transfer: ${error.message}`);

    return {
      ...data,
      status: convertToTransferStatus(data.status)
    };
  }

  // Accept ticket transfer
  static async acceptTicketTransfer(transferCode: string): Promise<void> {
    const { data: session } = await supabase.auth.getSession();
    const currentUser = session.session?.user;

    if (!currentUser) {
      throw new Error('User must be authenticated to accept transfers');
    }

    const { error } = await supabase
      .from('ticket_transfers')
      .update({
        to_user_id: currentUser.id,
        status: 'completed',
        transferred_at: new Date().toISOString()
      })
      .eq('transfer_code', transferCode)
      .eq('status', 'pending');

    if (error) throw new Error(`Failed to accept transfer: ${error.message}`);
  }

  // Request ticket refund
  static async requestTicketRefund(ticketId: string, reason?: string): Promise<TicketRefund> {
    // Calculate refund amount first
    const refundInfo = await this.calculateRefund(ticketId);

    const refundData = {
      ticket_purchase_id: ticketId,
      refund_amount: refundInfo.refund_amount,
      processing_fee: refundInfo.processing_fee,
      refund_reason: reason,
      status: 'pending' as const
    };

    const { data, error } = await supabase
      .from('ticket_refunds')
      .insert([refundData])
      .select()
      .single();

    if (error) throw new Error(`Failed to request refund: ${error.message}`);

    return {
      ...data,
      status: convertToRefundStatus(data.status)
    };
  }

  // Calculate refund amount
  static async calculateRefund(ticketId: string): Promise<RefundCalculation> {
    const { data, error } = await supabase.rpc('calculate_refund_amount', {
      p_ticket_purchase_id: ticketId
    });

    if (error) throw new Error(`Failed to calculate refund: ${error.message}`);

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No refund calculation data returned');
    }

    const result = data[0];
    
    return {
      refund_amount: result.refund_amount || 0,
      processing_fee: result.processing_fee || 0,
      refund_percentage: result.refund_percentage || 0
    };
  }

  // Process ticket refund (admin only)
  static async processTicketRefund(refundId: string, approved: boolean): Promise<void> {
    const { error } = await supabase
      .from('ticket_refunds')
      .update({
        status: approved ? 'processed' : 'failed',
        processed_at: new Date().toISOString()
      })
      .eq('id', refundId);

    if (error) throw new Error(`Failed to process refund: ${error.message}`);
  }

  // Get ticket history
  static async getTicketHistory(ticketId: string): Promise<TicketTransactionHistory[]> {
    const { data, error } = await supabase
      .from('ticket_transaction_history')
      .select('*')
      .eq('ticket_purchase_id', ticketId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch ticket history: ${error.message}`);

    return data?.map(transaction => ({
      ...transaction,
      transaction_type: convertToTransactionType(transaction.transaction_type),
      transaction_data: safeJsonToRecord(transaction.transaction_data)
    })) || [];
  }

  // Get ticket inventory
  static async getTicketInventory(eventId?: string, swigCircuitId?: string): Promise<TicketInventory[]> {
    let query = supabase
      .from('ticket_inventory')
      .select('*');

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch inventory: ${error.message}`);
    return data || [];
  }

  // Perform bulk operations
  static async performBulkOperation(operation: BulkTicketOperation): Promise<Array<{id: string, success: boolean, error?: string}>> {
    const results = [];

    for (const ticketId of operation.ticket_ids) {
      try {
        switch (operation.operation) {
          case 'cancel':
            await supabase
              .from('ticket_purchases')
              .update({ status: 'cancelled' })
              .eq('id', ticketId);
            results.push({ id: ticketId, success: true });
            break;

          case 'refund':
            await this.requestTicketRefund(ticketId, 'Bulk refund operation');
            results.push({ id: ticketId, success: true });
            break;

          case 'update_status':
            const newStatus = operation.parameters?.status || 'cancelled';
            await supabase
              .from('ticket_purchases')
              .update({ status: newStatus })
              .eq('id', ticketId);
            results.push({ id: ticketId, success: true });
            break;

          default:
            results.push({ id: ticketId, success: false, error: 'Unknown operation' });
        }
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

  // Get cancellation policies
  static async getCancellationPolicies(eventId?: string, swigCircuitId?: string): Promise<TicketCancellationPolicy[]> {
    let query = supabase
      .from('ticket_cancellation_policies')
      .select('*');

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query.eq('is_active', true);

    if (error) throw new Error(`Failed to fetch policies: ${error.message}`);
    return data || [];
  }

  // Create cancellation policy
  static async createCancellationPolicy(policy: Omit<TicketCancellationPolicy, 'id' | 'created_at'>): Promise<TicketCancellationPolicy> {
    const { data, error } = await supabase
      .from('ticket_cancellation_policies')
      .insert([policy])
      .select()
      .single();

    if (error) throw new Error(`Failed to create policy: ${error.message}`);
    return data;
  }

  // Calculate refund with event date
  static async calculateRefundWithEventDate(ticketId: string, eventDate?: string): Promise<RefundCalculation> {
    const { data, error } = await supabase.rpc('calculate_refund_amount', {
      p_ticket_purchase_id: ticketId,
      p_event_date: eventDate
    });

    if (error) throw new Error(`Failed to calculate refund: ${error.message}`);

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No refund calculation data returned');
    }

    const result = data[0];
    
    return {
      refund_amount: result.refund_amount || 0,
      processing_fee: result.processing_fee || 0,
      refund_percentage: result.refund_percentage || 0
    };
  }

  // Get pricing tiers
  static async getPricingTiers(eventId?: string, swigCircuitId?: string): Promise<TicketPricingTier[]> {
    let query = supabase
      .from('ticket_pricing_tiers')
      .select('*');

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query
      .eq('is_active', true)
      .order('tier_order');

    if (error) throw new Error(`Failed to fetch pricing tiers: ${error.message}`);

    return data?.map(tier => ({
      ...tier,
      tier_benefits: safeJsonToStringArray(tier.tier_benefits)
    })) || [];
  }

  // Get current ticket prices
  static async getCurrentTicketPrices(eventId?: string, swigCircuitId?: string): Promise<any[]> {
    const { data, error } = await supabase.rpc('get_current_ticket_price', {
      p_event_id: eventId || null,
      p_swig_circuit_id: swigCircuitId || null
    });

    if (error) throw new Error(`Failed to get current prices: ${error.message}`);
    return data || [];
  }

  // Create pricing tier
  static async createPricingTier(tier: Omit<TicketPricingTier, 'id' | 'created_at' | 'updated_at'>): Promise<TicketPricingTier> {
    const { data, error } = await supabase
      .from('ticket_pricing_tiers')
      .insert([tier])
      .select()
      .single();

    if (error) throw new Error(`Failed to create pricing tier: ${error.message}`);
    return data;
  }

  // Update pricing tier
  static async updatePricingTier(id: string, updates: Partial<TicketPricingTier>): Promise<TicketPricingTier> {
    const { data, error } = await supabase
      .from('ticket_pricing_tiers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update pricing tier: ${error.message}`);
    return data;
  }

  // Delete pricing tier
  static async deletePricingTier(id: string): Promise<void> {
    const { error } = await supabase
      .from('ticket_pricing_tiers')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw new Error(`Failed to delete pricing tier: ${error.message}`);
  }
}
