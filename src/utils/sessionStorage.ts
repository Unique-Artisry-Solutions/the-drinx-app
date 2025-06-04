
// Session storage utilities to replace SessionPersistenceService
export class SessionStorageManager {
  static setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Failed to set session storage item:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get session storage item:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove session storage item:', error);
    }
  }

  static clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear session storage:', error);
    }
  }

  static persistAuthSession(session: any): void {
    this.setItem('auth_session', session);
  }

  static getPersistedAuthSession(): any {
    return this.getItem('auth_session');
  }

  static clearAuthSession(): void {
    this.removeItem('auth_session');
  }
}
