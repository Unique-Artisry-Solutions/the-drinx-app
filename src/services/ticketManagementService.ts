
import { supabase } from '@/integrations/supabase/client';
import { 
  TicketPurchase, 
  TicketTransfer, 
  TicketRefund, 
  TicketCancellationPolicy, 
  TicketInventory,
  BulkTicketOperation,
  RefundCalculation 
} from '@/types/TicketManagementTypes';

export class TicketManagementService {
  // Ticket Inventory Management
  static async getTicketInventory(eventId?: string, swigCircuitId?: string) {
    const query = supabase.from('ticket_inventory').select('*');
    
    if (eventId) {
      query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query.eq('swig_circuit_id', swigCircuitId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as TicketInventory[];
  }

  static async updateTicketInventory(inventoryId: string, updates: Partial<TicketInventory>) {
    const { data, error } = await supabase
      .from('ticket_inventory')
      .update(updates)
      .eq('id', inventoryId)
      .select()
      .single();
    
    if (error) throw error;
    return data as TicketInventory;
  }

  static async createTicketInventory(inventory: Omit<TicketInventory, 'id' | 'available_quantity' | 'last_updated'>) {
    const { data, error } = await supabase
      .from('ticket_inventory')
      .insert(inventory)
      .select()
      .single();
    
    if (error) throw error;
    return data as TicketInventory;
  }

  // Ticket Transfers
  static async initiateTicketTransfer(ticketPurchaseId: string, toEmail: string) {
    const transferCode = this.generateTransferCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    const { data, error } = await supabase
      .from('ticket_transfers')
      .insert({
        ticket_purchase_id: ticketPurchaseId,
        to_email: toEmail,
        transfer_code: transferCode,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data as TicketTransfer;
  }

  static async acceptTicketTransfer(transferCode: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User must be authenticated to accept transfer');

    const { data, error } = await supabase
      .from('ticket_transfers')
      .update({
        to_user_id: user.user.id,
        status: 'completed',
        transferred_at: new Date().toISOString()
      })
      .eq('transfer_code', transferCode)
      .eq('status', 'pending')
      .select()
      .single();

    if (error) throw error;

    // Update the ticket purchase to the new user
    await supabase
      .from('ticket_purchases')
      .update({ user_id: user.user.id })
      .eq('id', data.ticket_purchase_id);

    return data as TicketTransfer;
  }

  static async getTicketTransfers(userId: string) {
    const { data, error } = await supabase
      .from('ticket_transfers')
      .select(`
        *,
        ticket_purchase:ticket_purchases(*)
      `)
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);

    if (error) throw error;
    return data;
  }

  // Ticket Refunds
  static async calculateRefund(ticketPurchaseId: string): Promise<RefundCalculation> {
    const { data, error } = await supabase
      .rpc('calculate_refund_amount', { p_ticket_purchase_id: ticketPurchaseId });

    if (error) throw error;
    return data[0] as RefundCalculation;
  }

  static async requestTicketRefund(ticketPurchaseId: string, reason?: string) {
    const refundCalculation = await this.calculateRefund(ticketPurchaseId);

    const { data, error } = await supabase
      .from('ticket_refunds')
      .insert({
        ticket_purchase_id: ticketPurchaseId,
        refund_amount: refundCalculation.refund_amount,
        refund_reason: reason,
        processing_fee: refundCalculation.processing_fee,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data as TicketRefund;
  }

  static async processTicketRefund(refundId: string, approved: boolean) {
    const { data: user } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('ticket_refunds')
      .update({
        status: approved ? 'processed' : 'failed',
        processed_at: new Date().toISOString(),
        processed_by: user.user?.id
      })
      .eq('id', refundId)
      .select()
      .single();

    if (error) throw error;

    if (approved) {
      // Update ticket purchase status
      await supabase
        .from('ticket_purchases')
        .update({ payment_status: 'refunded' })
        .eq('id', data.ticket_purchase_id);
    }

    return data as TicketRefund;
  }

  static async getTicketRefunds(userId?: string) {
    let query = supabase
      .from('ticket_refunds')
      .select(`
        *,
        ticket_purchase:ticket_purchases(*)
      `);

    if (userId) {
      query = query.eq('ticket_purchases.user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Cancellation Policies
  static async getCancellationPolicies(eventId?: string, swigCircuitId?: string) {
    let query = supabase.from('ticket_cancellation_policies').select('*');
    
    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query.order('days_before_event', { ascending: false });
    if (error) throw error;
    return data as TicketCancellationPolicy[];
  }

  static async createCancellationPolicy(policy: Omit<TicketCancellationPolicy, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('ticket_cancellation_policies')
      .insert(policy)
      .select()
      .single();

    if (error) throw error;
    return data as TicketCancellationPolicy;
  }

  static async updateCancellationPolicy(policyId: string, updates: Partial<TicketCancellationPolicy>) {
    const { data, error } = await supabase
      .from('ticket_cancellation_policies')
      .update(updates)
      .eq('id', policyId)
      .select()
      .single();

    if (error) throw error;
    return data as TicketCancellationPolicy;
  }

  // Bulk Operations
  static async performBulkOperation(operation: BulkTicketOperation) {
    const results = [];

    for (const ticketId of operation.ticket_ids) {
      try {
        let result;
        
        switch (operation.operation) {
          case 'refund':
            result = await this.requestTicketRefund(ticketId, operation.parameters?.reason);
            break;
          case 'transfer':
            result = await this.initiateTicketTransfer(ticketId, operation.parameters?.to_email);
            break;
          case 'cancel':
            result = await supabase
              .from('ticket_purchases')
              .update({ payment_status: 'cancelled' })
              .eq('id', ticketId)
              .select()
              .single();
            break;
          case 'update_status':
            result = await supabase
              .from('ticket_purchases')
              .update({ payment_status: operation.parameters?.status })
              .eq('id', ticketId)
              .select()
              .single();
            break;
          default:
            throw new Error(`Unknown operation: ${operation.operation}`);
        }

        results.push({ ticketId, success: true, data: result.data });
      } catch (error) {
        results.push({ ticketId, success: false, error: (error as Error).message });
      }
    }

    return results;
  }

  // Utility methods
  private static generateTransferCode(): string {
    return 'TRANSFER-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  static async getTicketPurchases(filters?: {
    userId?: string;
    eventId?: string;
    swigCircuitId?: string;
    status?: string;
  }) {
    let query = supabase.from('ticket_purchases').select('*');

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters?.eventId) {
      query = query.eq('event_id', filters.eventId);
    }
    if (filters?.swigCircuitId) {
      query = query.eq('swig_circuit_id', filters.swigCircuitId);
    }
    if (filters?.status) {
      query = query.eq('payment_status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data as TicketPurchase[];
  }
}
