
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import { buildBreadcrumbs, shouldShowBreadcrumbs } from './BreadcrumbUtils';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { isDevelopment, isDevModeActive } = useDevelopmentMode();
  const { userType, isAuthenticated } = useDevAuthBypass();
  
  if (!shouldShowBreadcrumbs(location.pathname)) {
    return null;
  }
  
  const breadcrumbs = buildBreadcrumbs(location.pathname, userType, isAuthenticated);
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem 
            key={crumb.path || index} 
            crumb={crumb} 
            isLast={index === breadcrumbs.length - 1} 
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
