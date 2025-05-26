
import { supabase } from '@/integrations/supabase/client';
import { 
  TicketPurchase, 
  TicketTransactionHistory, 
  TicketPricingTier, 
  TicketPriceInfo,
  TicketTransfer,
  TicketRefund,
  TicketCancellationPolicy,
  TicketInventory,
  BulkTicketOperation,
  RefundCalculation
} from '@/types/TicketManagementTypes';

export class TicketManagementService {
  // Ticket Status Management
  static async updateTicketStatus(
    ticketId: string, 
    newStatus: 'purchased' | 'used' | 'cancelled' | 'transferred' | 'refunded',
    performedBy?: string,
    notes?: string
  ) {
    const { data, error } = await supabase
      .from('ticket_purchases')
      .update({ status: newStatus })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update ticket status: ${error.message}`);

    // Log the transaction if needed (trigger will handle automatic logging)
    if (notes) {
      await this.logTicketTransaction(ticketId, 'status_change', {
        notes,
        performed_by: performedBy
      });
    }

    return data;
  }

  // Transaction History
  static async logTicketTransaction(
    ticketId: string,
    transactionType: 'purchase' | 'use' | 'cancel' | 'transfer' | 'refund' | 'status_change',
    data: {
      from_status?: string;
      to_status?: string;
      performed_by?: string;
      transaction_data?: any;
      notes?: string;
    }
  ) {
    const { data: result, error } = await supabase
      .from('ticket_transaction_history')
      .insert({
        ticket_purchase_id: ticketId,
        transaction_type: transactionType,
        ...data
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to log transaction: ${error.message}`);
    return result;
  }

  static async getTicketHistory(ticketId: string): Promise<TicketTransactionHistory[]> {
    const { data, error } = await supabase
      .from('ticket_transaction_history')
      .select('*')
      .eq('ticket_purchase_id', ticketId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch ticket history: ${error.message}`);
    return data || [];
  }

  // Pricing Tiers
  static async createPricingTier(tier: Omit<TicketPricingTier, 'id' | 'created_at' | 'updated_at'>): Promise<TicketPricingTier> {
    const { data, error } = await supabase
      .from('ticket_pricing_tiers')
      .insert(tier)
      .select()
      .single();

    if (error) throw new Error(`Failed to create pricing tier: ${error.message}`);
    return data;
  }

  static async getCurrentTicketPrices(
    eventId?: string,
    swigCircuitId?: string,
    ticketTypeId?: string
  ): Promise<TicketPriceInfo[]> {
    const { data, error } = await supabase.rpc('get_current_ticket_price', {
      p_event_id: eventId || null,
      p_swig_circuit_id: swigCircuitId || null,
      p_ticket_type_id: ticketTypeId || null
    });

    if (error) throw new Error(`Failed to get current prices: ${error.message}`);
    return data || [];
  }

  static async getPricingTiers(eventId?: string, swigCircuitId?: string): Promise<TicketPricingTier[]> {
    let query = supabase
      .from('ticket_pricing_tiers')
      .select('*')
      .eq('is_active', true);

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query.order('tier_order');

    if (error) throw new Error(`Failed to fetch pricing tiers: ${error.message}`);
    return data || [];
  }

  static async updatePricingTier(tierId: string, updates: Partial<TicketPricingTier>): Promise<TicketPricingTier> {
    const { data, error } = await supabase
      .from('ticket_pricing_tiers')
      .update(updates)
      .eq('id', tierId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update pricing tier: ${error.message}`);
    return data;
  }

  // Ticket Transfers
  static async initiateTicketTransfer(ticketId: string, toEmail: string): Promise<TicketTransfer> {
    const transferCode = `TXF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { data, error } = await supabase
      .from('ticket_transfers')
      .insert({
        ticket_purchase_id: ticketId,
        to_email: toEmail,
        transfer_code: transferCode,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to initiate transfer: ${error.message}`);

    // Update ticket status
    await this.updateTicketStatus(ticketId, 'transferred');

    return data;
  }

  static async acceptTicketTransfer(transferCode: string): Promise<TicketTransfer> {
    const { data, error } = await supabase
      .from('ticket_transfers')
      .update({
        status: 'completed',
        transferred_at: new Date().toISOString()
      })
      .eq('transfer_code', transferCode)
      .eq('status', 'pending')
      .select()
      .single();

    if (error) throw new Error(`Failed to accept transfer: ${error.message}`);
    return data;
  }

  // Ticket Refunds
  static async requestTicketRefund(ticketId: string, reason?: string): Promise<TicketRefund> {
    const refundCalculation = await this.calculateRefund(ticketId);

    const { data, error } = await supabase
      .from('ticket_refunds')
      .insert({
        ticket_purchase_id: ticketId,
        refund_amount: refundCalculation.refund_amount,
        processing_fee: refundCalculation.processing_fee,
        refund_reason: reason,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to request refund: ${error.message}`);

    // Log the refund request
    await this.logTicketTransaction(ticketId, 'refund', {
      transaction_data: { refund_amount: refundCalculation.refund_amount },
      notes: reason
    });

    return data;
  }

  static async processTicketRefund(refundId: string, approved: boolean): Promise<TicketRefund> {
    const { data, error } = await supabase
      .from('ticket_refunds')
      .update({
        status: approved ? 'processed' : 'failed',
        processed_at: new Date().toISOString()
      })
      .eq('id', refundId)
      .select()
      .single();

    if (error) throw new Error(`Failed to process refund: ${error.message}`);

    if (approved) {
      // Update ticket status to refunded
      await this.updateTicketStatus(data.ticket_purchase_id, 'refunded');
    }

    return data;
  }

  static async calculateRefund(ticketId: string): Promise<RefundCalculation> {
    const { data, error } = await supabase.rpc('calculate_refund_amount', {
      p_ticket_purchase_id: ticketId
    });

    if (error) throw new Error(`Failed to calculate refund: ${error.message}`);
    return data[0];
  }

  // Inventory Management
  static async getTicketInventory(eventId?: string, swigCircuitId?: string): Promise<TicketInventory[]> {
    let query = supabase.from('ticket_inventory').select('*');

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query.order('last_updated', { ascending: false });

    if (error) throw new Error(`Failed to fetch inventory: ${error.message}`);
    return data || [];
  }

  // Bulk Operations
  static async performBulkOperation(operation: BulkTicketOperation): Promise<any[]> {
    const results = [];

    for (const ticketId of operation.ticket_ids) {
      try {
        let result;
        switch (operation.operation) {
          case 'cancel':
            result = await this.updateTicketStatus(ticketId, 'cancelled', 
              operation.parameters?.performed_by, operation.parameters?.reason);
            break;
          case 'refund':
            result = await this.requestTicketRefund(ticketId, operation.parameters?.reason);
            break;
          case 'transfer':
            result = await this.initiateTicketTransfer(ticketId, operation.parameters?.to_email);
            break;
          case 'update_status':
            result = await this.updateTicketStatus(ticketId, operation.parameters?.status,
              operation.parameters?.performed_by, operation.parameters?.notes);
            break;
          default:
            throw new Error(`Unknown operation: ${operation.operation}`);
        }
        results.push({ ticketId, success: true, data: result });
      } catch (error) {
        results.push({ ticketId, success: false, error: (error as Error).message });
      }
    }

    return results;
  }

  // Ticket Purchases
  static async getTicketPurchases(userId?: string): Promise<TicketPurchase[]> {
    let query = supabase.from('ticket_purchases').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch ticket purchases: ${error.message}`);
    return data || [];
  }

  // Cancellation Policies
  static async getCancellationPolicies(eventId?: string, swigCircuitId?: string): Promise<TicketCancellationPolicy[]> {
    let query = supabase.from('ticket_cancellation_policies').select('*').eq('is_active', true);

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query.order('days_before_event', { ascending: false });

    if (error) throw new Error(`Failed to fetch cancellation policies: ${error.message}`);
    return data || [];
  }

  static async createCancellationPolicy(policy: Omit<TicketCancellationPolicy, 'id' | 'created_at'>): Promise<TicketCancellationPolicy> {
    const { data, error } = await supabase
      .from('ticket_cancellation_policies')
      .insert(policy)
      .select()
      .single();

    if (error) throw new Error(`Failed to create cancellation policy: ${error.message}`);
    return data;
  }
}
