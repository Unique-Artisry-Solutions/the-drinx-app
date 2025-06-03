
import { useMemo } from 'react';
import { AdminPageAction } from '@/components/admin/layout';
import { Plus, Download, RefreshCw, Settings, Filter } from 'lucide-react';

export interface AdminActionsConfig {
  showAdd?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  showSettings?: boolean;
  showFilter?: boolean;
  customActions?: AdminPageAction[];
}

export const useAdminActions = (
  config: AdminActionsConfig,
  handlers: {
    onAdd?: () => void;
    onExport?: () => void;
    onRefresh?: () => void;
    onSettings?: () => void;
    onFilter?: () => void;
  }
) => {
  const actions: AdminPageAction[] = useMemo(() => {
    const baseActions: AdminPageAction[] = [];

    if (config.showAdd && handlers.onAdd) {
      baseActions.push({
        label: 'Add New',
        icon: Plus,
        onClick: handlers.onAdd,
        variant: 'default'
      });
    }

    if (config.showExport && handlers.onExport) {
      baseActions.push({
        label: 'Export Data',
        icon: Download,
        onClick: handlers.onExport,
        variant: 'outline'
      });
    }

    if (config.showRefresh && handlers.onRefresh) {
      baseActions.push({
        label: 'Refresh',
        icon: RefreshCw,
        onClick: handlers.onRefresh,
        variant: 'ghost'
      });
    }

    if (config.showSettings && handlers.onSettings) {
      baseActions.push({
        label: 'Settings',
        icon: Settings,
        onClick: handlers.onSettings,
        variant: 'ghost'
      });
    }

    if (config.showFilter && handlers.onFilter) {
      baseActions.push({
        label: 'Filter',
        icon: Filter,
        onClick: handlers.onFilter,
        variant: 'ghost'
      });
    }

    return [...baseActions, ...(config.customActions || [])];
  }, [config, handlers]);

  return actions;
};
