
import { supabase } from '@/lib/supabase';
import { 
  TicketPurchase, 
  TicketTransfer, 
  TicketRefund,
  TicketInventory,
  TicketCancellationPolicy,
  BulkTicketOperation,
  RefundCalculation,
  TicketPriceInfo,
  TicketPricingTier,
  TicketTransactionHistory
} from '@/types/TicketManagementTypes';
import {
  mapTicketPurchaseFromDb,
  mapTicketTransferFromDb,
  mapTicketRefundFromDb,
  mapTicketPricingTierFromDb,
  mapTicketTransactionHistoryFromDb,
  prepareTicketRefundForDb
} from '@/utils/ticketDataMappers';

export class TicketManagementService {
  // Get current ticket pricing information
  static async getCurrentTicketPrice(
    eventId?: string,
    swigCircuitId?: string,
    ticketTypeId?: string
  ): Promise<TicketPriceInfo[]> {
    const { data, error } = await supabase.rpc('get_current_ticket_price', {
      p_event_id: eventId || null,
      p_swig_circuit_id: swigCircuitId || null,
      p_ticket_type_id: ticketTypeId || null
    });

    if (error) {
      console.error('Error fetching current ticket prices:', error);
      throw new Error(error.message);
    }

    return (data || []).map((item: any): TicketPriceInfo => ({
      tier_id: item.tier_id,
      tier_name: item.tier_name,
      current_price: item.current_price,
      base_price: item.base_price,
      discount_amount: item.discount_amount,
      is_early_bird: item.is_early_bird,
      remaining_quantity: item.remaining_quantity
    }));
  }

  // Get ticket purchases with type-safe mapping
  static async getTicketPurchases(filters: {
    eventId?: string;
    swigCircuitId?: string;
    userId?: string;
  }): Promise<TicketPurchase[]> {
    let query = supabase
      .from('ticket_purchases')
      .select('*');

    if (filters.eventId) {
      query = query.eq('event_id', filters.eventId);
    }
    if (filters.swigCircuitId) {
      query = query.eq('swig_circuit_id', filters.swigCircuitId);
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ticket purchases:', error);
      throw new Error(error.message);
    }

    return (data || []).map(mapTicketPurchaseFromDb);
  }

  // Get ticket inventory
  static async getTicketInventory(filters?: {
    eventId?: string;
    swigCircuitId?: string;
  }): Promise<TicketInventory[]> {
    let query = supabase
      .from('ticket_inventory')
      .select('*');

    if (filters?.eventId) {
      query = query.eq('event_id', filters.eventId);
    }
    if (filters?.swigCircuitId) {
      query = query.eq('swig_circuit_id', filters.swigCircuitId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ticket inventory:', error);
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get ticket transaction history
  static async getTicketHistory(ticketId: string): Promise<TicketTransactionHistory[]> {
    const { data, error } = await supabase
      .from('ticket_transaction_history')
      .select('*')
      .eq('ticket_purchase_id', ticketId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ticket history:', error);
      throw new Error(error.message);
    }

    return (data || []).map(mapTicketTransactionHistoryFromDb);
  }

  // Get pricing tiers
  static async getPricingTiers(filters?: {
    eventId?: string;
    swigCircuitId?: string;
  }): Promise<TicketPricingTier[]> {
    let query = supabase
      .from('ticket_pricing_tiers')
      .select('*')
      .eq('is_active', true);

    if (filters?.eventId) {
      query = query.eq('event_id', filters.eventId);
    }
    if (filters?.swigCircuitId) {
      query = query.eq('swig_circuit_id', filters.swigCircuitId);
    }

    const { data, error } = await query.order('tier_order', { ascending: true });

    if (error) {
      console.error('Error fetching pricing tiers:', error);
      throw new Error(error.message);
    }

    return (data || []).map(mapTicketPricingTierFromDb);
  }

  // Transfer ticket with type-safe mapping
  static async initiateTicketTransfer(ticketId: string, toEmail: string): Promise<TicketTransfer> {
    const transferCode = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

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

    if (error) {
      console.error('Error initiating ticket transfer:', error);
      throw new Error(error.message);
    }

    return mapTicketTransferFromDb(data);
  }

  // Accept ticket transfer with type-safe mapping
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

    if (error) {
      console.error('Error accepting ticket transfer:', error);
      throw new Error(error.message);
    }

    return mapTicketTransferFromDb(data);
  }

  // Request ticket refund with proper data preparation
  static async requestTicketRefund(ticketId: string, reason?: string): Promise<TicketRefund> {
    const refundData = prepareTicketRefundForDb(ticketId, reason);
    
    const { data, error } = await supabase
      .from('ticket_refunds')
      .insert(refundData)
      .select()
      .single();

    if (error) {
      console.error('Error requesting ticket refund:', error);
      throw new Error(error.message);
    }

    return mapTicketRefundFromDb(data);
  }

  // Process ticket refund with type-safe mapping
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

    if (error) {
      console.error('Error processing ticket refund:', error);
      throw new Error(error.message);
    }

    return mapTicketRefundFromDb(data);
  }

  // Calculate refund amount
  static async calculateRefund(ticketPurchaseId: string, eventDate?: string): Promise<RefundCalculation> {
    const { data, error } = await supabase.rpc('calculate_refund_amount', {
      p_ticket_purchase_id: ticketPurchaseId,
      p_event_date: eventDate || null
    });

    if (error) {
      console.error('Error calculating refund:', error);
      throw new Error(error.message);
    }

    return data[0] || {
      refund_amount: 0,
      processing_fee: 0,
      refund_percentage: 0
    };
  }

  // Perform bulk operation
  static async performBulkOperation(operation: BulkTicketOperation): Promise<Array<{success: boolean, ticketId: string, error?: string}>> {
    const results = [];

    for (const ticketId of operation.ticket_ids) {
      try {
        switch (operation.operation) {
          case 'transfer':
            await this.initiateTicketTransfer(ticketId, operation.parameters?.toEmail);
            break;
          case 'refund':
            await this.requestTicketRefund(ticketId, operation.parameters?.reason);
            break;
          case 'cancel':
            await supabase
              .from('ticket_purchases')
              .update({ status: 'cancelled' })
              .eq('id', ticketId);
            break;
          case 'update_status':
            await supabase
              .from('ticket_purchases')
              .update({ status: operation.parameters?.status })
              .eq('id', ticketId);
            break;
        }
        results.push({ success: true, ticketId });
      } catch (error) {
        results.push({ 
          success: false, 
          ticketId, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return results;
  }

  // Get cancellation policies
  static async getCancellationPolicies(filters?: {
    eventId?: string;
    swigCircuitId?: string;
  }): Promise<TicketCancellationPolicy[]> {
    let query = supabase
      .from('ticket_cancellation_policies')
      .select('*')
      .eq('is_active', true);

    if (filters?.eventId) {
      query = query.eq('event_id', filters.eventId);
    }
    if (filters?.swigCircuitId) {
      query = query.eq('swig_circuit_id', filters.swigCircuitId);
    }

    const { data, error } = await query.order('days_before_event', { ascending: false });

    if (error) {
      console.error('Error fetching cancellation policies:', error);
      throw new Error(error.message);
    }

    return data || [];
  }

  // Create cancellation policy
  static async createCancellationPolicy(policy: Omit<TicketCancellationPolicy, 'id' | 'created_at'>): Promise<TicketCancellationPolicy> {
    const { data, error } = await supabase
      .from('ticket_cancellation_policies')
      .insert(policy)
      .select()
      .single();

    if (error) {
      console.error('Error creating cancellation policy:', error);
      throw new Error(error.message);
    }

    return data;
  }
}
