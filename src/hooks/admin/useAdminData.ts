
import { useState, useEffect, useMemo } from 'react';
import { Establishment, Cocktail } from '@/types/CoreTypes';

export interface AdminDataState<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
}

export interface AdminDataActions<T> {
  deleteItem: (id: string) => void;
  refreshData: () => void;
  filterItems: (searchTerm: string) => T[];
}

export const useAdminData = <T extends { id: string; name: string }>(
  initialData: T[],
  itemType: string = 'item'
) => {
  const [state, setState] = useState<AdminDataState<T>>({
    items: initialData,
    isLoading: false,
    error: null,
  });

  const actions: AdminDataActions<T> = {
    deleteItem: (id: string) => {
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    },

    refreshData: () => {
      setState(prev => ({ ...prev, isLoading: true }));
      // Simulate data refresh
      setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false }));
      }, 500);
    },

    filterItems: (searchTerm: string) => {
      return state.items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  };

  return { state, actions };
};

// Specialized hooks for specific data types
export const useEstablishmentsData = (initialData: Establishment[]) => {
  return useAdminData(initialData, 'establishment');
};

export const useCocktailsData = (initialData: Cocktail[]) => {
  return useAdminData(initialData, 'cocktail');
};
