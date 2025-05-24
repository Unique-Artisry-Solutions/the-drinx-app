
/**
 * Authentication cache for optimizing userType determination and reducing database calls
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  expiry: number;
}

interface AuthCacheData {
  userType: string | null;
  userRoles: any[];
  sessionValid: boolean;
  lastValidation: number;
}

class AuthCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly USER_TYPE_TTL = 10 * 60 * 1000; // 10 minutes for userType
  private readonly SESSION_TTL = 30 * 60 * 1000; // 30 minutes for session validation

  /**
   * Set a cache entry with TTL
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.DEFAULT_TTL);
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      expiry
    });
  }

  /**
   * Get a cache entry if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }

  /**
   * Check if cache entry exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Cache userType with extended TTL
   */
  setUserType(userId: string, userType: string | null): void {
    this.set(`userType:${userId}`, userType, this.USER_TYPE_TTL);
  }

  /**
   * Get cached userType
   */
  getUserType(userId: string): string | null {
    return this.get(`userType:${userId}`);
  }

  /**
   * Cache user roles
   */
  setUserRoles(userId: string, roles: any[]): void {
    this.set(`userRoles:${userId}`, roles, this.USER_TYPE_TTL);
  }

  /**
   * Get cached user roles
   */
  getUserRoles(userId: string): any[] | null {
    return this.get(`userRoles:${userId}`);
  }

  /**
   * Cache session validation result
   */
  setSessionValid(userId: string, isValid: boolean): void {
    this.set(`sessionValid:${userId}`, isValid, this.SESSION_TTL);
  }

  /**
   * Get cached session validation
   */
  getSessionValid(userId: string): boolean | null {
    return this.get(`sessionValid:${userId}`);
  }

  /**
   * Clear all user-specific cache entries
   */
  clearUserCache(userId: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(userId)
    );
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const authCache = new AuthCache();
