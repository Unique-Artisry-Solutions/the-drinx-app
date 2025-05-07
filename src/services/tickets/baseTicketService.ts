
// Base types and interfaces for ticket services

export interface DiscountCodeResult {
  valid: boolean;
  discountType: 'percentage' | 'fixed';
  discountAmount?: number;
  message: string;
  code?: string;
}

export interface TicketPurchaseResult {
  success: boolean;
  message?: string;
  error?: string;
  ticketIds?: string[];
  transactionId?: string;
}

export interface TicketScanResult {
  success: boolean;
  message?: string;
  error?: string;
  ticket?: any;
  attendee?: any;
}

// Base service functions can go here if needed
