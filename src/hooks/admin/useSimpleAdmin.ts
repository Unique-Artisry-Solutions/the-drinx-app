
import { useData } from '../core/useData';
import { SimplifiedAdminService } from '@/services/admin/SimplifiedAdminService';

export interface SimpleAdminState<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

export interface SimpleAdminActions<T> {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  refresh: () => void;
  create: (item: Omit<T, 'id'>) => Promise<void>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

export function useSimpleAdmin<T extends { id: string; name?: string }>(
  dataType: 'users' | 'establishments' | 'cocktails',
  initialData: T[] = []
): { state: SimpleAdminState<T>; actions: SimpleAdminActions<T> } {
  
  const { state, actions } = useData<T>({
    initialData,
    itemType: dataType,
    searchFields: ['name' as keyof T]
  });

  // Map core actions to simple admin interface
  const simpleActions: SimpleAdminActions<T> = {
    setPage: actions.setPage,
    setLimit: actions.setLimit,
    setSearchTerm: actions.setSearchTerm,
    refresh: () => actions.refresh(),
    create: actions.create,
    update: actions.update,
    delete: actions.delete,
    bulkDelete: actions.bulkDelete
  };

  const simpleState: SimpleAdminState<T> = {
    items: state.data,
    isLoading: state.isLoading,
    error: state.error,
    total: state.total,
    page: state.page,
    limit: state.limit
  };

  return { state: simpleState, actions: simpleActions };
}
