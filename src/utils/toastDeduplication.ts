
interface ToastKey {
  title: string;
  description: string;
  type?: string;
}

class ToastDeduplicationManager {
  private recentToasts = new Map<string, number>();
  private readonly DEDUPLICATION_WINDOW = 3000; // 3 seconds

  private createKey(toast: ToastKey): string {
    return `${toast.title}|${toast.description}|${toast.type || 'default'}`;
  }

  public shouldShowToast(toast: ToastKey): boolean {
    const key = this.createKey(toast);
    const now = Date.now();
    const lastShown = this.recentToasts.get(key);

    if (lastShown && (now - lastShown) < this.DEDUPLICATION_WINDOW) {
      console.log('Toast deduplicated:', key);
      return false;
    }

    this.recentToasts.set(key, now);
    
    // Clean up old entries periodically
    this.cleanup();
    
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, timestamp] of this.recentToasts.entries()) {
      if (now - timestamp > this.DEDUPLICATION_WINDOW * 2) {
        this.recentToasts.delete(key);
      }
    }
  }

  public clear(): void {
    this.recentToasts.clear();
  }
}

export const toastDeduplication = new ToastDeduplicationManager();
