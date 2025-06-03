
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminLayout } from '@/components/admin/layout/AdminLayoutProvider';
import { AdminPageConfig, AdminPageAction } from '@/components/admin/layout/AdminPageWrapper';
import { getPageConfigByPath } from '@/components/admin/layout/utils';

interface UseAdminPageProps {
  config?: AdminPageConfig;
  actions?: AdminPageAction[];
  autoConfig?: boolean;
}

export const useAdminPage = ({
  config,
  actions = [],
  autoConfig = true
}: UseAdminPageProps = {}) => {
  const location = useLocation();
  const { setPageInfo, setPageActions, setBreadcrumbs } = useAdminLayout();

  const effectiveConfig = useMemo(() => {
    if (config) return config;
    if (autoConfig) return getPageConfigByPath(location.pathname);
    return null;
  }, [config, autoConfig, location.pathname]);

  // Set page info
  useEffect(() => {
    if (effectiveConfig) {
      setPageInfo({
        title: effectiveConfig.title,
        description: effectiveConfig.description
      });
    }
  }, [effectiveConfig, setPageInfo]);

  // Set page actions
  useEffect(() => {
    setPageActions(actions);
    return () => setPageActions([]);
  }, [actions, setPageActions]);

  // Auto-generate breadcrumbs
  useEffect(() => {
    if (effectiveConfig?.showBreadcrumbs) {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const breadcrumbs = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        
        return {
          label,
          href: index < pathSegments.length - 1 ? path : undefined
        };
      });
      
      setBreadcrumbs(breadcrumbs);
    }
  }, [location.pathname, effectiveConfig?.showBreadcrumbs, setBreadcrumbs]);

  return {
    config: effectiveConfig,
    setPageActions,
    setPageInfo,
    setBreadcrumbs
  };
};
