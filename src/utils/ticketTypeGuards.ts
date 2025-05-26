
import { Json } from '@/integrations/supabase/types';
import { 
  TicketTransactionHistory, 
  TicketPricingTier, 
  TicketTransfer, 
  TicketRefund, 
  TicketPurchase 
} from '@/types/TicketManagementTypes';

// Type guards and converters for database responses

export const safeJsonToStringArray = (json: Json): string[] => {
  if (Array.isArray(json)) {
    return json.filter((item): item is string => typeof item === 'string');
  }
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    } catch {
      // If parsing fails, return empty array
    }
  }
  return [];
};

export const safeJsonToRecord = (json: Json): Record<string, any> => {
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // If parsing fails, return empty object
    }
  }
  return {};
};

export const convertToTransactionType = (type: string): TicketTransactionHistory['transaction_type'] => {
  const validTypes = ['purchase', 'use', 'cancel', 'transfer', 'refund', 'status_change'] as const;
  return validTypes.includes(type as any) ? type as TicketTransactionHistory['transaction_type'] : 'status_change';
};

export const convertToTransferStatus = (status: string): TicketTransfer['status'] => {
  const validStatuses = ['pending', 'completed', 'cancelled', 'expired'] as const;
  return validStatuses.includes(status as any) ? status as TicketTransfer['status'] : 'pending';
};

export const convertToRefundStatus = (status: string): TicketRefund['status'] => {
  const validStatuses = ['pending', 'processed', 'failed'] as const;
  return validStatuses.includes(status as any) ? status as TicketRefund['status'] : 'pending';
};

export const convertToPaymentStatus = (status: string): TicketPurchase['payment_status'] => {
  const validStatuses = ['pending', 'completed', 'failed', 'refunded'] as const;
  return validStatuses.includes(status as any) ? status as TicketPurchase['payment_status'] : 'pending';
};

export const convertToTicketStatus = (status: string): TicketPurchase['status'] => {
  const validStatuses = ['purchased', 'used', 'cancelled', 'transferred', 'refunded'] as const;
  return validStatuses.includes(status as any) ? status as TicketPurchase['status'] : 'purchased';
};
