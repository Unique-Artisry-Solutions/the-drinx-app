
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

class NotificationServiceClass {
  private notifications: AppNotification[] = [];
  private subscribers: ((notifications: AppNotification[]) => void)[] = [];

  subscribe(callback: (notifications: AppNotification[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: AppNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.notifySubscribers();

    // Auto-remove after 5 seconds for non-persistent notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, 5000);
    }
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifySubscribers();
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifySubscribers();
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback([...this.notifications]));
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }
}

export const NotificationService = new NotificationServiceClass();
