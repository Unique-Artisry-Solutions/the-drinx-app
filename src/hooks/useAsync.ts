
import { useState, useEffect } from 'react';

/**
 * A hook for handling asynchronous operations with loading, error, and result states
 * @param asyncFn - The async function to execute
 * @param deps - Dependencies array that triggers re-execution when changed
 * @returns Object containing value, loading state, error, and execute function
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: any[] = []
): {
  value: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<T>;
} {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      setValue(result);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { value, loading, error, execute };
}
