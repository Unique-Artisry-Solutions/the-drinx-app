
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SimplifiedAdminState<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  searchTerm: string;
}

export interface SimplifiedAdminActions<T> {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  refresh: () => void;
  deleteItem: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  filterItems: (searchTerm: string) => T[];
}

export function useSimplifiedAdminData<T extends { id: string; name: string }>(
  initialData: T[] = [],
  itemType: string = 'item'
) {
  const { toast } = useToast();
  
  const [state, setState] = useState<SimplifiedAdminState<T>>({
    items: initialData,
    isLoading: false,
    error: null,
    total: initialData.length,
    page: 1,
    limit: 20,
    searchTerm: '',
  });

  const actions: SimplifiedAdminActions<T> = {
    setPage: useCallback((page: number) => {
      setState(prev => ({ ...prev, page }));
    }, []),

    setLimit: useCallback((limit: number) => {
      setState(prev => ({ ...prev, limit, page: 1 }));
    }, []),

    setSearchTerm: useCallback((searchTerm: string) => {
      setState(prev => ({ ...prev, searchTerm, page: 1 }));
    }, []),

    refresh: useCallback(() => {
      setState(prev => ({ ...prev, isLoading: true }));
      // Simulate refresh
      setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false }));
        toast({
          title: 'Data refreshed',
          description: `${itemType} data has been updated`,
        });
      }, 500);
    }, [itemType, toast]),

    deleteItem: useCallback((id: string) => {
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
        total: prev.total - 1
      }));
      toast({
        title: `${itemType} deleted`,
        description: `The ${itemType} has been removed successfully`,
      });
    }, [itemType, toast]),

    bulkDelete: useCallback((ids: string[]) => {
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => !ids.includes(item.id)),
        total: prev.total - ids.length
      }));
      toast({
        title: `${ids.length} ${itemType}s deleted`,
        description: `The selected ${itemType}s have been removed successfully`,
      });
    }, [itemType, toast]),

    filterItems: useCallback((searchTerm: string) => {
      return state.items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [state.items]),
  };

  return { state, actions };
}
