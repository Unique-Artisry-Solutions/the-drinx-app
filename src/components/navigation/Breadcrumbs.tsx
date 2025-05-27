
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import LinkComponent from './LinkComponent';
import { createBreadcrumbsFromPath } from '@/utils/navigation';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  // Simple route configurations for breadcrumb generation
  const routeConfigs = [
    { path: '/', metadata: { breadcrumb: 'Home' } },
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
