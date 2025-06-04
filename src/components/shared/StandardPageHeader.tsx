
// Standardized page header component

import React from 'react';
import { StandardHeaderProps } from './types';
import { mergeClassNames } from './utils';
import StandardPageActions from './StandardPageActions';

const StandardPageHeader: React.FC<StandardHeaderProps> = ({
  title,
  description,
  actions,
  className,
  children
}) => {
  return (
    <div className={mergeClassNames("mb-8", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-lg text-gray-600 max-w-4xl">
              {description}
            </p>
          )}
        </div>
        {(actions || children) && (
          <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
            {actions && <StandardPageActions actions={actions} />}
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardPageHeader;
