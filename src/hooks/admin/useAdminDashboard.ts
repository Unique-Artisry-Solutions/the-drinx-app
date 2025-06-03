
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AdminDashboardState {
  searchTerm: string;
  activeTab: string;
  isLoading: boolean;
  error: string | null;
}

export interface AdminDashboardActions {
  setSearchTerm: (term: string) => void;
  setActiveTab: (tab: string) => void;
  handleRefresh: () => void;
  handleExport: () => void;
  handleAddNew: () => void;
  clearError: () => void;
}

export const useAdminDashboard = (initialTab = 'establishments') => {
  const [state, setState] = useState<AdminDashboardState>({
    searchTerm: '',
    activeTab: initialTab,
    isLoading: false,
    error: null,
  });
  const { toast } = useToast();

  const actions: AdminDashboardActions = {
    setSearchTerm: (searchTerm: string) => {
      setState(prev => ({ ...prev, searchTerm }));
    },

    setActiveTab: (activeTab: string) => {
      setState(prev => ({ ...prev, activeTab }));
    },

    handleRefresh: () => {
      setState(prev => ({ ...prev, isLoading: true }));
      // Simulate refresh
      setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false }));
        toast({
          title: 'Data refreshed',
          description: 'All data has been updated',
        });
      }, 1000);
    },

    handleExport: () => {
      toast({
        title: 'Export started',
        description: 'Your data export will be ready shortly',
      });
    },

    handleAddNew: () => {
      toast({
        title: 'Add new item',
        description: 'This would open the creation dialog',
      });
    },

    clearError: () => {
      setState(prev => ({ ...prev, error: null }));
    },
  };

  return { state, actions };
};
