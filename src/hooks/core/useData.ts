
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DataState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  searchTerm: string;
}

export interface DataActions<T> {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  refresh: () => Promise<void>;
  create: (item: Omit<T, 'id'>) => Promise<void>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  filter: (searchTerm: string) => T[];
  clearError: () => void;
}

export interface UseDataOptions<T> {
  initialData?: T[];
  fetchFn?: () => Promise<T[]>;
  createFn?: (item: Omit<T, 'id'>) => Promise<T>;
  updateFn?: (id: string, updates: Partial<T>) => Promise<T>;
  deleteFn?: (id: string) => Promise<void>;
  searchFields?: (keyof T)[];
  itemType?: string;
  autoFetch?: boolean;
}

export function useData<T extends { id: string; name?: string }>(
  options: UseDataOptions<T> = {}
): { state: DataState<T>; actions: DataActions<T> } {
  const {
    initialData = [],
    fetchFn,
    createFn,
    updateFn,
    deleteFn,
    searchFields = ['name' as keyof T],
    itemType = 'item',
    autoFetch = true
  } = options;

  const { toast } = useToast();
  
  const [state, setState] = useState<DataState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    total: initialData.length,
    page: 1,
    limit: 20,
    searchTerm: '',
  });

  const refresh = useCallback(async () => {
    if (!fetchFn) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetchFn();
      setState(prev => ({
        ...prev,
        data,
        total: data.length,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [fetchFn, toast]);

  const create = useCallback(async (item: Omit<T, 'id'>) => {
    if (!createFn) {
      toast({
        title: 'Error',
        description: 'Create function not configured',
        variant: 'destructive',
      });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const newItem = await createFn(item);
      setState(prev => ({
        ...prev,
        data: [newItem, ...prev.data],
        total: prev.total + 1,
        isLoading: false
      }));
      toast({
        title: 'Success',
        description: `${itemType} created successfully`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to create ${itemType}`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [createFn, itemType, toast]);

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    if (!updateFn) {
      toast({
        title: 'Error',
        description: 'Update function not configured',
        variant: 'destructive',
      });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const updatedItem = await updateFn(id, updates);
      setState(prev => ({
        ...prev,
        data: prev.data.map(item => item.id === id ? updatedItem : item),
        isLoading: false
      }));
      toast({
        title: 'Success',
        description: `${itemType} updated successfully`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to update ${itemType}`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [updateFn, itemType, toast]);

  const deleteItem = useCallback(async (id: string) => {
    if (!deleteFn) {
      toast({
        title: 'Error',
        description: 'Delete function not configured',
        variant: 'destructive',
      });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await deleteFn(id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => item.id !== id),
        total: prev.total - 1,
        isLoading: false
      }));
      toast({
        title: 'Success',
        description: `${itemType} deleted successfully`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to delete ${itemType}`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [deleteFn, itemType, toast]);

  const bulkDelete = useCallback(async (ids: string[]) => {
    if (!deleteFn) {
      toast({
        title: 'Error',
        description: 'Delete function not configured',
        variant: 'destructive',
      });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await Promise.all(ids.map(id => deleteFn(id)));
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => !ids.includes(item.id)),
        total: prev.total - ids.length,
        isLoading: false
      }));
      toast({
        title: 'Success',
        description: `${ids.length} ${itemType}s deleted successfully`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to delete ${itemType}s`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [deleteFn, itemType, toast]);

  const filter = useCallback((searchTerm: string) => {
    return state.data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return typeof value === 'string' && 
               value.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [state.data, searchFields]);

  const actions: DataActions<T> = {
    setPage: useCallback((page: number) => {
      setState(prev => ({ ...prev, page }));
    }, []),
    setLimit: useCallback((limit: number) => {
      setState(prev => ({ ...prev, limit, page: 1 }));
    }, []),
    setSearchTerm: useCallback((searchTerm: string) => {
      setState(prev => ({ ...prev, searchTerm, page: 1 }));
    }, []),
    refresh,
    create,
    update,
    delete: deleteItem,
    bulkDelete,
    filter,
    clearError: useCallback(() => {
      setState(prev => ({ ...prev, error: null }));
    }, [])
  };

  // Auto-fetch on mount if enabled and fetchFn provided
  useEffect(() => {
    if (autoFetch && fetchFn) {
      refresh();
    }
  }, [autoFetch, fetchFn, refresh]);

  return { state, actions };
}
