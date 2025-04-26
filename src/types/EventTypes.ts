
import { NotificationSchedule } from '@/components/promoter/events/wizard/EventWizardContext';

export interface EventType {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: {
    id: string;
    name: string;
    address: string;
  };
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  imageUrl?: string;
  promotionalMaterials?: string[];
  ticketTypes: TicketType[];
  attendees: {
    registered: number;
    capacity: number;
    checkedIn: number;
  };
  revenue: {
    total: number;
    ticketSales: number;
    additionalSales: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notificationSchedules?: NotificationSchedule[];
  distance?: number;
  venue_id?: string;
  image_url?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  event_ticket_types?: any[];
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  sold: number;
  available: number;
}

export interface EventFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  venue?: string;  
  venueId?: string;
  ticketTypes: {
    name: string;
    price: number;
    description: string;
    quantity: number;
  }[];
  imageUrl: string;
  promotionalMaterials: string[];
  notificationSchedules?: NotificationSchedule[];
}
