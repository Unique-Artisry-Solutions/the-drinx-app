
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import { buildBreadcrumbs, shouldShowBreadcrumbs } from './BreadcrumbUtils';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  if (!shouldShowBreadcrumbs(location.pathname)) {
    return null;
  }
  
  const breadcrumbs = buildBreadcrumbs(location.pathname);
  
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
