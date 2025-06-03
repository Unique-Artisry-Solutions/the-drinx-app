
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { BaseAdminService, QueryParams, PaginatedResponse } from '@/services/admin';

export interface AdminEntityState<T> {
  // Data State
  items: T[];
  itemsById: Record<string, T>;
  
  // Loading States
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  
  // Error States
  error: string | null;
  itemErrors: Record<string, string>;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filters & Search
  filters: Record<string, any>;
  searchQuery: string;
  
  // Selection
  selectedIds: Set<string>;
  
  // Cache
  lastFetch: Date | null;
  cacheExpiry: Date | null;
}

export interface AdminEntityActions<T> {
  // CRUD Operations
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  createItem: (data: any) => Promise<T | null>;
  updateItem: (id: string, data: any) => Promise<T | null>;
  deleteItem: (id: string) => Promise<boolean>;
  bulkDelete: (ids: string[]) => Promise<boolean>;
  
  // Search & Filter
  setFilters: (filters: Record<string, any>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  
  // Selection
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  
  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Error handling
  clearError: () => void;
  clearItemError: (id: string) => void;
}

export function useAdminService<T extends { id: string }>(
  service: BaseAdminService<T>,
  initialParams: QueryParams = {}
) {
  const { toast } = useToast();
  const mounted = useRef(true);
  
  const [state, setState] = useState<AdminEntityState<T>>({
    items: [],
    itemsById: {},
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
    error: null,
    itemErrors: {},
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    },
    filters: initialParams.filters || {},
    searchQuery: '',
    selectedIds: new Set(),
    lastFetch: null,
    cacheExpiry: null
  });

  const updateState = useCallback((updates: Partial<AdminEntityState<T>>) => {
    if (!mounted.current) return;
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadData = useCallback(async (params: QueryParams = {}, append = false) => {
    const queryParams = {
      ...initialParams,
      ...params,
      filters: { ...state.filters, ...(params.filters || {}) }
    };

    if (!append) {
      updateState({ isLoading: true, error: null });
    } else {
      updateState({ isLoadingMore: true });
    }

    try {
      const response: PaginatedResponse<T> = await service.getAll(queryParams);
      
      const itemsById = response.data.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, T>);

      updateState({
        items: append ? [...state.items, ...response.data] : response.data,
        itemsById: append ? { ...state.itemsById, ...itemsById } : itemsById,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages
        },
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false,
        lastFetch: new Date(),
        cacheExpiry: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      updateState({
        error: errorMessage,
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false
      });
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [service, state.filters, state.items, state.itemsById, initialParams, updateState, toast]);

  const actions: AdminEntityActions<T> = {
    refresh: useCallback(async () => {
      updateState({ isRefreshing: true });
      await loadData({ 
        page: state.pagination.page, 
        limit: state.pagination.limit,
        filters: state.filters 
      });
    }, [loadData, state.pagination.page, state.pagination.limit, state.filters, updateState]),

    loadMore: useCallback(async () => {
      if (state.pagination.page < state.pagination.totalPages) {
        await loadData({
          page: state.pagination.page + 1,
          limit: state.pagination.limit,
          filters: state.filters
        }, true);
      }
    }, [loadData, state.pagination, state.filters]),

    createItem: useCallback(async (data: any) => {
      try {
        const newItem = await service.create(data);
        
        // Optimistic update
        updateState({
          items: [newItem, ...state.items],
          itemsById: { ...state.itemsById, [newItem.id]: newItem }
        });

        toast({
          title: 'Success',
          description: 'Item created successfully'
        });

        return newItem;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create item';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
        return null;
      }
    }, [service, state.items, state.itemsById, updateState, toast]),

    updateItem: useCallback(async (id: string, data: any) => {
      try {
        // Optimistic update
        const optimisticItem = { ...state.itemsById[id], ...data };
        updateState({
          itemsById: { ...state.itemsById, [id]: optimisticItem },
          items: state.items.map(item => item.id === id ? optimisticItem : item)
        });

        const updatedItem = await service.update(id, data);
        
        // Replace with actual data
        updateState({
          itemsById: { ...state.itemsById, [id]: updatedItem },
          items: state.items.map(item => item.id === id ? updatedItem : item)
        });

        toast({
          title: 'Success',
          description: 'Item updated successfully'
        });

        return updatedItem;
      } catch (error) {
        // Rollback optimistic update
        await actions.refresh();
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
        updateState({
          itemErrors: { ...state.itemErrors, [id]: errorMessage }
        });
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
        return null;
      }
    }, [service, state.items, state.itemsById, state.itemErrors, updateState, toast]),

    deleteItem: useCallback(async (id: string) => {
      try {
        // Optimistic update
        updateState({
          items: state.items.filter(item => item.id !== id),
          itemsById: Object.fromEntries(
            Object.entries(state.itemsById).filter(([key]) => key !== id)
          ),
          selectedIds: new Set([...state.selectedIds].filter(selectedId => selectedId !== id))
        });

        await service.delete(id);

        toast({
          title: 'Success',
          description: 'Item deleted successfully'
        });

        return true;
      } catch (error) {
        // Rollback optimistic update
        await actions.refresh();
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
        return false;
      }
    }, [service, state.items, state.itemsById, state.selectedIds, updateState, toast]),

    bulkDelete: useCallback(async (ids: string[]) => {
      try {
        // Optimistic update
        updateState({
          items: state.items.filter(item => !ids.includes(item.id)),
          itemsById: Object.fromEntries(
            Object.entries(state.itemsById).filter(([key]) => !ids.includes(key))
          ),
          selectedIds: new Set()
        });

        await service.bulkDelete(ids);

        toast({
          title: 'Success',
          description: `${ids.length} items deleted successfully`
        });

        return true;
      } catch (error) {
        // Rollback optimistic update
        await actions.refresh();
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete items';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
        return false;
      }
    }, [service, state.items, state.itemsById, updateState, toast]),

    setFilters: useCallback((filters: Record<string, any>) => {
      updateState({ filters });
      loadData({ page: 1, limit: state.pagination.limit, filters });
    }, [loadData, state.pagination.limit, updateState]),

    setSearchQuery: useCallback((searchQuery: string) => {
      updateState({ searchQuery });
      // Debounce search in a real implementation
      if (searchQuery.trim()) {
        service.search({ 
          query: searchQuery, 
          fields: ['name', 'description'] 
        }).then(response => {
          updateState({
            items: response.data,
            itemsById: response.data.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
            }, {} as Record<string, T>)
          });
        });
      } else {
        loadData({ page: 1, limit: state.pagination.limit, filters: state.filters });
      }
    }, [service, loadData, state.pagination.limit, state.filters, updateState]),

    clearFilters: useCallback(() => {
      updateState({ filters: {}, searchQuery: '' });
      loadData({ page: 1, limit: state.pagination.limit });
    }, [loadData, state.pagination.limit, updateState]),

    selectItem: useCallback((id: string) => {
      updateState({
        selectedIds: new Set([...state.selectedIds, id])
      });
    }, [state.selectedIds, updateState]),

    deselectItem: useCallback((id: string) => {
      const newSelectedIds = new Set(state.selectedIds);
      newSelectedIds.delete(id);
      updateState({ selectedIds: newSelectedIds });
    }, [state.selectedIds, updateState]),

    selectAll: useCallback(() => {
      updateState({
        selectedIds: new Set(state.items.map(item => item.id))
      });
    }, [state.items, updateState]),

    deselectAll: useCallback(() => {
      updateState({ selectedIds: new Set() });
    }, [updateState]),

    setPage: useCallback((page: number) => {
      loadData({ page, limit: state.pagination.limit, filters: state.filters });
    }, [loadData, state.pagination.limit, state.filters]),

    setLimit: useCallback((limit: number) => {
      loadData({ page: 1, limit, filters: state.filters });
    }, [loadData, state.filters]),

    clearError: useCallback(() => {
      updateState({ error: null });
    }, [updateState]),

    clearItemError: useCallback((id: string) => {
      updateState({
        itemErrors: Object.fromEntries(
          Object.entries(state.itemErrors).filter(([key]) => key !== id)
        )
      });
    }, [state.itemErrors, updateState])
  };

  // Initial load
  useEffect(() => {
    loadData(initialParams);
    
    return () => {
      mounted.current = false;
    };
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const unsubscribe = service.subscribe((data) => {
      updateState({
        items: data,
        itemsById: data.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {} as Record<string, T>)
      });
    });

    return unsubscribe;
  }, [service, updateState]);

  return { state, actions };
}
