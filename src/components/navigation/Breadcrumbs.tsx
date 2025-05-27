
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import LinkComponent from './LinkComponent';
import { createBreadcrumbsFromPath } from '@/utils/navigation';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { getHomePathByUserType, getHomeLabelByUserType } from '@/utils/breadcrumbUtils';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { userType, isAuthenticated } = useAuth();
  
  // Get dynamic home path and label based on user type
  const homePath = getHomePathByUserType(userType, isAuthenticated);
  const homeLabel = getHomeLabelByUserType(userType, isAuthenticated);
  
  // Simple route configurations for breadcrumb generation
  const routeConfigs = [
    { path: homePath, metadata: { breadcrumb: homeLabel } },
    { path: '/explore', metadata: { breadcrumb: 'Explore' } },
    { path: '/events', metadata: { breadcrumb: 'Events' } },
    { path: '/swig-circuits', metadata: { breadcrumb: 'Swig Circuits' } },
    { path: '/contact', metadata: { breadcrumb: 'Contact' } },
    { path: '/profile', metadata: { breadcrumb: 'Profile' } },
    { path: '/admin', metadata: { breadcrumb: 'Admin' } },
    { path: '/establishment', metadata: { breadcrumb: 'Establishment' } },
    { path: '/promoter', metadata: { breadcrumb: 'Promoter' } }
  ];

  const breadcrumbs = createBreadcrumbsFromPath(location.pathname, routeConfigs);

  // Replace the first breadcrumb (if it's pointing to '/') with the dynamic home path
  if (breadcrumbs.length > 0 && breadcrumbs[0].path === '/') {
    breadcrumbs[0] = {
      path: homePath,
      label: homeLabel
    };
  }

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">
              {breadcrumb.label}
            </span>
          ) : (
            <LinkComponent 
              href={breadcrumb.path}
              className="hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </LinkComponent>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
