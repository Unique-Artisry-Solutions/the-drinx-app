
import { supabase } from '@/integrations/supabase/client';
import { 
  TicketPurchase, 
  TicketTransfer, 
  TicketRefund, 
  TicketTransactionHistory,
  TicketPricingTier,
  TicketInventory,
  TicketCancellationPolicy,
  BulkTicketOperation,
  RefundCalculation
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
  // Get ticket purchase history for a specific ticket
  static async getTicketHistory(ticketId: string): Promise<TicketTransactionHistory[]> {
    const { data, error } = await supabase
      .from('ticket_transaction_history')
      .select('*')
      .eq('ticket_purchase_id', ticketId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      ticket_purchase_id: item.ticket_purchase_id,
      transaction_type: convertToTransactionType(item.transaction_type),
      from_status: item.from_status || undefined,
      to_status: item.to_status || undefined,
      performed_by: item.performed_by || undefined,
      transaction_data: safeJsonToRecord(item.transaction_data),
      notes: item.notes || undefined,
      created_at: item.created_at
    }));
  }

  // Get current pricing for tickets
  static async getCurrentPricing(eventId?: string, swigCircuitId?: string): Promise<TicketPricingTier[]> {
    const { data, error } = await supabase
      .rpc('get_current_ticket_price', {
        p_event_id: eventId || null,
        p_swig_circuit_id: swigCircuitId || null
      });

    if (error) throw error;

    return data.map(item => ({
      id: item.tier_id,
      event_id: eventId || undefined,
      swig_circuit_id: swigCircuitId || undefined,
      tier_name: item.tier_name,
      base_price: item.base_price,
      tier_order: 1,
      valid_from: new Date().toISOString(),
      valid_until: undefined,
      max_quantity: item.remaining_quantity || undefined,
      sold_quantity: 0,
      is_early_bird: item.is_early_bird,
      early_bird_discount_percentage: 0,
      early_bird_discount_amount: item.discount_amount,
      early_bird_end_date: undefined,
      tier_benefits: [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  // Get all pricing tiers for an event or swig circuit
  static async getPricingTiers(eventId?: string, swigCircuitId?: string): Promise<TicketPricingTier[]> {
    let query = supabase.from('ticket_pricing_tiers').select('*');
    
    if (eventId) {
      query = query.eq('event_id', eventId);
    } else if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query.order('tier_order');

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      event_id: item.event_id || undefined,
      swig_circuit_id: item.swig_circuit_id || undefined,
      tier_name: item.tier_name,
      base_price: item.base_price,
      tier_order: item.tier_order,
      valid_from: item.valid_from,
      valid_until: item.valid_until || undefined,
      max_quantity: item.max_quantity || undefined,
      sold_quantity: item.sold_quantity || 0,
      is_early_bird: item.is_early_bird || false,
      early_bird_discount_percentage: item.early_bird_discount_percentage || 0,
      early_bird_discount_amount: item.early_bird_discount_amount || 0,
      early_bird_end_date: item.early_bird_end_date || undefined,
      tier_benefits: safeJsonToStringArray(item.tier_benefits),
      is_active: item.is_active || true,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  }

  // Initiate ticket transfer
  static async initiateTicketTransfer(ticketId: string, toEmail: string): Promise<TicketTransfer> {
    const transferCode = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // 24 hours

    const { data, error } = await supabase
      .from('ticket_transfers')
      .insert({
        ticket_purchase_id: ticketId,
        to_email: toEmail,
        transfer_code: transferCode,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      ticket_purchase_id: data.ticket_purchase_id,
      from_user_id: data.from_user_id || undefined,
      to_user_id: data.to_user_id || undefined,
      to_email: data.to_email,
      transfer_code: data.transfer_code,
      status: convertToTransferStatus(data.status),
      expires_at: data.expires_at || undefined,
      transferred_at: data.transferred_at || undefined,
      created_at: data.created_at
    };
  }

  // Accept ticket transfer
  static async acceptTicketTransfer(transferCode: string): Promise<TicketTransfer> {
    const { data, error } = await supabase
      .from('ticket_transfers')
      .update({ 
        status: 'completed',
        transferred_at: new Date().toISOString()
      })
      .eq('transfer_code', transferCode)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      ticket_purchase_id: data.ticket_purchase_id,
      from_user_id: data.from_user_id || undefined,
      to_user_id: data.to_user_id || undefined,
      to_email: data.to_email,
      transfer_code: data.transfer_code,
      status: convertToTransferStatus(data.status),
      expires_at: data.expires_at || undefined,
      transferred_at: data.transferred_at || undefined,
      created_at: data.created_at
    };
  }

  // Request ticket refund
  static async requestTicketRefund(ticketId: string, reason?: string): Promise<TicketRefund> {
    const { data, error } = await supabase
      .from('ticket_refunds')
      .insert({
        ticket_purchase_id: ticketId,
        refund_reason: reason,
        status: 'pending',
        refund_amount: 0, // Will be calculated by admin
        processing_fee: 0
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      ticket_purchase_id: data.ticket_purchase_id,
      refund_amount: data.refund_amount,
      refund_reason: data.refund_reason || undefined,
      processing_fee: data.processing_fee,
      status: convertToRefundStatus(data.status),
      processed_at: data.processed_at || undefined,
      processed_by: data.processed_by || undefined,
      created_at: data.created_at
    };
  }

  // Process ticket refund (admin only)
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

    if (error) throw error;

    return {
      id: data.id,
      ticket_purchase_id: data.ticket_purchase_id,
      refund_amount: data.refund_amount,
      refund_reason: data.refund_reason || undefined,
      processing_fee: data.processing_fee,
      status: convertToRefundStatus(data.status),
      processed_at: data.processed_at || undefined,
      processed_by: data.processed_by || undefined,
      created_at: data.created_at
    };
  }

  // Get ticket inventory
  static async getTicketInventory(): Promise<TicketInventory[]> {
    const { data, error } = await supabase
      .from('ticket_inventory')
      .select('*')
      .order('last_updated', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      event_id: item.event_id || undefined,
      swig_circuit_id: item.swig_circuit_id || undefined,
      ticket_type_id: item.ticket_type_id || undefined,
      total_quantity: item.total_quantity,
      sold_quantity: item.sold_quantity || 0,
      reserved_quantity: item.reserved_quantity || 0,
      available_quantity: item.available_quantity || 0,
      last_updated: item.last_updated || new Date().toISOString()
    }));
  }

  // Get ticket purchases with filters
  static async getTicketPurchases(filters: {
    eventId?: string;
    swigCircuitId?: string;
    userId?: string;
  }): Promise<TicketPurchase[]> {
    let query = supabase.from('ticket_purchases').select('*');

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

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      user_id: item.user_id || undefined,
      event_id: item.event_id || undefined,
      swig_circuit_id: item.swig_circuit_id || undefined,
      ticket_type_id: item.ticket_type_id || undefined,
      ticket_type: item.ticket_type,
      quantity: item.quantity,
      price_per_ticket: item.price_per_ticket,
      total_amount: item.total_amount,
      service_fee: item.service_fee || 0,
      service_fee_percentage: item.service_fee_percentage || 0,
      contact_name: item.contact_name,
      contact_email: item.contact_email,
      payment_status: convertToPaymentStatus(item.payment_status),
      status: convertToTicketStatus(item.status),
      ticket_code: item.ticket_code || undefined,
      purchase_details: safeJsonToRecord(item.purchase_details),
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString()
    }));
  }

  // Perform bulk operations on tickets
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
            break;
          case 'refund':
            await this.requestTicketRefund(ticketId, 'Bulk refund operation');
            break;
          case 'update_status':
            await supabase
              .from('ticket_purchases')
              .update({ status: operation.parameters?.status || 'purchased' })
              .eq('id', ticketId);
            break;
          default:
            throw new Error(`Unsupported operation: ${operation.operation}`);
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

  // Get cancellation policies
  static async getCancellationPolicies(eventId?: string, swigCircuitId?: string): Promise<TicketCancellationPolicy[]> {
    let query = supabase.from('ticket_cancellation_policies').select('*');

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query.eq('is_active', true).order('days_before_event');

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      event_id: item.event_id || undefined,
      swig_circuit_id: item.swig_circuit_id || undefined,
      days_before_event: item.days_before_event,
      refund_percentage: item.refund_percentage,
      processing_fee: item.processing_fee || 0,
      is_active: item.is_active || true,
      created_at: item.created_at || new Date().toISOString()
    }));
  }

  // Create cancellation policy
  static async createCancellationPolicy(policy: Omit<TicketCancellationPolicy, 'id' | 'created_at'>): Promise<TicketCancellationPolicy> {
    const { data, error } = await supabase
      .from('ticket_cancellation_policies')
      .insert(policy)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      event_id: data.event_id || undefined,
      swig_circuit_id: data.swig_circuit_id || undefined,
      days_before_event: data.days_before_event,
      refund_percentage: data.refund_percentage,
      processing_fee: data.processing_fee || 0,
      is_active: data.is_active || true,
      created_at: data.created_at || new Date().toISOString()
    };
  }

  // Calculate refund amount
  static async calculateRefund(ticketId: string, eventDate?: string): Promise<RefundCalculation> {
    const { data, error } = await supabase
      .rpc('calculate_refund_amount', {
        p_ticket_purchase_id: ticketId,
        p_event_date: eventDate || null
      });

    if (error) throw error;

    return {
      refund_amount: data[0].refund_amount,
      processing_fee: data[0].processing_fee,
      refund_percentage: data[0].refund_percentage
    };
  }
}
