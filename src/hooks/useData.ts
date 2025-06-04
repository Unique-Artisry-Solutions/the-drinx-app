
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DataState<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

interface DataActions<T> {
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
  reset: () => void;
  deleteItem: (id: string) => void;
}

interface UseDataOptions<T> {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  initialData: T;
  fetchFn: () => Promise<T>;
  itemType?: string;
}

interface UseDataReturn<T> {
  state: DataState<T>;
  actions: DataActions<T>;
}

export const useData = <T>(options: UseDataOptions<T>): UseDataReturn<T> => {
  const { 
    enabled = true, 
    refetchInterval, 
    onSuccess, 
    onError,
    initialData,
    fetchFn,
    itemType
  } = options;
  
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      setIsSuccess(true);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsSuccess(false);
      onError?.(errorMessage);
      console.error('Data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, enabled, onSuccess, onError]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
    setIsSuccess(true);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
  }, [initialData]);

  const deleteItem = useCallback((id: string) => {
    if (Array.isArray(data)) {
      const filteredData = (data as any[]).filter(item => item.id !== id);
      setData(filteredData as T);
    }
  }, [data]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refetchInterval, enabled]);

  return {
    state: {
      data,
      isLoading,
      error,
      isSuccess
    },
    actions: {
      refetch: fetchData,
      mutate,
      reset,
      deleteItem
    }
  };
};

// Mutation hook for data changes
export const useDataMutation = <T, TVariables = any>(
  mutateFn: (variables: TVariables) => Promise<T>,
  options: { onSuccess?: (data: T) => void; onError?: (error: string) => void } = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await mutateFn(variables);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Mutation failed';
      setError(errorMessage);
      options.onError?.(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [mutateFn, options, toast]);

  return {
    mutate,
    isLoading,
    error,
    reset: () => setError(null)
  };
};
