
// Streamlined utilities - replaces multiple scattered utility files
export const utilities = {
  // String operations
  string: {
    truncate: (text: string, length: number) => 
      text.length > length ? `${text.slice(0, length)}...` : text,
    
    capitalize: (str: string) => 
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
    
    slugify: (text: string) => 
      text.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
  },

  // Number operations
  number: {
    format: (value: number) => new Intl.NumberFormat().format(value),
    currency: (value: number, currency = 'USD') => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value),
    clamp: (value: number, min: number, max: number) => 
      Math.min(Math.max(value, min), max)
  },

  // Date operations
  date: {
    format: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString(undefined, options);
    },
    relative: (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      const diffInSeconds = Math.floor((Date.now() - d.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
  },

  // Array operations
  array: {
    chunk: <T>(array: T[], size: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    },
    unique: <T>(array: T[]): T[] => [...new Set(array)],
    groupBy: <T, K extends string | number>(array: T[], keyFn: (item: T) => K) => 
      array.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
      }, {} as Record<K, T[]>)
  },

  // Validation
  validate: {
    email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    url: (url: string) => {
      try { new URL(url); return true; } catch { return false; }
    },
    empty: (value: any) => {
      if (value == null) return true;
      if (typeof value === 'string') return value.trim().length === 0;
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'object') return Object.keys(value).length === 0;
      return false;
    }
  }
};

// Export individual functions for backward compatibility
export const { string, number, date, array, validate } = utilities;
