
/**
 * Types for ticket-related functionality
 */

export interface Ticket {
  id: string;
  event_id?: string;
  swig_circuit_id?: string;
  ticket_type_id: string;
  user_id?: string;
  name?: string;
  email?: string;
  ticket_code: string;
  status: 'registered' | 'checked_in' | 'cancelled' | 'refunded';
  purchase_date: string;
  checked_in_at?: string;
  quantity: number;
  custom_fields?: Record<string, any>;
  purchase_info?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity?: number;
  sold?: number;
  event_id?: string;
  swig_circuit_id?: string;
  is_vip?: boolean;
  benefits?: string[];
  created_at?: string;
}

export interface TicketDiscount {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  description: string;
  is_active: boolean;
  usage_limit?: number;
  usage_count?: number;
  used_count?: number; // Adding both fields to support database inconsistency
  start_date: string;
  end_date?: string;
  applicable_ticket_types?: string[];
  event_id?: string;
  swig_circuit_id?: string;
  created_at?: string;
}

// Add EventTicket interface for event tickets
export interface EventTicket {
  id: string;
  event_id: string;
  user_id?: string;
  ticket_type_id?: string;
  ticket_type?: {
    id: string;
    name: string;
    price: number;
  };
  ticket_code?: string;
  purchase_date: string;
  checked_in_at?: string;
  status: string;
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
}

// Add SwigCircuitTicket interface for swig circuit tickets
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
  created_at?: string;
  updated_at?: string;
  purchaser_info?: {
    name: string;
    email: string;
    phone?: string; // Added phone field to fix the error
  };
  ticket_tier?: {
    id: string;
    name: string;
    price: number;
  };
  venue_name?: string;
  swig_circuit?: {
    id: string;
    name: string;
    date: string;
  };
}
