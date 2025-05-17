
/**
 * Types for Swig Circuit related features
 */

export interface SwigCircuit {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  start_date: string;
  end_date: string;
  max_distance?: number;
  theme?: string;
  image_url?: string;
  projected_attendance?: number;
  projected_revenue?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SwigCircuitVenue {
  id: string;
  swig_circuit_id: string;
  establishment_id: string;
  position: number;
  created_at?: string;
}

export interface SwigCircuitDrinkHighlight {
  id: string;
  swig_circuit_id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface SwigCircuitPairing {
  id: string;
  swig_circuit_id: string;
  food: string;
  drink: string;
  created_at?: string;
}

export interface SwigCircuitTicketTier {
  id: string;
  swig_circuit_id: string;
  name: string;
  description: string;
  price: number;
  ticket_limit?: number;
  is_vip?: boolean;
  vip_perks?: Record<string, any>;
  benefits: string[];
  created_at?: string;
}

export interface SwigCircuitAttendee {
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
  purchaser_info?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface SwigCircuitCheckIn {
  id: string;
  swig_circuit_id: string;
  attendee_id: string;
  establishment_id: string;
  checked_in_by?: string;
  checked_in_at: string;
  created_at?: string;
}
