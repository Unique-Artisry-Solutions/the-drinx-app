import { supabase } from '@/integrations/supabase/client';
import { 
  TicketPurchase, 
  TicketTransactionHistory, 
  TicketTransfer, 
  TicketRefund, 
  BulkTicketOperation,
  TicketCancellationPolicy,
  TicketPricingTier,
  TicketPriceInfo
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
  static async getTicketPurchases(eventId?: string, swigCircuitId?: string, userId?: string): Promise<TicketPurchase[]> {
    let query = supabase
      .from('ticket_purchases')
      .select('*');

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get ticket purchases: ${error.message}`);
    }

    return (data || []).map(purchase => ({
      ...purchase,
      purchase_details: safeJsonToRecord(purchase.purchase_details),
      payment_status: convertToPaymentStatus(purchase.payment_status),
      status: convertToTicketStatus(purchase.status)
    }));
  }

  static async initiateTicketTransfer(ticketId: string, toEmail: string): Promise<TicketTransfer> {
    const { data, error } = await supabase
      .from('ticket_transfers')
      .insert([{
        ticket_purchase_id: ticketId,
        to_email: toEmail,
        status: 'pending'
      }])
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to initiate ticket transfer: ${error.message}`);
    }

    return {
      ...data,
      status: convertToTransferStatus(data.status)
    };
  }

  static async acceptTicketTransfer(transferCode: string): Promise<void> {
    // Get transfer
    const { data: transfer, error: transferError } = await supabase
      .from('ticket_transfers')
      .select('*')
      .eq('transfer_code', transferCode)
      .eq('status', 'pending')
      .single();

    if (transferError) {
      throw new Error(`Invalid transfer code or transfer already processed: ${transferError.message}`);
    }

    // Update ticket purchase
    const { error: purchaseError } = await supabase
      .from('ticket_purchases')
      .update({
        user_id: supabase.auth.user()?.id,
        status: 'transferred'
      })
      .eq('id', transfer.ticket_purchase_id);

    if (purchaseError) {
      throw new Error(`Failed to update ticket purchase: ${purchaseError.message}`);
    }

    // Update transfer status
    const { error: updateError } = await supabase
      .from('ticket_transfers')
      .update({
        status: 'completed',
        transferred_at: new Date().toISOString()
      })
      .eq('transfer_code', transferCode);

    if (updateError) {
      throw new Error(`Failed to update transfer status: ${updateError.message}`);
    }
  }

  static async requestTicketRefund(ticketId: string, reason?: string): Promise<TicketRefund> {
    // Get cancellation policy
    const { data: policy, error: policyError } = await supabase
      .from('ticket_cancellation_policies')
      .select('*')
      .eq('event_id', (await supabase.from('ticket_purchases').select('event_id').eq('id', ticketId).single()).data?.event_id)
      .eq('is_active', true)
      .order('days_before_event', { ascending: false })
      .limit(1)
      .single();

    if (policyError) {
      throw new Error(`Failed to get cancellation policy: ${policyError.message}`);
    }

    // Calculate refund amount
    const { data: refundCalculation, error: refundError } = await supabase.rpc('calculate_refund_amount', {
      p_ticket_id: ticketId,
      p_cancellation_policy_id: policy?.id || null
    });

    if (refundError) {
      throw new Error(`Failed to calculate refund amount: ${refundError.message}`);
    }

    // Create refund request
    const { data, error } = await supabase
      .from('ticket_refunds')
      .insert([{
        ticket_purchase_id: ticketId,
        refund_amount: refundCalculation?.refund_amount || 0,
        refund_reason: reason,
        processing_fee: refundCalculation?.processing_fee || 0,
        status: 'pending'
      }])
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to request ticket refund: ${error.message}`);
    }

    return {
      ...data,
      status: convertToRefundStatus(data.status)
    };
  }

  static async processTicketRefund(refundId: string, approved: boolean): Promise<void> {
    // Get refund
    const { data: refund, error: refundError } = await supabase
      .from('ticket_refunds')
      .select('*')
      .eq('id', refundId)
      .eq('status', 'pending')
      .single();

    if (refundError) {
      throw new Error(`Invalid refund request or refund already processed: ${refundError.message}`);
    }

    let purchaseUpdates: any = {};

    if (approved) {
      purchaseUpdates.status = 'refunded';
    } else {
      purchaseUpdates.status = 'purchased';
    }

    // Update ticket purchase
    const { error: purchaseError } = await supabase
      .from('ticket_purchases')
      .update(purchaseUpdates)
      .eq('id', refund.ticket_purchase_id);

    if (purchaseError) {
      throw new Error(`Failed to update ticket purchase: ${purchaseError.message}`);
    }

    // Update refund status
    const { error: updateError } = await supabase
      .from('ticket_refunds')
      .update({
        status: approved ? 'processed' : 'failed',
        processed_at: new Date().toISOString(),
        processed_by: supabase.auth.user()?.id
      })
      .eq('id', refundId);

    if (updateError) {
      throw new Error(`Failed to update refund status: ${updateError.message}`);
    }
  }

  static async performBulkOperation(operation: BulkTicketOperation): Promise<{ id: string; success: boolean; error?: string; }[]> {
    const results: { id: string; success: boolean; error?: string; }[] = [];

    for (const ticketId of operation.ticket_ids) {
      try {
        switch (operation.operation) {
          case 'transfer':
            // Assuming parameters include 'to_email'
            await this.initiateTicketTransfer(ticketId, operation.parameters?.to_email);
            break;
          case 'refund':
            // Assuming parameters include 'reason'
            await this.requestTicketRefund(ticketId, operation.parameters?.reason);
            break;
          case 'cancel':
            // Update ticket status to 'cancelled'
            await supabase
              .from('ticket_purchases')
              .update({ status: 'cancelled' })
              .eq('id', ticketId);
            break;
          case 'update_status':
            // Assuming parameters include 'status'
            const newStatus = operation.parameters?.status;
            if (newStatus) {
              await supabase
                .from('ticket_purchases')
                .update({ status: newStatus })
                .eq('id', ticketId);
            }
            break;
          default:
            throw new Error(`Unsupported operation: ${operation.operation}`);
        }
        results.push({ id: ticketId, success: true });
      } catch (error: any) {
        results.push({ id: ticketId, success: false, error: error.message });
      }
    }

    return results;
  }

  static async getCancellationPolicies(eventId?: string, swigCircuitId?: string): Promise<TicketCancellationPolicy[]> {
    let query = supabase
      .from('ticket_cancellation_policies')
      .select('*')
      .eq('is_active', true)
      .order('days_before_event', { ascending: false });

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get cancellation policies: ${error.message}`);
    }

    return data || [];
  }

  static async createCancellationPolicy(policy: Omit<TicketCancellationPolicy, 'id' | 'created_at'>): Promise<TicketCancellationPolicy> {
    const { data, error } = await supabase
      .from('ticket_cancellation_policies')
      .insert([policy])
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create cancellation policy: ${error.message}`);
    }

    return data as TicketCancellationPolicy;
  }

  static async calculateRefund(ticketId: string, cancellationPolicyId?: string): Promise<{ refund_amount: number; processing_fee: number; refund_percentage: number; }> {
    const { data, error } = await supabase.rpc('calculate_refund_amount', {
      p_ticket_id: ticketId,
      p_cancellation_policy_id: cancellationPolicyId || null
    });

    if (error) {
      throw new Error(`Failed to calculate refund: ${error.message}`);
    }

    return data;
  }

  static async getTicketHistory(ticketId: string): Promise<TicketTransactionHistory[]> {
    const { data, error } = await supabase
      .from('ticket_transaction_history')
      .select('*')
      .eq('ticket_purchase_id', ticketId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get ticket history: ${error.message}`);
    }

    return (data || []).map(history => ({
      ...history,
      transaction_type: convertToTransactionType(history.transaction_type),
      transaction_data: safeJsonToRecord(history.transaction_data)
    }));
  }

  static async getTicketInventory(eventId?: string, swigCircuitId?: string): Promise<any[]> {
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

    if (error) {
      throw new Error(`Failed to get ticket inventory: ${error.message}`);
    }

    return data || [];
  }

  static async getCurrentTicketPrices(eventId?: string, swigCircuitId?: string): Promise<TicketPriceInfo[]> {
    const { data, error } = await supabase.rpc('get_current_ticket_price', {
      p_event_id: eventId || null,
      p_swig_circuit_id: swigCircuitId || null
    });

    if (error) {
      throw new Error(`Failed to get current ticket prices: ${error.message}`);
    }

    return data || [];
  }

  static async getPricingTiers(eventId?: string, swigCircuitId?: string): Promise<TicketPricingTier[]> {
    let query = supabase
      .from('ticket_pricing_tiers')
      .select('*')
      .eq('is_active', true)
      .order('tier_order', { ascending: true });

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get pricing tiers: ${error.message}`);
    }

    return (data || []).map(tier => ({
      ...tier,
      tier_benefits: safeJsonToStringArray(tier.tier_benefits)
    }));
  }

  static async createPricingTier(tier: Omit<TicketPricingTier, 'id' | 'created_at' | 'updated_at'>): Promise<TicketPricingTier> {
    const { data, error } = await supabase
      .from('ticket_pricing_tiers')
      .insert({
        ...tier,
        tier_benefits: tier.tier_benefits || []
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create pricing tier: ${error.message}`);
    }

    return {
      ...data,
      tier_benefits: safeJsonToStringArray(data.tier_benefits)
    };
  }

  static async updatePricingTier(id: string, updates: Partial<TicketPricingTier>): Promise<TicketPricingTier> {
    const { data, error } = await supabase
      .from('ticket_pricing_tiers')
      .update({
        ...updates,
        tier_benefits: updates.tier_benefits || []
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update pricing tier: ${error.message}`);
    }

    return {
      ...data,
      tier_benefits: safeJsonToStringArray(data.tier_benefits)
    };
  }

  static async deletePricingTier(id: string): Promise<void> {
    const { error } = await supabase
      .from('ticket_pricing_tiers')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete pricing tier: ${error.message}`);
    }
  }
}
