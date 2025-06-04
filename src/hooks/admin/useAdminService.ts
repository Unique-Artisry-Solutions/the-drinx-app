import { useState, useEffect, useCallback } from 'react';

// Note: This hook is deprecated in favor of useSimpleAdmin
// Keeping for backward compatibility only
export interface AdminEntityState<T> {
  items: T[];
  isLoading: boolean;
  error: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchQuery: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, any>;
}

export interface AdminEntityActions<T> {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (query: string) => void;
  setSort: (field: string, order: 'asc' | 'desc') => void;
  setFilters: (filters: Record<string, any>) => void;
  refreshData: () => void;
  refresh: () => void;
  deleteItem: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
}

export interface UseAdminServiceReturn<T> {
  state: AdminEntityState<T>;
  actions: AdminEntityActions<T>;
}

// Deprecated: Use useSimpleAdmin instead
export function useAdminService<T = any>(
  service: any // Generic service parameter for backward compatibility
): UseAdminServiceReturn<T> {
  const [state, setState] = useState<AdminEntityState<T>>({
    items: [],
    isLoading: false,
    error: '',
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
    searchQuery: '',
    sortBy: undefined,
    sortOrder: 'desc',
    filters: {},
  });

  // Mock implementation for backward compatibility
  const actions: AdminEntityActions<T> = {
    setPage: (page: number) => {
      setState(prev => ({
        ...prev,
        pagination: { ...prev.pagination, page },
      }));
    },
    setLimit: (limit: number) => {
      setState(prev => ({
        ...prev,
        pagination: { ...prev.pagination, limit, page: 1 },
      }));
    },
    setSearch: (query: string) => {
      setState(prev => ({
        ...prev,
        searchQuery: query,
        pagination: { ...prev.pagination, page: 1 },
      }));
    },
    setSort: (field: string, order: 'asc' | 'desc') => {
      setState(prev => ({
        ...prev,
        sortBy: field,
        sortOrder: order,
      }));
    },
    setFilters: (filters: Record<string, any>) => {
      setState(prev => ({
        ...prev,
        filters,
        pagination: { ...prev.pagination, page: 1 },
      }));
    },
    refreshData: () => {
      // Mock refresh
    },
    refresh: () => {
      // Mock refresh
    },
    deleteItem: async (id: string) => {
      // Mock delete
    },
    bulkDelete: async (ids: string[]) => {
      // Mock bulk delete
    },
  };

  return { state, actions };
}
