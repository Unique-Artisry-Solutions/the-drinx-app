/**
 * Debug logging utility to reduce console noise while maintaining debugging capabilities
 */

import { isPreviewEnvironment } from './environment';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type LogCategory = 'auth' | 'impersonation' | 'notifications' | 'service-worker' | 'general';

interface LoggerConfig {
  enabledCategories: Set<LogCategory>;
  minLevel: LogLevel;
  isDevelopment: boolean;
}

class DebugLogger {
  private config: LoggerConfig;
  
  constructor() {
    this.config = {
      enabledCategories: new Set<LogCategory>(), // Empty set initially
      minLevel: 'error',
      isDevelopment: isPreviewEnvironment() || process.env.NODE_ENV === 'development'
    };
    
    // Enable more logging in development
    if (this.config.isDevelopment) {
      // Enable all categories for warnings and above in development
      this.config.enabledCategories.add('auth');
      this.config.enabledCategories.add('impersonation');
      this.config.enabledCategories.add('notifications');
      this.config.enabledCategories.add('service-worker');
      this.config.enabledCategories.add('general');
      this.config.minLevel = 'warn';
    }
  }

  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    const levelPriority = { error: 3, warn: 2, info: 1, debug: 0 };
    const minPriority = levelPriority[this.config.minLevel];
    const currentPriority = levelPriority[level];
    
    return currentPriority >= minPriority && 
           (this.config.enabledCategories.has(category) || level === 'error');
  }

  public enableCategory(category: LogCategory) {
    this.config.enabledCategories.add(category);
  }

  public disableCategory(category: LogCategory) {
    this.config.enabledCategories.delete(category);
  }

  public setMinLevel(level: LogLevel) {
    this.config.minLevel = level;
  }

  public log(level: LogLevel, category: LogCategory, message: string, data?: any) {
    if (!this.shouldLog(level, category)) return;
    
    const prefix = `[${category.toUpperCase()}]`;
    const logMethod = level === 'debug' ? 'log' : level;
    
    if (data) {
      console[logMethod](prefix, message, data);
    } else {
      console[logMethod](prefix, message);
    }
  }

  public group(category: LogCategory, title: string, collapsed = true) {
    if (!this.shouldLog('info', category)) return;
    
    const method = collapsed ? 'groupCollapsed' : 'group';
    console[method](`[${category.toUpperCase()}] ${title}`);
  }

  public groupEnd(category: LogCategory) {
    if (!this.shouldLog('info', category)) return;
    console.groupEnd();
  }

  // Convenience methods
  public error(category: LogCategory, message: string, data?: any) {
    this.log('error', category, message, data);
  }

  public warn(category: LogCategory, message: string, data?: any) {
    this.log('warn', category, message, data);
  }

  public info(category: LogCategory, message: string, data?: any) {
    this.log('info', category, message, data);
  }

  public debug(category: LogCategory, message: string, data?: any) {
    this.log('debug', category, message, data);
  }
}

// Export singleton instance
export const debugLogger = new DebugLogger();

// Window-accessible debug controls for developers
if (typeof window !== 'undefined') {
  (window as any).debugLogger = {
    enable: (category: LogCategory) => debugLogger.enableCategory(category),
    disable: (category: LogCategory) => debugLogger.disableCategory(category),
    setLevel: (level: LogLevel) => debugLogger.setMinLevel(level),
    enableAll: () => {
      ['auth', 'impersonation', 'notifications', 'service-worker', 'general'].forEach(cat => 
        debugLogger.enableCategory(cat as LogCategory)
      );
      debugLogger.setMinLevel('debug');
      console.log('Debug logging enabled for all categories');
    },
    disableAll: () => {
      ['auth', 'impersonation', 'notifications', 'service-worker', 'general'].forEach(cat => 
        debugLogger.disableCategory(cat as LogCategory)
      );
      debugLogger.setMinLevel('error');
      console.log('Debug logging disabled (errors only)');
    }
  };
}