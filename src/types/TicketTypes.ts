
export interface EventTicket {
  id: string;
  event: {
    id: string;
    name: string;
    date: string;
    time: string;
    venue?: {
      id: string;
      name: string;
      address?: string;
    };
  };
  user_id?: string;
  ticket_type?: {
    id: string;
    name: string;
    price: number;
  };
  purchase_date: string;
  checked_in_at?: string;
  status: string;
  ticket_code?: string;
}

export interface SwigCircuitTicket {
  id: string;
  swig_circuit_id: string;
  user_id?: string;
  ticket_type_id?: string;
  quantity: number;
  purchase_date: string;
  checked_in_at?: string;
  first_check_in?: string;
  status: string;
  ticket_code?: string;
  created_at: string;
  updated_at: string;
  purchaser_info: {
    name: string;
    email: string;
    phone?: string;
  };
  ticket_tier?: {
    id: string;
    name: string;
    price: number;
  };
}

// Discount types
export type DiscountType = 'fixed' | 'percentage' | 'free_item';

export interface AppliedDiscount {
  code: string;
  codeId: string;
  discountAmount: number;
  discountType: DiscountType;
  description: string;
}
