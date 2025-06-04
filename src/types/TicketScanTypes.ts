
import { EventAttendee } from './EventTypes';

export interface TicketScanResult {
  success: boolean;
  attendee?: EventAttendee;
  message: string;
  timestamp: string;
}

export interface ScannerConfig {
  eventId: string;
  allowMultipleScans: boolean;
  requireNetworkConnection: boolean;
}
