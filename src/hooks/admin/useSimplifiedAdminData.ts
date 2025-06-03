
// Legacy hook - now redirects to core useData hook
import { useData } from '../core/useData';

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
  const { state, actions } = useData<T>({
    initialData,
    itemType,
    searchFields: ['name']
  });

  // Map to legacy interface for backward compatibility
  const legacyState: SimplifiedAdminState<T> = {
    items: state.data,
    isLoading: state.isLoading,
    error: state.error,
    total: state.total,
    page: state.page,
    limit: state.limit,
    searchTerm: state.searchTerm
  };

  const legacyActions: SimplifiedAdminActions<T> = {
    setPage: actions.setPage,
    setLimit: actions.setLimit,
    setSearchTerm: actions.setSearchTerm,
    refresh: () => actions.refresh(),
    deleteItem: (id: string) => actions.delete(id),
    bulkDelete: (ids: string[]) => actions.bulkDelete(ids),
    filterItems: actions.filter
  };

  return { state: legacyState, actions: legacyActions };
}
