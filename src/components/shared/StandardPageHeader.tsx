
import React from 'react';
import { StandardHeaderProps } from './types';
import { StandardPageActions } from './StandardPageActions';

export const StandardPageHeader: React.FC<StandardHeaderProps> = ({
  title,
  description,
  actions = [],
  className = ''
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-lg text-gray-600">{description}</p>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className="flex-shrink-0">
            <StandardPageActions actions={actions} />
          </div>
        )}
      </div>
    </div>
  );
};
