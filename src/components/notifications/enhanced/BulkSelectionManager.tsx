import React, { createContext, useContext, useState, useCallback } from 'react';
import { Notification } from '@/types/notification';

interface BulkSelectionContextType {
  selectedIds: string[];
  isSelected: (id: string) => boolean;
  toggleSelection: (id: string) => void;
  selectAll: (notifications: Notification[]) => void;
  selectNone: () => void;
  selectByFilter: (notifications: Notification[], filter: (n: Notification) => boolean) => void;
  selectRange: (notifications: Notification[], startId: string, endId: string) => void;
}

const BulkSelectionContext = createContext<BulkSelectionContextType | null>(null);

export const useBulkSelection = () => {
  const context = useContext(BulkSelectionContext);
  if (!context) {
    throw new Error('useBulkSelection must be used within BulkSelectionProvider');
  }
  return context;
};

interface BulkSelectionProviderProps {
  children: React.ReactNode;
}

export const BulkSelectionProvider: React.FC<BulkSelectionProviderProps> = ({ 
  children 
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isSelected = useCallback((id: string) => {
    return selectedIds.includes(id);
  }, [selectedIds]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((notifications: Notification[]) => {
    setSelectedIds(notifications.map(n => n.id));
  }, []);

  const selectNone = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectByFilter = useCallback((
    notifications: Notification[], 
    filter: (n: Notification) => boolean
  ) => {
    const filteredIds = notifications.filter(filter).map(n => n.id);
    setSelectedIds(filteredIds);
  }, []);

  const selectRange = useCallback((
    notifications: Notification[], 
    startId: string, 
    endId: string
  ) => {
    const startIndex = notifications.findIndex(n => n.id === startId);
    const endIndex = notifications.findIndex(n => n.id === endId);
    
    if (startIndex === -1 || endIndex === -1) return;
    
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    
    const rangeIds = notifications.slice(start, end + 1).map(n => n.id);
    setSelectedIds(prev => [...new Set([...prev, ...rangeIds])]);
  }, []);

  const value: BulkSelectionContextType = {
    selectedIds,
    isSelected,
    toggleSelection,
    selectAll,
    selectNone,
    selectByFilter,
    selectRange
  };

  return (
    <BulkSelectionContext.Provider value={value}>
      {children}
    </BulkSelectionContext.Provider>
  );
};