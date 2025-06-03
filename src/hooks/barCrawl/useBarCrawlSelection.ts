
import { useState, useCallback } from 'react';

export interface UseBarCrawlSelectionReturn {
  isLoading: boolean;
  selectEstablishment: (id: string) => void;
}

export const useBarCrawlSelection = (): UseBarCrawlSelectionReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const selectEstablishment = useCallback((id: string) => {
    setIsLoading(true);
    // Basic implementation - can be enhanced later
    console.log('Selecting establishment:', id);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  return {
    isLoading,
    selectEstablishment
  };
};
