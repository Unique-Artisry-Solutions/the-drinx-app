
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { 
  BreadcrumbItem as UIBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { BreadcrumbConfig } from './BreadcrumbConfig';

interface BreadcrumbItemProps {
  crumb: BreadcrumbConfig;
  isLast: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ crumb, isLast }) => {
  return (
    <React.Fragment>
      <UIBreadcrumbItem>
        {isLast ? (
          <BreadcrumbPage className="flex items-center">
            {crumb.icon && crumb.icon}
            <span className={crumb.icon ? "ml-1" : ""}>{crumb.label}</span>
          </BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link to={crumb.path} className="flex items-center hover:text-primary transition-colors">
              {crumb.icon && crumb.icon}
              <span className={crumb.icon ? "ml-1" : ""}>{crumb.label}</span>
            </Link>
          </BreadcrumbLink>
        )}
      </UIBreadcrumbItem>
      {!isLast && <BreadcrumbSeparator><ChevronRight className="h-3 w-3" /></BreadcrumbSeparator>}
    </React.Fragment>
  );
};

export default BreadcrumbItem;
