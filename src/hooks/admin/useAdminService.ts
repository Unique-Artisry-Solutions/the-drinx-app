
import { useState, useEffect, useCallback } from 'react';
import { BaseAdminService, type QueryParams, type PaginatedResponse } from '@/services/admin/BaseAdminService';

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
  refresh: () => void; // Add alias for compatibility
  deleteItem: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
}

export interface UseAdminServiceReturn<T> {
  state: AdminEntityState<T>;
  actions: AdminEntityActions<T>;
}

export function useAdminService<T = any>(
  service: BaseAdminService<T>
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

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      const params: QueryParams = {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: state.searchQuery || undefined,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        filters: state.filters,
      };

      const response: PaginatedResponse<T> = await service.getAll(params);
      
      setState(prev => ({
        ...prev,
        items: response.data,
        isLoading: false,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, [service, state.pagination.page, state.pagination.limit, state.searchQuery, state.sortBy, state.sortOrder, state.filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      fetchData();
    },
    refresh: () => {
      fetchData(); // Alias for compatibility
    },
    deleteItem: async (id: string) => {
      try {
        await service.delete(id);
        fetchData(); // Refresh after delete
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Delete failed',
        }));
      }
    },
    bulkDelete: async (ids: string[]) => {
      try {
        await service.bulkDelete(ids);
        fetchData(); // Refresh after bulk delete
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Bulk delete failed',
        }));
      }
    },
  };

  return { state, actions };
}
