
import { useState, useEffect, useCallback } from 'react';
import { SimpleAdminService, type SimpleQueryParams, type SimpleResponse } from '@/services/admin/SimpleAdminService';

export interface SimpleAdminState<T> {
  items: T[];
  isLoading: boolean;
  error: string;
  total: number;
  page: number;
  limit: number;
}

export interface SimpleAdminActions {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (query: string) => void;
  refresh: () => void;
  deleteItem: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
}

export function useSimpleAdmin(type: 'users' | 'establishments' | 'cocktails') {
  const [state, setState] = useState<SimpleAdminState<any>>({
    items: [],
    isLoading: false,
    error: '',
    total: 0,
    page: 1,
    limit: 20,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      const params: SimpleQueryParams = {
        page: state.page,
        limit: state.limit,
        search: searchQuery || undefined,
      };

      let response: SimpleResponse<any>;
      
      switch (type) {
        case 'users':
          response = await SimpleAdminService.getUsers(params);
          break;
        case 'establishments':
          response = await SimpleAdminService.getEstablishments(params);
          break;
        case 'cocktails':
          response = await SimpleAdminService.getCocktails(params);
          break;
        default:
          throw new Error(`Unknown type: ${type}`);
      }
      
      setState(prev => ({
        ...prev,
        items: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, [type, state.page, state.limit, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const actions: SimpleAdminActions = {
    setPage: (page: number) => {
      setState(prev => ({ ...prev, page }));
    },
    setLimit: (limit: number) => {
      setState(prev => ({ ...prev, limit, page: 1 }));
    },
    setSearch: (query: string) => {
      setSearchQuery(query);
      setState(prev => ({ ...prev, page: 1 }));
    },
    refresh: () => {
      fetchData();
    },
    deleteItem: async (id: string) => {
      try {
        let success = false;
        switch (type) {
          case 'users':
            success = await SimpleAdminService.deleteUser(id);
            break;
          case 'establishments':
            success = await SimpleAdminService.deleteEstablishment(id);
            break;
          case 'cocktails':
            success = await SimpleAdminService.deleteCocktail(id);
            break;
        }
        if (success) {
          fetchData();
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Delete failed',
        }));
      }
    },
    bulkDelete: async (ids: string[]) => {
      try {
        const success = await SimpleAdminService.bulkDelete(ids, type);
        if (success) {
          fetchData();
        }
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
