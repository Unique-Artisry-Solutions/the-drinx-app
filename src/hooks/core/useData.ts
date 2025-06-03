
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DataState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

export interface DataActions<T> {
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  create: (item: Omit<T, 'id'>) => Promise<void>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
}

export interface UseDataOptions<T> {
  initialData?: T[];
  fetchFn?: () => Promise<T[]>;
  createFn?: (item: Omit<T, 'id'>) => Promise<T>;
  updateFn?: (id: string, updates: Partial<T>) => Promise<T>;
  deleteFn?: (id: string) => Promise<void>;
  itemType?: string;
  searchFields?: (keyof T)[];
}

export function useData<T extends { id: string }>(
  options: UseDataOptions<T>
): { state: DataState<T>; actions: DataActions<T> } {
  const { toast } = useToast();
  const {
    initialData = [],
    fetchFn,
    createFn,
    updateFn,
    deleteFn,
    itemType = 'item',
    searchFields = []
  } = options;

  const [state, setState] = useState<DataState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    total: initialData.length,
    page: 1,
    limit: 10
  });

  const [searchTerm, setSearchTerm] = useState<string>('');

  const refetchData = useCallback(async () => {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch ${itemType}s`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [fetchFn, itemType, toast]);

  const actions: DataActions<T> = {
    refetch: refetchData,
    refresh: refetchData,

    create: useCallback(async (item: Omit<T, 'id'>) => {
      if (!createFn) return;
      
      try {
        const newItem = await createFn(item);
        setState(prev => ({
          ...prev,
          data: [...prev.data, newItem],
          total: prev.total + 1
        }));
        toast({
          title: 'Success',
          description: `${itemType} created successfully`,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to create ${itemType}`;
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [createFn, itemType, toast]),

    update: useCallback(async (id: string, updates: Partial<T>) => {
      if (!updateFn) return;
      
      try {
        const updatedItem = await updateFn(id, updates);
        setState(prev => ({
          ...prev,
          data: prev.data.map(item => item.id === id ? updatedItem : item)
        }));
        toast({
          title: 'Success',
          description: `${itemType} updated successfully`,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to update ${itemType}`;
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [updateFn, itemType, toast]),

    deleteItem: useCallback(async (id: string) => {
      if (!deleteFn) {
        setState(prev => ({
          ...prev,
          data: prev.data.filter(item => item.id !== id),
          total: prev.total - 1
        }));
        toast({
          title: 'Success',
          description: `${itemType} removed`,
        });
        return;
      }
      
      try {
        await deleteFn(id);
        setState(prev => ({
          ...prev,
          data: prev.data.filter(item => item.id !== id),
          total: prev.total - 1
        }));
        toast({
          title: 'Success',
          description: `${itemType} deleted successfully`,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to delete ${itemType}`;
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [deleteFn, itemType, toast]),

    delete: useCallback(async (id: string) => {
      return actions.deleteItem(id);
    }, []),

    bulkDelete: useCallback(async (ids: string[]) => {
      try {
        // If no delete function, just filter locally
        if (!deleteFn) {
          setState(prev => ({
            ...prev,
            data: prev.data.filter(item => !ids.includes(item.id)),
            total: prev.total - ids.length
          }));
          toast({
            title: 'Success',
            description: `${ids.length} ${itemType}s removed`,
          });
          return;
        }

        // Delete each item
        await Promise.all(ids.map(id => deleteFn(id)));
        setState(prev => ({
          ...prev,
          data: prev.data.filter(item => !ids.includes(item.id)),
          total: prev.total - ids.length
        }));
        toast({
          title: 'Success',
          description: `${ids.length} ${itemType}s deleted successfully`,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to delete ${itemType}s`;
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [deleteFn, itemType, toast]),

    setPage: useCallback((page: number) => {
      setState(prev => ({ ...prev, page }));
    }, []),

    setLimit: useCallback((limit: number) => {
      setState(prev => ({ ...prev, limit }));
    }, []),

    setSearchTerm: useCallback((term: string) => {
      setSearchTerm(term);
    }, [])
  };

  useEffect(() => {
    if (fetchFn) {
      refetchData();
    }
  }, []);

  return { state, actions };
}
