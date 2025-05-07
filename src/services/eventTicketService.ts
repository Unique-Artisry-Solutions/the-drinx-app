
// Re-export all ticket-related services from this file
export * from './tickets/baseTicketService';
export * from './tickets/ticketTypeService';
export * from './tickets/discountService';
export * from './tickets/purchaseService';

// DiscountCodeResult interface needs to be directly exported here
export interface DiscountCodeResult {
  valid: boolean;
  discountType: 'percentage' | 'fixed';
  discountAmount?: number;
  message: string;
  code?: string;
}

// Add the missing functions that are needed
export const getEventTicketTypes = async (eventId: string) => {
  const { data, error } = await fetch(`/api/events/${eventId}/ticket-types`).then(res => res.json());
  if (error) throw new Error(error.message);
  return data;
};

export const applyDiscountCode = async (code: string, eventId: string, ticketTypeId: string): Promise<DiscountCodeResult> => {
  try {
    const response = await fetch(`/api/events/${eventId}/discount-codes/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, ticketTypeId })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to validate discount code');
    }
    
    return data;
  } catch (error: any) {
    console.error('Error applying discount code:', error);
    return {
      valid: false,
      discountType: 'percentage',
      message: error.message || 'Failed to validate discount code'
    };
  }
};

export const createDiscountCode = async (params: {
  eventId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  expiresAt?: Date;
  usageLimit?: number;
  applicableTicketTypes?: string[];
  description?: string;
}) => {
  try {
    const response = await fetch(`/api/events/${params.eventId}/discount-codes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create discount code');
    }
    
    return data;
  } catch (error: any) {
    console.error('Error creating discount code:', error);
    throw error;
  }
};

export const checkTicketAvailability = async (eventId: string, ticketTypeId: string) => {
  try {
    const response = await fetch(`/api/events/${eventId}/ticket-types/${ticketTypeId}/availability`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check ticket availability');
    }
    
    return data;
  } catch (error: any) {
    console.error('Error checking ticket availability:', error);
    throw error;
  }
};

export const processTicketPurchase = async (params: {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  userId?: string;
  customerName: string;
  customerEmail: string;
  discountCode?: string;
  paymentMethodId?: string;
}) => {
  try {
    const response = await fetch(`/api/events/${params.eventId}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to process purchase');
    }
    
    return data;
  } catch (error: any) {
    console.error('Error processing ticket purchase:', error);
    return {
      success: false,
      error: error.message || 'Failed to process ticket purchase'
    };
  }
};

// Update the processTicketScan function to align with what the UI components expect
export const processTicketScan = async (code: string) => {
  try {
    const response = await fetch(`/api/tickets/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketCode: code })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Invalid ticket'
      };
    }
    
    return {
      success: true,
      ticket: data.ticket
    };
  } catch (error: any) {
    console.error('Error processing ticket scan:', error);
    return {
      success: false,
      error: error.message || 'Error processing ticket'
    };
  }
};
