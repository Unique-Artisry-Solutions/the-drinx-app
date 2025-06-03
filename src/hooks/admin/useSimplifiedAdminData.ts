
// Legacy hook - redirects to core useSimpleAdmin hook for backward compatibility
// This file is deprecated and will be removed in a future version
import { useSimpleAdmin, SimpleAdminState, SimpleAdminActions } from './useSimpleAdmin';

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

/**
 * @deprecated Use useSimpleAdmin instead
 * This hook is maintained for backward compatibility only
 */
export function useSimplifiedAdminData<T extends { id: string; name?: string }>(
  initialData: T[] = [],
  itemType: string = 'item'
) {
  console.warn('useSimplifiedAdminData is deprecated. Use useSimpleAdmin instead.');
  
  const { state, actions } = useSimpleAdmin<T>(
    itemType as 'users' | 'establishments' | 'cocktails',
    initialData
  );

  // Map to legacy interface for backward compatibility
  const legacyState: SimplifiedAdminState<T> = {
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    total: state.total,
    page: state.page,
    limit: state.limit,
    searchTerm: '' // Not tracked in new interface
  };

  const legacyActions: SimplifiedAdminActions<T> = {
    setPage: actions.setPage,
    setLimit: actions.setLimit,
    setSearchTerm: actions.setSearch,
    refresh: actions.refresh,
    deleteItem: actions.deleteItem,
    bulkDelete: actions.bulkDelete,
    filterItems: (searchTerm: string) => state.items.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    )
  };

  return { state: legacyState, actions: legacyActions };
}
