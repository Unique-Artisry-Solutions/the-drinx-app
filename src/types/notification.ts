
/**
 * Central notification type definition
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: number;
  read: boolean;
  metadata?: {
    type?: string;
    [key: string]: any;
  };
}
