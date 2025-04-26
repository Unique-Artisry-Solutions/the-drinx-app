
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
  venue?: string;  // Make venue optional to match EventWizardContext
  venueId: string | null;
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
