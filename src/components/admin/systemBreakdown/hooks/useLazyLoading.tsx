
import { useState, useEffect, useCallback } from 'react';
import { FeatureItem } from '../types';

interface LazyLoadingOptions {
  pageSize?: number;
  initialLoad?: number;
}

export const useLazyLoading = (
  features: FeatureItem[],
  options: LazyLoadingOptions = {}
) => {
  const { pageSize = 20, initialLoad = 10 } = options;
  const [loadedCount, setLoadedCount] = useState(initialLoad);
  const [isLoading, setIsLoading] = useState(false);

  const loadedFeatures = features.slice(0, loadedCount);
  const hasMore = loadedCount < features.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate async loading
    setTimeout(() => {
      setLoadedCount(prev => Math.min(prev + pageSize, features.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, pageSize, features.length]);

  // Reset when features change
  useEffect(() => {
    setLoadedCount(Math.min(initialLoad, features.length));
  }, [features, initialLoad]);

  return {
    loadedFeatures,
    hasMore,
    isLoading,
    loadMore,
    totalCount: features.length,
    loadedCount
  };
};
