
export interface EventTicket {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type_id?: string;
  purchase_date: string;
  checked_in_at?: string;
  status: string;
  ticket_code: string;
  event: {
    id: string;
    name: string;
    date: string;
    time: string;
    venue?: {
      id: string;
      name: string;
    }
  };
  ticket_type?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface SwigCircuitTicket {
  id: string;
  swig_circuit_id: string;
  user_id: string;
  ticket_type_id?: string;
  purchase_date: string;
  status: string;
  ticket_code?: string;
  swig_circuit?: {
    id: string;
    name: string;
    date?: string;
    time?: string;
  };
  ticket_tier?: {
    id: string;
    name: string;
    price: number;
  };
}

// Define a type for raw Supabase response data
export type SwigCircuitAttendeeRaw = {
  id: string;
  swig_circuit_id: string;
  user_id: string;
  ticket_type_id?: string;
  purchase_date: string;
  status: string;
  ticket_code?: string;
  swig_circuit: {
    id: string;
    name: string;
    date?: string;
    time?: string;
  } | null;
  ticket_tier: {
    id: string;
    name: string;
    price: number;
  } | null;
}
