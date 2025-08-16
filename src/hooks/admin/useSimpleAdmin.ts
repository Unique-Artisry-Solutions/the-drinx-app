
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
  setSearch: (term: string) => void;
  refresh: () => void;
  create: (item: Omit<T, 'id'>) => Promise<void>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

export function useSimpleAdmin<T extends { id: string; name?: string }>(
  dataType: 'users' | 'establishments' | 'cocktails',
  initialData: T[] = []
): { state: SimpleAdminState<T>; actions: SimpleAdminActions<T> } {
  
  // Create fetch function based on data type
  const fetchFn = async (): Promise<T[]> => {
    console.log(`🚀 useSimpleAdmin fetchFn called for dataType: ${dataType}`);
    
    try {
      switch (dataType) {
        case 'users':
          console.log('👥 Fetching users via SimplifiedAdminService...');
          const userResponse = await SimplifiedAdminService.getUsers();
          console.log('✅ Users response received:', userResponse);
          return userResponse.data as T[];
        case 'establishments':
          console.log('🏢 Fetching establishments via SimplifiedAdminService...');
          const establishmentResponse = await SimplifiedAdminService.getEstablishments();
          return establishmentResponse.data as unknown as T[];
        case 'cocktails':
          console.log('🍹 Fetching cocktails via SimplifiedAdminService...');
          const cocktailResponse = await SimplifiedAdminService.getCocktails();
          return cocktailResponse.data as unknown as T[];
        default:
          console.warn('⚠️ Unknown dataType:', dataType);
          return [];
      }
    } catch (error) {
      console.error(`❌ useSimpleAdmin fetchFn error for ${dataType}:`, error);
      throw error;
    }
  };

  const { state, actions } = useData<T>({
    initialData,
    itemType: dataType,
    searchFields: dataType === 'users' ? ['display_name' as keyof T, 'username' as keyof T] : ['name' as keyof T],
    fetchFn
  });

  // Map core actions to simple admin interface with correct method names
  const simpleActions: SimpleAdminActions<T> = {
    setPage: actions.setPage,
    setLimit: actions.setLimit,
    setSearch: (term: string) => {
      console.log(`🔍 useSimpleAdmin setSearch called with term: "${term}" for dataType: ${dataType}`);
      actions.setSearchTerm(term);
      // For users, we'll implement server-side search by refreshing with new params
      if (dataType === 'users') {
        console.log('🔄 Triggering refresh for server-side search...');
        // TODO: Pass search term to the service - for now just refresh
        actions.refresh();
      }
    },
    refresh: () => actions.refresh(),
    create: actions.create,
    update: actions.update,
    deleteItem: async (id: string) => {
      try {
        let success = false;
        switch (dataType) {
          case 'users':
            success = await SimplifiedAdminService.deleteUser(id);
            break;
          case 'establishments':
            success = await SimplifiedAdminService.deleteEstablishment(id);
            break;
          case 'cocktails':
            success = await SimplifiedAdminService.deleteCocktail(id);
            break;
        }
        if (success) {
          actions.delete(id); // Update local state
        }
      } catch (error) {
        console.error(`Error deleting ${dataType}:`, error);
      }
    },
    bulkDelete: async (ids: string[]) => {
      try {
        const success = await SimplifiedAdminService.bulkDelete(ids, dataType);
        if (success) {
          actions.bulkDelete(ids); // Update local state
        }
      } catch (error) {
        console.error(`Error bulk deleting ${dataType}:`, error);
      }
    }
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
