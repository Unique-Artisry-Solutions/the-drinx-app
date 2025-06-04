
import { EventAttendee } from './EventTypes';

export interface TicketScanResult {
  success: boolean;
  message: string;
  attendee?: EventAttendee;
}
