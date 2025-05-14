
import { useLocation } from 'react-router-dom';
import { buildBreadcrumbs, shouldShowBreadcrumbs } from '@/components/navigation/breadcrumbs/BreadcrumbUtils';
import { BreadcrumbItem } from '@/types/navigation/BreadcrumbTypes';

/**
 * Custom hook to generate breadcrumb items based on the current route
 */
export function useBreadcrumbs(): { 
  items: BreadcrumbItem[],
  shouldShow: boolean 
} {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Generate breadcrumb items based on the current route
  const items = buildBreadcrumbs(pathname);
  
  // Determine if breadcrumbs should be shown
  const shouldShow = shouldShowBreadcrumbs(pathname);
  
  return {
    items,
    shouldShow
  };
}
