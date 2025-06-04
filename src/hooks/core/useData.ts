
import { useState, useEffect, useCallback } from 'react';

export interface DataState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

export interface DataActions<T> {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  refresh: () => void;
  refetch: () => void;
  create: (item: Omit<T, 'id'>) => Promise<void>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

export interface UseDataOptions<T> {
  initialData?: T[];
  fetchFn?: () => Promise<T[]>;
  itemType?: string;
  searchFields?: (keyof T)[];
}

export function useData<T extends { id: string; name?: string }>(
  options: UseDataOptions<T> = {}
): { state: DataState<T>; actions: DataActions<T> } {
  const { initialData = [], itemType = 'item', searchFields = [] } = options;

  const [state, setState] = useState<DataState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    total: initialData.length,
    page: 1,
    limit: 20
  });

  const [searchTerm, setSearchTerm] = useState('');

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      if (options.fetchFn) {
        const data = await options.fetchFn();
        setState(prev => ({
          ...prev,
          data,
          total: data.length,
          isLoading: false,
          error: null
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      }));
    }
  }, [options.fetchFn]);

  const actions: DataActions<T> = {
    setPage: (page: number) => {
      setState(prev => ({ ...prev, page }));
    },
    setLimit: (limit: number) => {
      setState(prev => ({ ...prev, limit, page: 1 }));
    },
    setSearchTerm: (term: string) => {
      setSearchTerm(term);
      // Filter data based on search term
      if (term) {
        const filtered = initialData.filter(item => {
          if (searchFields.length > 0) {
            return searchFields.some(field => {
              const value = item[field];
              return typeof value === 'string' && 
                     value.toLowerCase().includes(term.toLowerCase());
            });
          }
          return item.name && item.name.toLowerCase().includes(term.toLowerCase());
        });
        setState(prev => ({ ...prev, data: filtered, total: filtered.length }));
      } else {
        setState(prev => ({ ...prev, data: initialData, total: initialData.length }));
      }
    },
    refresh,
    refetch: refresh,
    create: async (item: Omit<T, 'id'>) => {
      // Mock implementation
      console.log(`Creating ${itemType}:`, item);
    },
    update: async (id: string, updates: Partial<T>) => {
      // Mock implementation
      console.log(`Updating ${itemType} ${id}:`, updates);
    },
    delete: async (id: string) => {
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => item.id !== id),
        total: prev.total - 1
      }));
      console.log(`Deleted ${itemType}:`, id);
    },
    deleteItem: async (id: string) => {
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => item.id !== id),
        total: prev.total - 1
      }));
      console.log(`Deleted ${itemType}:`, id);
    },
    bulkDelete: async (ids: string[]) => {
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => !ids.includes(item.id)),
        total: prev.total - ids.length
      }));
      console.log(`Bulk deleted ${itemType}s:`, ids);
    }
  };

  useEffect(() => {
    if (options.fetchFn && initialData.length === 0) {
      refresh();
    }
  }, [refresh, options.fetchFn, initialData.length]);

  return { state, actions };
}
