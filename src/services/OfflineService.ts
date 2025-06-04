
interface OfflineAction {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  retries: number;
}

class OfflineServiceClass {
  private actions: OfflineAction[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  queueAction(type: string, data: any) {
    const action: OfflineAction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data,
      timestamp: new Date(),
      retries: 0
    };

    this.actions.push(action);
    
    if (this.isOnline) {
      this.processActions();
    }
  }

  private handleOnline() {
    this.isOnline = true;
    this.processActions();
  }

  private handleOffline() {
    this.isOnline = false;
  }

  private async processActions() {
    for (const action of this.actions) {
      try {
        await this.executeAction(action);
        this.removeAction(action.id);
      } catch (error) {
        action.retries++;
        if (action.retries >= 3) {
          this.removeAction(action.id);
        }
      }
    }
  }

  private async executeAction(action: OfflineAction) {
    // Execute the queued action based on type
    switch (action.type) {
      case 'like_activity':
        console.log('Executing offline like action:', action.data);
        break;
      case 'save_recommendation':
        console.log('Executing offline save action:', action.data);
        break;
      default:
        console.log('Unknown offline action type:', action.type);
    }
  }

  private removeAction(id: string) {
    this.actions = this.actions.filter(action => action.id !== id);
  }

  getQueuedActions() {
    return this.actions;
  }

  isOffline() {
    return !this.isOnline;
  }
}

export const OfflineService = new OfflineServiceClass();
