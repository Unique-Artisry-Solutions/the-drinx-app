
import { Json } from '@/integrations/supabase/types';
import { 
  TicketPurchase, 
  TicketTransfer, 
  TicketRefund,
  TicketPricingTier,
  TicketTransactionHistory
} from '@/types/TicketManagementTypes';
import { 
  convertToPaymentStatus, 
  convertToTicketStatus, 
  convertToTransferStatus, 
  convertToRefundStatus, 
  convertToTransactionType,
  safeJsonToStringArray,
  safeJsonToRecord 
} from '@/utils/ticketTypeGuards';

// Database row interfaces based on actual Supabase schema
interface DbTicketPurchase {
  id: string;
  user_id?: string;
  event_id?: string;
  swig_circuit_id?: string;
  ticket_type_id?: string;
  ticket_type: string;
  quantity: number;
  price_per_ticket: number;
  total_amount: number;
  service_fee: number;
  service_fee_percentage: number;
  contact_name: string;
  contact_email: string;
  payment_status: string;
  status: string;
  ticket_code?: string;
  purchase_details: Json;
  created_at: string;
  updated_at: string;
}

interface DbTicketTransfer {
  id: string;
  ticket_purchase_id?: string;
  from_user_id?: string;
  to_user_id?: string;
  to_email: string;
  transfer_code: string;
  status: string;
  expires_at?: string;
  transferred_at?: string;
  created_at: string;
}

interface DbTicketRefund {
  id: string;
  ticket_purchase_id?: string;
  refund_amount: number;
  refund_reason?: string;
  processing_fee: number;
  status: string;
  processed_at?: string;
  processed_by?: string;
  created_at: string;
}

interface DbTicketPricingTier {
  id: string;
  event_id?: string;
  swig_circuit_id?: string;
  tier_name: string;
  base_price: number;
  tier_order: number;
  valid_from: string;
  valid_until?: string;
  max_quantity?: number;
  sold_quantity: number;
  is_early_bird: boolean;
  early_bird_discount_percentage: number;
  early_bird_discount_amount: number;
  early_bird_end_date?: string;
  tier_benefits: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DbTicketTransactionHistory {
  id: string;
  ticket_purchase_id?: string;
  transaction_type: string;
  from_status?: string;
  to_status?: string;
  performed_by?: string;
  transaction_data?: Json;
  notes?: string;
  created_at: string;
}

// Type-safe mappers
export const mapTicketPurchaseFromDb = (dbRow: DbTicketPurchase): TicketPurchase => ({
  id: dbRow.id,
  user_id: dbRow.user_id,
  event_id: dbRow.event_id,
  swig_circuit_id: dbRow.swig_circuit_id,
  ticket_type_id: dbRow.ticket_type_id,
  ticket_type: dbRow.ticket_type,
  quantity: dbRow.quantity,
  price_per_ticket: dbRow.price_per_ticket,
  total_amount: dbRow.total_amount,
  service_fee: dbRow.service_fee,
  service_fee_percentage: dbRow.service_fee_percentage,
  contact_name: dbRow.contact_name,
  contact_email: dbRow.contact_email,
  payment_status: convertToPaymentStatus(dbRow.payment_status),
  status: convertToTicketStatus(dbRow.status),
  ticket_code: dbRow.ticket_code,
  purchase_details: safeJsonToRecord(dbRow.purchase_details),
  created_at: dbRow.created_at,
  updated_at: dbRow.updated_at
});

export const mapTicketTransferFromDb = (dbRow: DbTicketTransfer): TicketTransfer => ({
  id: dbRow.id,
  ticket_purchase_id: dbRow.ticket_purchase_id || '',
  from_user_id: dbRow.from_user_id,
  to_user_id: dbRow.to_user_id,
  to_email: dbRow.to_email,
  transfer_code: dbRow.transfer_code,
  status: convertToTransferStatus(dbRow.status),
  expires_at: dbRow.expires_at,
  transferred_at: dbRow.transferred_at,
  created_at: dbRow.created_at
});

export const mapTicketRefundFromDb = (dbRow: DbTicketRefund): TicketRefund => ({
  id: dbRow.id,
  ticket_purchase_id: dbRow.ticket_purchase_id || '',
  refund_amount: dbRow.refund_amount,
  refund_reason: dbRow.refund_reason,
  processing_fee: dbRow.processing_fee,
  status: convertToRefundStatus(dbRow.status),
  processed_at: dbRow.processed_at,
  processed_by: dbRow.processed_by,
  created_at: dbRow.created_at
});

export const mapTicketPricingTierFromDb = (dbRow: DbTicketPricingTier): TicketPricingTier => ({
  id: dbRow.id,
  event_id: dbRow.event_id,
  swig_circuit_id: dbRow.swig_circuit_id,
  tier_name: dbRow.tier_name,
  base_price: dbRow.base_price,
  tier_order: dbRow.tier_order,
  valid_from: dbRow.valid_from,
  valid_until: dbRow.valid_until,
  max_quantity: dbRow.max_quantity,
  sold_quantity: dbRow.sold_quantity,
  is_early_bird: dbRow.is_early_bird,
  early_bird_discount_percentage: dbRow.early_bird_discount_percentage,
  early_bird_discount_amount: dbRow.early_bird_discount_amount,
  early_bird_end_date: dbRow.early_bird_end_date,
  tier_benefits: safeJsonToStringArray(dbRow.tier_benefits),
  is_active: dbRow.is_active,
  created_at: dbRow.created_at,
  updated_at: dbRow.updated_at
});

export const mapTicketTransactionHistoryFromDb = (dbRow: DbTicketTransactionHistory): TicketTransactionHistory => ({
  id: dbRow.id,
  ticket_purchase_id: dbRow.ticket_purchase_id || '',
  transaction_type: convertToTransactionType(dbRow.transaction_type),
  from_status: dbRow.from_status,
  to_status: dbRow.to_status,
  performed_by: dbRow.performed_by,
  transaction_data: safeJsonToRecord(dbRow.transaction_data),
  notes: dbRow.notes,
  created_at: dbRow.created_at
});

// Helper to prepare data for database insertion
export const prepareTicketRefundForDb = (ticketId: string, reason?: string) => ({
  ticket_purchase_id: ticketId,
  refund_reason: reason,
  refund_amount: 0, // Will be calculated by the service
  processing_fee: 0, // Will be calculated by the service
  status: 'pending'
});
