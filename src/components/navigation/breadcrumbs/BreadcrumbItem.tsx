
import React from 'react';
import { BreadcrumbItem as BreadcrumbItemUI, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import LinkComponent from '../LinkComponent';
import { BreadcrumbItem as BreadcrumbItemType } from './BreadcrumbUtils';

interface BreadcrumbItemProps {
  crumb: BreadcrumbItemType;
  isLast: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ crumb, isLast }) => {
  return (
    <>
      <BreadcrumbItemUI>
        {isLast ? (
          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <LinkComponent href={crumb.path}>
              {crumb.label}
            </LinkComponent>
          </BreadcrumbLink>
        )}
      </BreadcrumbItemUI>
      {!isLast && <BreadcrumbSeparator />}
    </>
  );
};

export default BreadcrumbItem;
