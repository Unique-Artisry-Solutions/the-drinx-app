
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DataState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
}

export interface DataActions<T> {
  refetch: () => Promise<void>;
  create: (item: Omit<T, 'id'>) => Promise<void>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export interface UseDataOptions<T> {
  initialData?: T[];
  fetchFn?: () => Promise<T[]>;
  createFn?: (item: Omit<T, 'id'>) => Promise<T>;
  updateFn?: (id: string, updates: Partial<T>) => Promise<T>;
  deleteFn?: (id: string) => Promise<void>;
  itemType?: string;
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
    itemType = 'item'
  } = options;

  const [state, setState] = useState<DataState<T>>({
    data: initialData,
    isLoading: false,
    error: null
  });

  const actions: DataActions<T> = {
    refetch: useCallback(async () => {
      if (!fetchFn) return;
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetchFn();
        setState(prev => ({ ...prev, data, isLoading: false }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to fetch ${itemType}s`;
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [fetchFn, itemType, toast]),

    create: useCallback(async (item: Omit<T, 'id'>) => {
      if (!createFn) return;
      
      try {
        const newItem = await createFn(item);
        setState(prev => ({
          ...prev,
          data: [...prev.data, newItem]
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
        // Fallback to local deletion if no delete function provided
        setState(prev => ({
          ...prev,
          data: prev.data.filter(item => item.id !== id)
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
          data: prev.data.filter(item => item.id !== id)
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
    }, [deleteFn, itemType, toast])
  };

  useEffect(() => {
    if (fetchFn) {
      actions.refetch();
    }
  }, []);

  return { state, actions };
}
