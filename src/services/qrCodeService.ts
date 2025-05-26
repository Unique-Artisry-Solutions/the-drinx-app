
import { TicketPurchase } from '@/types/TicketManagementTypes';

export interface QRCodeData {
  id: string;
  type: 'ticket' | 'check-in' | 'transfer';
  ticketId: string;
  eventId?: string;
  swigCircuitId?: string;
  userId?: string;
  timestamp: string;
  signature?: string;
}

export interface ScanResult {
  success: boolean;
  data?: QRCodeData;
  error?: string;
  offline?: boolean;
}

export class QRCodeService {
  private static readonly QR_VERSION = '1.0';
  private static readonly OFFLINE_STORAGE_KEY = 'qr_offline_scans';

  /**
   * Generate QR code data for a ticket
   */
  static generateTicketQRData(ticket: TicketPurchase): QRCodeData {
    return {
      id: ticket.ticket_code || ticket.id,
      type: 'ticket',
      ticketId: ticket.id,
      eventId: ticket.event_id,
      swigCircuitId: ticket.swig_circuit_id,
      userId: ticket.user_id,
      timestamp: new Date().toISOString(),
      signature: this.generateSignature(ticket.id)
    };
  }

  /**
   * Generate QR code data for check-in
   */
  static generateCheckInQRData(params: {
    userId: string;
    eventId?: string;
    swigCircuitId?: string;
    establishmentId?: string;
  }): QRCodeData {
    return {
      id: `checkin-${Date.now()}`,
      type: 'check-in',
      ticketId: '',
      eventId: params.eventId,
      swigCircuitId: params.swigCircuitId,
      userId: params.userId,
      timestamp: new Date().toISOString(),
      signature: this.generateSignature(params.userId)
    };
  }

  /**
   * Generate QR code string value
   */
  static generateQRCodeValue(data: QRCodeData): string {
    return JSON.stringify({
      v: this.QR_VERSION,
      ...data
    });
  }

  /**
   * Parse QR code string
   */
  static parseQRCode(qrString: string): ScanResult {
    try {
      const parsed = JSON.parse(qrString);
      
      // Validate structure
      if (!parsed.id || !parsed.type || !parsed.timestamp) {
        return {
          success: false,
          error: 'Invalid QR code format'
        };
      }

      // Check version compatibility
      if (parsed.v && parsed.v !== this.QR_VERSION) {
        console.warn(`QR code version mismatch: ${parsed.v} vs ${this.QR_VERSION}`);
      }

      return {
        success: true,
        data: parsed as QRCodeData
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse QR code'
      };
    }
  }

  /**
   * Validate QR code data
   */
  static validateQRData(data: QRCodeData): boolean {
    // Check if QR code is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const qrAge = Date.now() - new Date(data.timestamp).getTime();
    
    if (qrAge > maxAge) {
      console.warn('QR code is too old');
      return false;
    }

    // Validate signature if present
    if (data.signature && !this.validateSignature(data.ticketId || data.userId || data.id, data.signature)) {
      console.warn('QR code signature is invalid');
      return false;
    }

    return true;
  }

  /**
   * Store scan for offline processing
   */
  static storeOfflineScan(data: QRCodeData): void {
    try {
      const offlineScans = this.getOfflineScans();
      offlineScans.push({
        ...data,
        scannedAt: new Date().toISOString(),
        processed: false
      });
      
      localStorage.setItem(this.OFFLINE_STORAGE_KEY, JSON.stringify(offlineScans));
    } catch (error) {
      console.error('Failed to store offline scan:', error);
    }
  }

  /**
   * Get stored offline scans
   */
  static getOfflineScans(): any[] {
    try {
      const stored = localStorage.getItem(this.OFFLINE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get offline scans:', error);
      return [];
    }
  }

  /**
   * Clear processed offline scans
   */
  static clearProcessedOfflineScans(): void {
    try {
      const offlineScans = this.getOfflineScans();
      const unprocessed = offlineScans.filter(scan => !scan.processed);
      localStorage.setItem(this.OFFLINE_STORAGE_KEY, JSON.stringify(unprocessed));
    } catch (error) {
      console.error('Failed to clear offline scans:', error);
    }
  }

  /**
   * Mark offline scan as processed
   */
  static markOfflineScanProcessed(scanId: string): void {
    try {
      const offlineScans = this.getOfflineScans();
      const updated = offlineScans.map(scan => 
        scan.id === scanId ? { ...scan, processed: true } : scan
      );
      localStorage.setItem(this.OFFLINE_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark scan as processed:', error);
    }
  }

  /**
   * Generate simple signature for QR code validation
   */
  private static generateSignature(input: string): string {
    // Simple hash function for client-side validation
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Validate signature
   */
  private static validateSignature(input: string, signature: string): boolean {
    return this.generateSignature(input) === signature;
  }

  /**
   * Check if device is online
   */
  static isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Get offline scan count
   */
  static getOfflineScanCount(): number {
    return this.getOfflineScans().filter(scan => !scan.processed).length;
  }
}
