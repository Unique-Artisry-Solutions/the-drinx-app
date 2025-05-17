
export interface SwigCircuitTicket {
  id: string;
  swig_circuit_id: string;
  ticket_type_id: string;
  user_id?: string;
  status: 'registered' | 'attended' | 'cancelled';
  purchase_date: string;
  ticket_code?: string;
  purchaser_info?: {
    name: string;
    email: string;
    phone?: string;
  };
  checked_in_at?: string;
  first_check_in?: string;
  swig_circuit?: {
    id: string;
    name: string;
    description?: string;
    start_date: string;
    end_date: string;
    date?: string;
    time?: string;
  };
  ticket_tier?: {
    id: string;
    name: string;
    description?: string;
    price: number;
  };
}

export interface TicketValidationResult {
  valid: boolean;
  message?: string;
  ticketData?: any;
  checkedInAt?: string;
}

export interface SwigCircuitCheckIn {
  id: string;
  swig_circuit_id: string;
  attendee_id: string;
  establishment_id: string;
  checked_in_at: string;
  checked_in_by?: string;
}
