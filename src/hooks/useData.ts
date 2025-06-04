
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseDataOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

interface UseDataResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  invalidate: () => void;
}

interface UseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[][];
}

interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  isLoading: boolean;
  error: Error | null;
}

export function useData<T>(options: UseDataOptions<T>): UseDataResult<T> {
  const { queryKey, queryFn, enabled = true, staleTime = 5 * 60 * 1000, cacheTime = 10 * 60 * 1000 } = options;
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    cacheTime,
    retry: 2
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
    invalidate
  };
}

export function useDataMutation<TData, TVariables>(
  options: UseMutationOptions<TData, TVariables>
): UseMutationResult<TData, TVariables> {
  const queryClient = useQueryClient();
  const { mutationFn, onSuccess, onError, invalidateQueries } = options;

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      onSuccess?.(data);
      if (invalidateQueries) {
        invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
    },
    onError: (error) => {
      onError?.(error as Error);
    }
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null
  };
}
