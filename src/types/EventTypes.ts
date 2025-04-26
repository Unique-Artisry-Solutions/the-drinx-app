
// This is a new file to properly define event types
export interface EventTicketType {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold?: number;
  available?: number;
}

export interface EventAttendees {
  registered: number;
  capacity: number;
  checkedIn: number;
}

export interface EventRevenue {
  total: number;
  ticketSales: number;
  additionalSales: number;
}

export interface EventVenue {
  id: string;
  name: string;
  address: string;
}

export interface EventNotificationScheduleInput {
  id: string; // Required field now
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor: string;
  locationBased?: boolean;
  coordinates?: { latitude: number; longitude: number };
  targetRadius?: number;
}

export interface EventFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  venueId?: string; // Changed from venue to venueId to match usage
  imageUrl?: string;
  promotionalMaterials?: string[];
  ticketTypes: Omit<EventTicketType, 'id' | 'sold' | 'available'>[];
  notificationSchedules?: EventNotificationScheduleInput[];
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue_id?: string;
  venue: EventVenue;
  image_url?: string;
  promotional_materials?: string[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  ticketTypes: EventTicketType[];
  attendees: EventAttendees;
  revenue: EventRevenue;
  distance?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
