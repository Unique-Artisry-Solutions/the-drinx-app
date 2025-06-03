
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AdminLayoutState {
  sidebarCollapsed: boolean;
  sidebarExpandedCategories: string[];
  currentPageTitle: string;
  currentPageDescription?: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  pageActions: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
    loading?: boolean;
  }>;
}

interface AdminLayoutActions {
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCategory: (categoryPath: string) => void;
  setPageInfo: (info: { title: string; description?: string }) => void;
  setBreadcrumbs: (breadcrumbs: AdminLayoutState['breadcrumbs']) => void;
  setPageActions: (actions: AdminLayoutState['pageActions']) => void;
}

interface AdminLayoutContextType extends AdminLayoutState, AdminLayoutActions {}

const AdminLayoutContext = createContext<AdminLayoutContextType | null>(null);

interface AdminLayoutProviderProps {
  children: React.ReactNode;
}

export const AdminLayoutProvider: React.FC<AdminLayoutProviderProps> = ({ children }) => {
  const location = useLocation();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [sidebarExpandedCategories, setSidebarExpandedCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('admin_sidebar_expanded');
    try {
      return saved ? JSON.parse(saved) : ['/admin/dashboard', '/admin/content', '/admin/system-tools'];
    } catch {
      return ['/admin/dashboard', '/admin/content', '/admin/system-tools'];
    }
  });
  
  const [currentPageTitle, setCurrentPageTitle] = useState('Admin Dashboard');
  const [currentPageDescription, setCurrentPageDescription] = useState<string | undefined>();
  const [breadcrumbs, setBreadcrumbs] = useState<AdminLayoutState['breadcrumbs']>([]);
  const [pageActions, setPageActions] = useState<AdminLayoutState['pageActions']>([]);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('admin_sidebar_expanded', JSON.stringify(sidebarExpandedCategories));
  }, [sidebarExpandedCategories]);

  // Reset page-specific state on route change
  useEffect(() => {
    setPageActions([]);
    // Don't reset title/description as pages should set their own
  }, [location.pathname]);

  const toggleSidebarCategory = (categoryPath: string) => {
    setSidebarExpandedCategories(prev =>
      prev.includes(categoryPath)
        ? prev.filter(path => path !== categoryPath)
        : [...prev, categoryPath]
    );
  };

  const setPageInfo = ({ title, description }: { title: string; description?: string }) => {
    setCurrentPageTitle(title);
    setCurrentPageDescription(description);
  };

  const contextValue: AdminLayoutContextType = {
    sidebarCollapsed,
    sidebarExpandedCategories,
    currentPageTitle,
    currentPageDescription,
    breadcrumbs,
    pageActions,
    setSidebarCollapsed,
    toggleSidebarCategory,
    setPageInfo,
    setBreadcrumbs,
    setPageActions,
  };

  return (
    <AdminLayoutContext.Provider value={contextValue}>
      {children}
    </AdminLayoutContext.Provider>
  );
};

export const useAdminLayout = (): AdminLayoutContextType => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error('useAdminLayout must be used within AdminLayoutProvider');
  }
  return context;
};
