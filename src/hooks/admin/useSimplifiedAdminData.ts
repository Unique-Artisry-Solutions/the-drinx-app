
import { useState, useEffect } from 'react';

export interface SimplifiedAdminState<T> {
  items: T[];
  isLoading: boolean;
  error: string;
  total: number;
}

export interface SimplifiedAdminActions<T> {
  refresh: () => void;
  deleteItem: (id: string) => void;
  setItems: (items: T[]) => void;
}

export function useSimplifiedAdminData<T = any>(
  initialData: T[] = []
): {
  state: SimplifiedAdminState<T>;
  actions: SimplifiedAdminActions<T>;
} {
  const [state, setState] = useState<SimplifiedAdminState<T>>({
    items: initialData,
    isLoading: false,
    error: '',
    total: initialData.length,
  });

  const actions: SimplifiedAdminActions<T> = {
    refresh: () => {
      setState(prev => ({
        ...prev,
        items: initialData,
        total: initialData.length,
      }));
    },
    deleteItem: (id: string) => {
      setState(prev => ({
        ...prev,
        items: prev.items.filter((item: any) => item.id !== id),
        total: prev.total - 1,
      }));
    },
    setItems: (items: T[]) => {
      setState(prev => ({
        ...prev,
        items,
        total: items.length,
      }));
    },
  };

  return { state, actions };
}
